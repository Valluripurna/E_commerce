<?php

namespace App\Http\Controllers\Api\V1\Agent;

use App\Http\Controllers\Controller;
use App\Models\DeliveryAssignment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $agentId = $request->user()->id;

        $stats = [
            'total_assigned' => DeliveryAssignment::where('agent_id', $agentId)->count(),
            'pending' => DeliveryAssignment::where('agent_id', $agentId)->where('status', 'assigned')->count(),
            'picked_up' => DeliveryAssignment::where('agent_id', $agentId)->where('status', 'picked_up')->count(),
            'delivered' => DeliveryAssignment::where('agent_id', $agentId)->where('status', 'delivered')->count(),
        ];

        $recent = DeliveryAssignment::with(['order.user:id,name,email,shipping_address'])
            ->where('agent_id', $agentId)
            ->latest()
            ->limit(5)
            ->get();

        return response()->json([
            'agent' => [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
            ],
            'stats' => $stats,
            'recent_deliveries' => $recent,
        ]);
    }
}
