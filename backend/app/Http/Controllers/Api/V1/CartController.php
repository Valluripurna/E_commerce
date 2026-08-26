<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\AddCartItemRequest;
use App\Http\Requests\Cart\UpdateCartItemRequest;
use App\Http\Resources\V1\CartResource;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function show(Request $request): CartResource
    {
        $cart = $this->getOrCreateCart($request->user()->id);
        $cart->load(['items.product.images', 'items.product.category']);

        return new CartResource($cart);
    }

    public function addItem(AddCartItemRequest $request): JsonResponse
    {
        $product = Product::query()->active()->findOrFail($request->product_id);

        if ($product->stock_quantity < $request->quantity) {
            return response()->json([
                'message' => 'Insufficient stock for this product.',
            ], 422);
        }

        $cart = $this->getOrCreateCart($request->user()->id);

        $existing = $cart->items()->where('product_id', $product->id)->first();
        $newQuantity = ($existing?->quantity ?? 0) + $request->quantity;

        if ($newQuantity > $product->stock_quantity) {
            return response()->json([
                'message' => 'Requested quantity exceeds available stock.',
            ], 422);
        }

        $cart->items()->updateOrCreate(
            ['product_id' => $product->id],
            ['quantity' => $newQuantity, 'unit_price' => $product->price]
        );

        $cart->load(['items.product.images', 'items.product.category']);

        return response()->json([
            'message' => 'Item added to cart.',
            'data' => new CartResource($cart),
        ], 201);
    }

    public function updateItem(UpdateCartItemRequest $request, CartItem $item): JsonResponse
    {
        $cart = $this->getOrCreateCart($request->user()->id);

        if ($item->cart_id !== $cart->id) {
            abort(403, 'This cart item does not belong to you.');
        }

        $product = Product::findOrFail($item->product_id);

        if ($request->quantity > $product->stock_quantity) {
            return response()->json([
                'message' => 'Requested quantity exceeds available stock.',
            ], 422);
        }

        $item->update([
            'quantity' => $request->quantity,
            'unit_price' => $product->price,
        ]);

        $cart->load(['items.product.images', 'items.product.category']);

        return response()->json([
            'message' => 'Cart item updated.',
            'data' => new CartResource($cart),
        ]);
    }

    public function removeItem(Request $request, CartItem $item): JsonResponse
    {
        $cart = $this->getOrCreateCart($request->user()->id);

        if ($item->cart_id !== $cart->id) {
            abort(403, 'This cart item does not belong to you.');
        }

        $item->delete();
        $cart->load(['items.product.images', 'items.product.category']);

        return response()->json([
            'message' => 'Item removed from cart.',
            'data' => new CartResource($cart),
        ]);
    }

    private function getOrCreateCart(int $userId): Cart
    {
        return Cart::firstOrCreate(['user_id' => $userId]);
    }
}
