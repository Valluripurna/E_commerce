<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\OrderResource;
use App\Models\Order;
use App\Models\Payment;
use App\Services\OrderService;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(
        private PaymentService $paymentService,
        private OrderService $orderService,
    ) {
    }

    /**
     * Confirm payment in local/test mode (simulated Stripe success).
     */
    public function confirm(Request $request): JsonResponse
    {
        $request->validate([
            'order_id' => ['required', 'exists:orders,id'],
        ]);

        $order = Order::with('payment')->findOrFail($request->order_id);

        if ($order->user_id !== $request->user()->id) {
            abort(403);
        }

        $payment = $order->payment;
        if (!$payment) {
            return response()->json(['message' => 'Payment not found.'], 404);
        }

        if (!app()->environment('local', 'testing') && !config('services.stripe.simulate_confirm')) {
            return response()->json([
                'message' => 'Use Stripe webhook for payment confirmation in production.',
            ], 403);
        }

        if (!$this->paymentService->confirmSimulatedPayment($payment)) {
            return response()->json(['message' => 'Payment cannot be confirmed.'], 422);
        }

        $order = $this->orderService->markOrderPaid($order, $payment, ['simulated' => true]);

        return response()->json([
            'message' => 'Payment confirmed.',
            'data' => new OrderResource($order->load(['items', 'payment'])),
        ]);
    }

    public function webhook(Request $request): JsonResponse
    {
        $this->paymentService->handleWebhookPayload(
            $request->getContent(),
            $request->header('Stripe-Signature')
        );

        return response()->json(['received' => true]);
    }
}
