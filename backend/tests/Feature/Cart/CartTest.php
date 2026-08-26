<?php

namespace Tests\Feature\Cart;

use App\Models\Cart;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_add_item_to_cart(): void
    {
        $customer = User::factory()->customer()->create();
        Cart::firstOrCreate(['user_id' => $customer->id]);
        $product = Product::factory()->create(['stock_quantity' => 10, 'price' => 25.00]);
        $token = $customer->createToken('test')->plainTextToken;

        $response = $this->withToken($token)->postJson('/api/v1/cart/items', [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.item_count', 2)
            ->assertJsonPath('data.subtotal', 50);

        $this->assertDatabaseHas('cart_items', [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);
    }

    public function test_cannot_add_more_than_stock(): void
    {
        $customer = User::factory()->customer()->create();
        Cart::firstOrCreate(['user_id' => $customer->id]);
        $product = Product::factory()->create(['stock_quantity' => 2]);
        $token = $customer->createToken('test')->plainTextToken;

        $this->withToken($token)->postJson('/api/v1/cart/items', [
            'product_id' => $product->id,
            'quantity' => 5,
        ])->assertUnprocessable();
    }
}
