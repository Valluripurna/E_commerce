<?php

namespace App\Listeners;

use App\Events\OrderStatusUpdated;
use App\Services\NotificationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendOrderStatusNotification implements ShouldQueue
{
    use InteractsWithQueue;

    protected NotificationService $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function handle(OrderStatusUpdated $event): void
    {
        $order = $event->order;
        $user = $order->user;

        if (!$user) {
            return;
        }

        $title = "Order #{$order->order_number} Update";
        $body = "Your order status is now: " . ucfirst($order->status);

        $this->notificationService->sendPushNotification($user, $title, $body, [
            'order_id' => $order->id,
            'status' => $order->status,
        ]);
    }
}
