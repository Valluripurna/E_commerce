<?php

namespace Tests\Feature\Order;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderPlacementTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_place_order_from_cart(): void
    {
        $customer = User::factory()->customer()->create();
        $cart = Cart::firstOrCreate(['user_id' => $customer->id]);
        $product = Product::factory()->create([
            'stock_quantity' => 10,
            'price' => 50.00,
        ]);

        CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'unit_price' => 50.00,
        ]);

        $token = $customer->createToken('test')->plainTextToken;

        $response = $this->withToken($token)->postJson('/api/v1/orders', [
            'shipping_address' => '123 Main St, City, 12345',
            'payment_method' => 'stripe',
        ]);

        $response->assertCreated()
            ->assertJsonStructure(['data', 'payment' => ['client_secret', 'payment_intent_id']]);

        $this->assertDatabaseHas('orders', ['user_id' => $customer->id]);
        $this->assertDatabaseHas('order_items', ['product_id' => $product->id, 'quantity' => 2]);
        $this->assertDatabaseHas('products', ['id' => $product->id, 'stock_quantity' => 8]);
        $this->assertDatabaseCount('cart_items', 0);
    }

    public function test_payment_confirm_marks_order_processing(): void
    {
        $customer = User::factory()->customer()->create();
        $cart = Cart::firstOrCreate(['user_id' => $customer->id]);
        $product = Product::factory()->create(['stock_quantity' => 5, 'price' => 20]);

        CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 1,
            'unit_price' => 20,
        ]);

        $token = $customer->createToken('test')->plainTextToken;

        $orderResponse = $this->withToken($token)->postJson('/api/v1/orders', [
            'shipping_address' => '456 Oak Ave',
            'payment_method' => 'stripe',
        ]);

        $orderId = $orderResponse->json('data.id');

        $confirmResponse = $this->withToken($token)->postJson('/api/v1/payments/confirm', [
            'order_id' => $orderId,
        ]);

        $confirmResponse->assertOk()
            ->assertJsonPath('data.status', 'processing');
    }
}
