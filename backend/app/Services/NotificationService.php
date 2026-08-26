<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    protected string $fcmServerKey;

    public function __construct()
    {
        $this->fcmServerKey = config('services.fcm.server_key', env('FCM_SERVER_KEY', 'demo_fcm_key'));
    }

    /**
     * Send push notification to a user's device token via FCM.
     */
    public function sendPushNotification(User $user, string $title, string $body, array $data = []): bool
    {
        if (!$user->fcm_token) {
            Log::info("User ID {$user->id} does not have an FCM token. Simulating notification: {$title} - {$body}");
            return true;
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'key=' . $this->fcmServerKey,
                'Content-Type' => 'application/json',
            ])->post('https://fcm.googleapis.com/fcm/send', [
                'to' => $user->fcm_token,
                'notification' => [
                    'title' => $title,
                    'body' => $body,
                    'sound' => 'default',
                ],
                'data' => $data,
            ]);

            return $response->successful();
        } catch (\Throwable $e) {
            Log::error("FCM Notification failed for User {$user->id}: " . $e->getMessage());
            return false;
        }
    }
}
