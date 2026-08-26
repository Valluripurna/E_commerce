<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\V1\ProductResource;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $products = Product::query()
            ->with(['category', 'images'])
            ->when($request->filled('q'), fn ($q) => $q->search($request->string('q')->toString()))
            ->when($request->filled('category_id'), fn ($q) => $q->inCategory($request->integer('category_id')))
            ->latest()
            ->paginate($request->integer('per_page', 20));

        return ProductResource::collection($products);
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = DB::transaction(function () use ($request) {
            $slug = $request->slug ?: Str::slug($request->name);

            $product = Product::create([
                'category_id' => $request->category_id,
                'name' => $request->name,
                'slug' => $this->uniqueSlug($slug),
                'description' => $request->description,
                'price' => $request->price,
                'compare_at_price' => $request->compare_at_price,
                'sku' => $request->sku,
                'stock_quantity' => $request->stock_quantity,
                'low_stock_threshold' => $request->low_stock_threshold ?? 5,
                'is_active' => $request->boolean('is_active', true),
                'is_featured' => $request->boolean('is_featured', false),
                'attributes' => $request->attributes,
            ]);

            $this->syncImages($product, $request->input('images', []));

            return $product->load(['category', 'images']);
        });

        return response()->json([
            'message' => 'Product created successfully.',
            'data' => new ProductResource($product),
        ], 201);
    }

    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $product->update($request->validated());
        $product->load(['category', 'images']);

        return response()->json([
            'message' => 'Product updated successfully.',
            'data' => new ProductResource($product),
        ]);
    }

    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully.',
        ]);
    }

    private function uniqueSlug(string $slug): string
    {
        $base = $slug;
        $counter = 1;

        while (Product::where('slug', $slug)->exists()) {
            $slug = $base.'-'.$counter;
            $counter++;
        }

        return $slug;
    }

    private function syncImages(Product $product, array $images): void
    {
        if (empty($images)) {
            return;
        }

        foreach ($images as $index => $image) {
            ProductImage::create([
                'product_id' => $product->id,
                'url' => $image['url'],
                'alt_text' => $image['alt_text'] ?? $product->name,
                'is_primary' => $image['is_primary'] ?? ($index === 0),
                'sort_order' => $index,
            ]);
        }
    }
}
