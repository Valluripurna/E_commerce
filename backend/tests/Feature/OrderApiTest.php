<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_create_order_from_cart(): void
    {
        /** @var User $user */
        $user = User::factory()->create(['role' => 'customer']);

        $category = Category::create([
            'name' => 'Electronics',
            'slug' => 'electronics',
            'is_active' => true,
        ]);

        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Test Smartphone',
            'slug' => 'test-smartphone',
            'sku' => 'PHONE-001',
            'price' => 599.99,
            'stock_quantity' => 10,
            'is_active' => true,
        ]);

        // Add item to cart
        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/cart/items', [
                'product_id' => $product->id,
                'quantity' => 1,
            ])
            ->assertStatus(200);

        // Place order
        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/orders', [
                'shipping_address' => '123 Tech Street, Silicon Valley, CA',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'order' => ['id', 'order_number', 'total_amount', 'status'],
            ]);

        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'total_amount' => 599.99,
        ]);
    }
}
