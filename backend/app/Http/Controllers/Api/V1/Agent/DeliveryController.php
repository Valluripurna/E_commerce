<?php

namespace App\Http\Controllers\Api\V1\Agent;

use App\Http\Controllers\Controller;
use App\Models\DeliveryAssignment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DeliveryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = DeliveryAssignment::with([
            'order.user:id,name,email',
            'order.items.product:id,name,sku',
        ])
            ->where('agent_id', $request->user()->id)
            ->latest();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $deliveries = $query->paginate($request->get('per_page', 15));

        return response()->json($deliveries);
    }

    public function show(Request $request, DeliveryAssignment $delivery): JsonResponse
    {
        if ($delivery->agent_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized access to delivery.'], 403);
        }

        $delivery->load(['order.user', 'order.items.product', 'order.payment']);

        return response()->json([
            'data' => $delivery,
        ]);
    }

    public function updateStatus(Request $request, DeliveryAssignment $delivery): JsonResponse
    {
        if ($delivery->agent_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized access to delivery.'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:picked_up,out_for_delivery,delivered,failed',
            'notes' => 'nullable|string|max:500',
        ]);

        $updateData = [
            'status' => $validated['status'],
        ];

        if (!empty($validated['notes'])) {
            $updateData['notes'] = $validated['notes'];
        }

        if ($validated['status'] === 'picked_up' && !$delivery->picked_up_at) {
            $updateData['picked_up_at'] = now();
        }

        if ($validated['status'] === 'delivered' && !$delivery->delivered_at) {
            $updateData['delivered_at'] = now();
        }

        $delivery->update($updateData);

        // Map delivery status to order status
        $orderStatus = match ($validated['status']) {
            'picked_up', 'out_for_delivery' => 'shipped',
            'delivered' => 'delivered',
            'failed' => 'processing',
            default => null,
        };

        if ($orderStatus) {
            $delivery->order->update(['status' => $orderStatus]);
        }

        return response()->json([
            'message' => 'Delivery status updated successfully.',
            'delivery' => $delivery->fresh(['order']),
        ]);
    }
}
