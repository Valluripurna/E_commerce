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
        $catalog = [
            [
                'category' => 'Electronics & Gadgets',
                'slug' => 'electronics',
                'description' => 'Latest flagship smartphones, wireless audio, laptops, and smart wearables.',
                'products' => [
                    [
                        'name' => 'Pro Wireless Noise-Canceling Headphones',
                        'price' => 199.99,
                        'compare' => 249.99,
                        'description' => 'Immerse yourself in rich, high-fidelity sound with adaptive active noise cancellation, 40-hour battery life, and ultra-soft memory foam earcups.',
                        'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
                        'featured' => true,
                    ],
                    [
                        'name' => 'UltraSlim 15" M3 Laptop Pro',
                        'price' => 1299.00,
                        'compare' => 1499.00,
                        'description' => 'Engineered for creators with a breathtaking Liquid Retina XDR display, 18-hour battery, 16GB unified memory, and silent fanless cooling.',
                        'image' => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
                        'featured' => true,
                    ],
                    [
                        'name' => 'Flagship 5G Smartphone 256GB',
                        'price' => 899.99,
                        'compare' => 999.99,
                        'description' => 'Featuring a 200MP AI camera matrix, 120Hz AMOLED display, 5000mAh battery with 65W fast charging, and IP68 water resistance.',
                        'image' => 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
                        'featured' => true,
                    ],
                    [
                        'name' => 'Smart Fitness Watch Series 9',
                        'price' => 249.50,
                        'compare' => 299.00,
                        'description' => 'Track continuous HR, SpO2, sleep stages, and GPS routes with an edge-to-edge Always-On display and 7-day battery life.',
                        'image' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
                        'featured' => false,
                    ],
                    [
                        'name' => 'Custom RGB Mechanical Keyboard',
                        'price' => 129.99,
                        'compare' => 159.99,
                        'description' => 'Hot-swappable linear switches, aircraft-grade aluminum frame, PBT keycaps, and customizable per-key RGB backlighting.',
                        'image' => 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
                        'featured' => false,
                    ],
                ]
            ],
            [
                'category' => 'Fashion & Apparel',
                'slug' => 'fashion',
                'description' => 'Trending styles, premium denim, jackets, and designer footwear.',
                'products' => [
                    [
                        'name' => 'Classic Heritage Leather Jacket',
                        'price' => 189.99,
                        'compare' => 230.00,
                        'description' => 'Crafted from 100% genuine full-grain lambskin leather with heavy-duty YKK zippers and quilted inner lining.',
                        'image' => 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
                        'featured' => true,
                    ],
                    [
                        'name' => 'Urban Pro Running Sneakers',
                        'price' => 119.00,
                        'compare' => 140.00,
                        'description' => 'Responsive nitrogen-infused foam midsole providing maximum energy return, breathable knit mesh upper, and anti-slip rubber outsole.',
                        'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
                        'featured' => false,
                    ],
                    [
                        'name' => 'Minimalist Chronograph Wristwatch',
                        'price' => 159.99,
                        'compare' => 199.99,
                        'description' => 'Japanese quartz movement, scratch-resistant sapphire crystal glass, 50m water resistance, and genuine Italian leather strap.',
                        'image' => 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80',
                        'featured' => false,
                    ],
                    [
                        'name' => 'UV400 Polarized Designer Sunglasses',
                        'price' => 79.50,
                        'compare' => 99.00,
                        'description' => 'Handcrafted acetate frame with 100% UV blocking TAC polarized lenses that eliminate glare for driving and outdoor activities.',
                        'image' => 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
                        'featured' => false,
                    ],
                ]
            ],
            [
                'category' => 'Home & Living',
                'slug' => 'home-living',
                'description' => 'Modern furniture, espresso makers, smart lighting, and home decor.',
                'products' => [
                    [
                        'name' => 'Barista Express Espresso Machine',
                        'price' => 449.99,
                        'compare' => 520.00,
                        'description' => 'Integrated conical burr grinder, precise 15-bar Italian pump, digital temperature control, and micro-foam steam wand.',
                        'image' => 'https://images.unsplash.com/photo-1517668808822-9d05da6d0cfb?w=600&auto=format&fit=crop&q=80',
                        'featured' => true,
                    ],
                    [
                        'name' => 'Ergonomic Mesh Executive Chair',
                        'price' => 279.00,
                        'compare' => 340.00,
                        'description' => '3D dynamic lumbar support, 4D adjustable armrests, breathable Korean mesh, and 135-degree tilt recline.',
                        'image' => 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=600&auto=format&fit=crop&q=80',
                        'featured' => false,
                    ],
                    [
                        'name' => 'Smart Ambient RGB Desk Lamp',
                        'price' => 59.99,
                        'compare' => 79.99,
                        'description' => 'Voice compatible with Alexa & Google Assistant, 16 million colors, eye-care flicker-free dimming, and built-in 15W wireless charger.',
                        'image' => 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
                        'featured' => false,
                    ],
                ]
            ],
            [
                'category' => 'Accessories & Travel',
                'slug' => 'accessories',
                'description' => 'Waterproof backpacks, travel luggage, and daily EDC carry items.',
                'products' => [
                    [
                        'name' => 'Waterproof Commuter Travel Backpack',
                        'price' => 84.99,
                        'compare' => 109.99,
                        'description' => 'Expandable 35L capacity, dedicated 17" padded laptop compartment, TSA-friendly lay-flat design, and anti-theft hidden pockets.',
                        'image' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
                        'featured' => true,
                    ],
                    [
                        'name' => 'Stainless Steel Insulated Water Bottle',
                        'price' => 34.50,
                        'compare' => 45.00,
                        'description' => 'Double-wall vacuum insulation keeps beverages icy cold for 24 hours or piping hot for 12 hours. BPA-free leakproof lid.',
                        'image' => 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80',
                        'featured' => false,
                    ],
                ]
            ]
        ];

        foreach ($catalog as $catIndex => $data) {
            $category = Category::create([
                'name' => $data['category'],
                'slug' => $data['slug'],
                'description' => $data['description'],
                'is_active' => true,
                'sort_order' => $catIndex,
            ]);

            foreach ($data['products'] as $pIndex => $p) {
                $product = Product::create([
                    'category_id' => $category->id,
                    'name' => $p['name'],
                    'slug' => Str::slug($p['name']),
                    'description' => $p['description'],
                    'price' => $p['price'],
                    'compare_at_price' => $p['compare'],
                    'sku' => strtoupper(Str::random(3)) . '-' . fake()->numberBetween(1000, 9999),
                    'stock_quantity' => fake()->numberBetween(15, 80),
                    'is_active' => true,
                    'is_featured' => $p['featured'],
                ]);

                ProductImage::create([
                    'product_id' => $product->id,
                    'url' => $p['image'],
                    'alt_text' => $product->name,
                    'is_primary' => true,
                    'sort_order' => 0,
                ]);
            }
        }
    }
}
