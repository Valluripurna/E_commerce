<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\DeliveryAssignment;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Order::with(['user:id,name,email', 'deliveryAssignment.agent:id,name,email'])
            ->latest();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->paginate($request->get('per_page', 15));

        return response()->json($orders);
    }

    public function show(Order $order): JsonResponse
    {
        $order->load(['user', 'items.product', 'payment', 'deliveryAssignment.agent']);

        return response()->json([
            'data' => $order,
        ]);
    }

    public function assignAgent(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'agent_id' => 'required|exists:users,id',
            'notes' => 'nullable|string|max:500',
        ]);

        $agent = User::where('id', $validated['agent_id'])
            ->where('role', 'agent')
            ->firstOrFail();

        $assignment = DeliveryAssignment::updateOrCreate(
            ['order_id' => $order->id],
            [
                'agent_id' => $agent->id,
                'assigned_by' => $request->user()->id,
                'status' => 'assigned',
                'notes' => $validated['notes'] ?? null,
                'assigned_at' => now(),
            ]
        );

        if ($order->status === 'pending') {
            $order->update(['status' => 'processing']);
        }

        return response()->json([
            'message' => 'Agent assigned successfully.',
            'assignment' => $assignment->load('agent:id,name,email'),
            'order' => $order,
        ]);
    }
}
