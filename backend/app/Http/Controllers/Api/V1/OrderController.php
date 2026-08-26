<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\CheckoutRequest;
use App\Http\Resources\V1\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use RuntimeException;

class OrderController extends Controller
{
    public function __construct(private OrderService $orderService)
    {
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $orders = Order::query()
            ->where('user_id', $request->user()->id)
            ->with(['items', 'payment'])
            ->latest()
            ->paginate($request->integer('per_page', 10));

        return OrderResource::collection($orders);
    }

    public function store(CheckoutRequest $request): JsonResponse
    {
        try {
            $result = $this->orderService->placeOrder($request->user(), $request->validated());
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json([
            'message' => 'Order placed successfully.',
            'data' => new OrderResource($result['order']),
            'payment' => [
                'client_secret' => $result['client_secret'],
                'payment_intent_id' => $result['payment_intent_id'],
            ],
        ], 201);
    }

    public function show(Request $request, Order $order): OrderResource|JsonResponse
    {
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Order not found.'], 404);
        }

        $order->load(['items', 'payment']);

        return new OrderResource($order);
    }
}
