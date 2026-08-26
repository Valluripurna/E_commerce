<?php

return [
    'stripe' => [
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
        'simulate_confirm' => env('STRIPE_SIMULATE_CONFIRM', true),
    ],

    'fcm' => [
        'key' => env('FCM_SERVER_KEY'),
    ],
];
