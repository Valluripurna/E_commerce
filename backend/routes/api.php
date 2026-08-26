<?php

use App\Http\Controllers\Api\V1\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\V1\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\V1\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\V1\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\V1\Agent\DashboardController as AgentDashboardController;
use App\Http\Controllers\Api\V1\Agent\DeliveryController as AgentDeliveryController;
use App\Http\Controllers\Api\V1\Auth\LoginController;
use App\Http\Controllers\Api\V1\Auth\LogoutController;
use App\Http\Controllers\Api\V1\Auth\MeController;
use App\Http\Controllers\Api\V1\Auth\RegisterController;
use App\Http\Controllers\Api\V1\CartController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\Customer\DashboardController as CustomerDashboardController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\WishlistController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/health', fn () => response()->json([
        'status' => 'ok',
        'version' => '1.0.0',
        'timestamp' => now()->toIso8601String(),
    ]));

    // ─── Public Catalog ────────────────────────────────────────
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{product}', [ProductController::class, 'show']);

    // ─── Stripe Webhook (no auth) ──────────────────────────────
    Route::post('/payments/webhook', [PaymentController::class, 'webhook']);

    // ─── Public Auth ───────────────────────────────────────────
    Route::post('/register', [RegisterController::class, 'store']);
    Route::post('/login', [LoginController::class, 'store'])->middleware('throttle:5,1');

    // ─── Authenticated ───────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [MeController::class, 'show']);
        Route::post('/logout', [LogoutController::class, 'store']);

        // ─── Customer Routes ───────────────────────────────────────
        Route::middleware('role:customer')->group(function () {
            Route::get('/customer/dashboard', [CustomerDashboardController::class, 'index']);

            Route::get('/cart', [CartController::class, 'show']);
            Route::post('/cart/items', [CartController::class, 'addItem']);
            Route::put('/cart/items/{item}', [CartController::class, 'updateItem']);
            Route::delete('/cart/items/{item}', [CartController::class, 'removeItem']);

            Route::get('/wishlist', [WishlistController::class, 'show']);
            Route::post('/wishlist/items', [WishlistController::class, 'addItem']);
            Route::delete('/wishlist/items/{item}', [WishlistController::class, 'removeItem']);

            Route::get('/orders', [OrderController::class, 'index']);
            Route::post('/orders', [OrderController::class, 'store']);
            Route::get('/orders/{order}', [OrderController::class, 'show']);

            Route::post('/payments/confirm', [PaymentController::class, 'confirm']);
        });

        // ─── Admin Routes ──────────────────────────────────────────
        Route::middleware('role:admin')->prefix('admin')->group(function () {
            Route::get('/dashboard', [AdminDashboardController::class, 'index']);
            Route::apiResource('products', AdminProductController::class);

            Route::get('/orders', [AdminOrderController::class, 'index']);
            Route::get('/orders/{order}', [AdminOrderController::class, 'show']);
            Route::put('/orders/{order}/assign-agent', [AdminOrderController::class, 'assignAgent']);

            Route::get('/users', [AdminUserController::class, 'index']);
            Route::post('/users', [AdminUserController::class, 'store']);
        });

        // ─── Agent Routes ──────────────────────────────────────────
        Route::middleware('role:agent')->prefix('agent')->group(function () {
            Route::get('/dashboard', [AgentDashboardController::class, 'index']);
            Route::get('/deliveries', [AgentDeliveryController::class, 'index']);
            Route::get('/deliveries/{delivery}', [AgentDeliveryController::class, 'show']);
            Route::put('/deliveries/{delivery}/status', [AgentDeliveryController::class, 'updateStatus']);
        });
    });
});