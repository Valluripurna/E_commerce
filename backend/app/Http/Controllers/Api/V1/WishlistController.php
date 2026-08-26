<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Wishlist\AddWishlistItemRequest;
use App\Http\Resources\V1\WishlistResource;
use App\Models\Product;
use App\Models\Wishlist;
use App\Models\WishlistItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function show(Request $request): WishlistResource
    {
        $wishlist = $this->getOrCreateWishlist($request->user()->id);
        $wishlist->load(['items.product.images', 'items.product.category']);

        return new WishlistResource($wishlist);
    }

    public function addItem(AddWishlistItemRequest $request): JsonResponse
    {
        Product::query()->active()->findOrFail($request->product_id);

        $wishlist = $this->getOrCreateWishlist($request->user()->id);

        $wishlist->items()->firstOrCreate(['product_id' => $request->product_id]);

        $wishlist->load(['items.product.images', 'items.product.category']);

        return response()->json([
            'message' => 'Item added to wishlist.',
            'data' => new WishlistResource($wishlist),
        ], 201);
    }

    public function removeItem(Request $request, WishlistItem $item): JsonResponse
    {
        $wishlist = $this->getOrCreateWishlist($request->user()->id);

        if ($item->wishlist_id !== $wishlist->id) {
            abort(403, 'This wishlist item does not belong to you.');
        }

        $item->delete();
        $wishlist->load(['items.product.images', 'items.product.category']);

        return response()->json([
            'message' => 'Item removed from wishlist.',
            'data' => new WishlistResource($wishlist),
        ]);
    }

    private function getOrCreateWishlist(int $userId): Wishlist
    {
        return Wishlist::firstOrCreate(['user_id' => $userId]);
    }
}
