<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $products = Product::query()
            ->with(['category', 'images'])
            ->active()
            ->inCategory($request->integer('category_id') ?: null)
            ->priceBetween(
                $request->filled('min_price') ? (float) $request->min_price : null,
                $request->filled('max_price') ? (float) $request->max_price : null
            )
            ->search($request->string('q')->toString() ?: null)
            ->featured($request->boolean('featured') ?: null)
            ->sortBy($request->string('sort')->toString() ?: null)
            ->paginate($request->integer('per_page', 15));

        return ProductResource::collection($products);
    }

    public function show(Product $product): ProductResource
    {
        abort_if(!$product->is_active, 404, 'Product not found.');

        $product->load(['category', 'images']);

        return new ProductResource($product);
    }
}
