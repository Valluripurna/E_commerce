<?php

namespace App\Services;

use App\Events\OrderStatusUpdated;
use App\Models\Cart;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

class OrderService
{
    public function __construct(private PaymentService $paymentService)
    {
    }

    public function placeOrder(User $user, array $payload): array
    {
        return DB::transaction(function () use ($user, $payload) {
            $cart = Cart::query()
                ->where('user_id', $user->id)
                ->with(['items.product'])
                ->lockForUpdate()
                ->first();

            if (!$cart || $cart->items->isEmpty()) {
                throw new RuntimeException('Your cart is empty.');
            }

            foreach ($cart->items as $item) {
                $product = Product::query()->lockForUpdate()->find($item->product_id);
                if (!$product || !$product->is_active) {
                    throw new RuntimeException("Product {$item->product_id} is no longer available.");
                }
                if ($product->stock_quantity < $item->quantity) {
                    throw new RuntimeException("Insufficient stock for {$product->name}.");
                }
            }

            $subtotal = $cart->items->sum(fn ($item) => $item->quantity * $item->unit_price);
            $taxAmount = round($subtotal * 0.08, 2);
            $shippingAmount = $subtotal >= 100 ? 0 : 9.99;
            $totalAmount = round($subtotal + $taxAmount + $shippingAmount, 2);

            $order = Order::create([
                'order_number' => $this->generateOrderNumber(),
                'user_id' => $user->id,
                'status' => 'pending',
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'shipping_amount' => $shippingAmount,
                'discount_amount' => 0,
                'total_amount' => $totalAmount,
                'currency' => 'USD',
                'shipping_address' => $payload['shipping_address'],
                'billing_address' => $payload['billing_address'] ?? $payload['shipping_address'],
                'customer_notes' => $payload['customer_notes'] ?? null,
                'placed_at' => now(),
            ]);

            foreach ($cart->items as $item) {
                $product = Product::find($item->product_id);

                $order->items()->create([
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_sku' => $product->sku,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'total_price' => $item->quantity * $item->unit_price,
                ]);

                $product->decrement('stock_quantity', $item->quantity);
            }

            $payment = Payment::create([
                'order_id' => $order->id,
                'payment_method' => $payload['payment_method'],
                'status' => 'pending',
                'amount' => $totalAmount,
                'currency' => 'USD',
            ]);

            $cart->items()->delete();

            $paymentIntent = $this->paymentService->createPaymentIntent($order, $payment);

            OrderStatusUpdated::dispatch($order->fresh(['payment', 'items']));

            return [
                'order' => $order->load(['items', 'payment']),
                'client_secret' => $paymentIntent['client_secret'] ?? null,
                'payment_intent_id' => $paymentIntent['id'] ?? null,
            ];
        });
    }

    public function markOrderPaid(Order $order, Payment $payment, ?array $gatewayResponse = null): Order
    {
        $payment->update([
            'status' => 'completed',
            'paid_at' => now(),
            'gateway_response' => $gatewayResponse,
        ]);

        $order->update(['status' => 'processing']);

        OrderStatusUpdated::dispatch($order->fresh(['payment', 'items']));

        return $order;
    }

    public function updateStatus(Order $order, string $status): Order
    {
        $updates = ['status' => $status];

        match ($status) {
            'shipped' => $updates['shipped_at'] = now(),
            'delivered' => $updates['delivered_at'] = now(),
            'cancelled' => $updates['cancelled_at'] = now(),
            default => null,
        };

        $order->update($updates);
        OrderStatusUpdated::dispatch($order->fresh(['payment', 'items']));

        return $order;
    }

    private function generateOrderNumber(): string
    {
        do {
            $number = 'ORD-'.strtoupper(Str::random(8));
        } while (Order::where('order_number', $number)->exists());

        return $number;
    }
}
