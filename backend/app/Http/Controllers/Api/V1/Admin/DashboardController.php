<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $totalRevenue = Order::where('status', '!=', 'cancelled')->sum('total_amount');
        $totalOrders = Order::count();
        $totalCustomers = User::where('role', 'customer')->count();
        $totalAgents = User::where('role', 'agent')->count();

        $ordersByStatus = Order::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        $recentOrders = Order::with('user:id,name,email')
            ->latest()
            ->limit(5)
            ->get();

        return response()->json([
            'metrics' => [
                'total_revenue' => (float) $totalRevenue,
                'total_orders' => $totalOrders,
                'total_customers' => $totalCustomers,
                'total_agents' => $totalAgents,
            ],
            'orders_by_status' => $ordersByStatus,
            'recent_orders' => $recentOrders,
        ]);
    }
}
