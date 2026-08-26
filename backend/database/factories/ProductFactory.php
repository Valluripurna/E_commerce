<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'category_id' => Category::factory(),
            'name' => ucfirst($name),
            'slug' => Str::slug($name),
            'description' => fake()->paragraph(),
            'price' => fake()->randomFloat(2, 9.99, 499.99),
            'compare_at_price' => fake()->optional()->randomFloat(2, 10, 599.99),
            'sku' => strtoupper(Str::random(8)),
            'stock_quantity' => fake()->numberBetween(0, 100),
            'low_stock_threshold' => 5,
            'is_active' => true,
            'is_featured' => fake()->boolean(20),
            'attributes' => ['color' => fake()->safeColorName()],
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Product $product) {
            ProductImage::create([
                'product_id' => $product->id,
                'url' => 'https://picsum.photos/seed/'.$product->id.'/400/400',
                'alt_text' => $product->name,
                'is_primary' => true,
                'sort_order' => 0,
            ]);
        });
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }

    public function outOfStock(): static
    {
        return $this->state(fn () => ['stock_quantity' => 0]);
    }
}
