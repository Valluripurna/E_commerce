<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Electronics', 'slug' => 'electronics'],
            ['name' => 'Fashion', 'slug' => 'fashion'],
            ['name' => 'Home & Kitchen', 'slug' => 'home-kitchen'],
            ['name' => 'Sports', 'slug' => 'sports'],
        ];

        foreach ($categories as $index => $data) {
            $category = Category::create([
                'name' => $data['name'],
                'slug' => $data['slug'],
                'description' => "Browse our {$data['name']} collection.",
                'is_active' => true,
                'sort_order' => $index,
            ]);

            $products = [
                ['name' => "Premium {$data['name']} Item A", 'price' => 49.99],
                ['name' => "Best Seller {$data['name']} Item B", 'price' => 89.99],
                ['name' => "Budget {$data['name']} Item C", 'price' => 19.99],
            ];

            foreach ($products as $pIndex => $productData) {
                $slug = Str::slug($productData['name']);

                $product = Product::create([
                    'category_id' => $category->id,
                    'name' => $productData['name'],
                    'slug' => $slug,
                    'description' => fake()->paragraph(),
                    'price' => $productData['price'],
                    'compare_at_price' => $productData['price'] + 10,
                    'sku' => strtoupper(Str::random(8)),
                    'stock_quantity' => fake()->numberBetween(10, 50),
                    'is_active' => true,
                    'is_featured' => $pIndex === 0,
                ]);

                ProductImage::create([
                    'product_id' => $product->id,
                    'url' => 'https://picsum.photos/seed/'.$product->id.'/400/400',
                    'alt_text' => $product->name,
                    'is_primary' => true,
                    'sort_order' => 0,
                ]);
            }
        }
    }
}
