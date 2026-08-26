<?php

namespace Tests\Feature\Catalog;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductCatalogTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_list_active_products(): void
    {
        Product::factory()->count(3)->create();
        Product::factory()->inactive()->create();

        $response = $this->getJson('/api/v1/products');

        $response->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_products_can_be_filtered_by_category(): void
    {
        $category = Category::factory()->create();
        Product::factory()->count(2)->create(['category_id' => $category->id]);
        Product::factory()->create();

        $response = $this->getJson('/api/v1/products?category_id='.$category->id);

        $response->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_products_can_be_searched_by_name(): void
    {
        Product::factory()->create(['name' => 'Wireless Headphones Pro']);
        Product::factory()->create(['name' => 'Cotton T-Shirt']);

        $response = $this->getJson('/api/v1/products?q=Headphones');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Wireless Headphones Pro');
    }
}
