<?php

namespace App\Http\Controllers\Api\V1\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'Customer dashboard access granted.',
            'customer' => [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
            ],
        ]);
    }
}
