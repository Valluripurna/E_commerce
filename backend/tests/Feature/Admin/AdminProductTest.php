<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_product(): void
    {
        $admin = User::factory()->admin()->create();
        $category = Category::factory()->create();
        $token = $admin->createToken('test')->plainTextToken;

        $response = $this->withToken($token)->postJson('/api/v1/admin/products', [
            'category_id' => $category->id,
            'name' => 'Smart Watch X',
            'sku' => 'SWATCHX01',
            'price' => 199.99,
            'stock_quantity' => 25,
            'images' => [
                ['url' => 'https://picsum.photos/400/400', 'is_primary' => true],
            ],
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.name', 'Smart Watch X');

        $this->assertDatabaseHas('products', ['sku' => 'SWATCHX01']);
    }

    public function test_customer_cannot_create_product(): void
    {
        $customer = User::factory()->customer()->create();
        $category = Category::factory()->create();
        $token = $customer->createToken('test')->plainTextToken;

        $this->withToken($token)->postJson('/api/v1/admin/products', [
            'category_id' => $category->id,
            'name' => 'Blocked Product',
            'sku' => 'BLOCKED01',
            'price' => 10,
            'stock_quantity' => 1,
        ])->assertForbidden();
    }
}
