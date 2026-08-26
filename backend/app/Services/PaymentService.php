<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PaymentService
{
    public function createPaymentIntent(Order $order, Payment $payment): array
    {
        if (app()->environment('local', 'testing') && !config('services.stripe.secret')) {
            $fakeIntentId = 'pi_test_'.Str::random(16);

            $payment->update([
                'transaction_id' => $fakeIntentId,
                'gateway_response' => ['mode' => 'local_simulation'],
            ]);

            return [
                'id' => $fakeIntentId,
                'client_secret' => $fakeIntentId.'_secret_simulated',
                'status' => 'requires_payment_method',
            ];
        }

        $response = Http::withToken(config('services.stripe.secret'))
            ->asForm()
            ->post('https://api.stripe.com/v1/payment_intents', [
                'amount' => (int) round($order->total_amount * 100),
                'currency' => strtolower($order->currency),
                'metadata[order_id]' => $order->id,
                'metadata[order_number]' => $order->order_number,
                'automatic_payment_methods[enabled]' => 'true',
            ]);

        if ($response->failed()) {
            Log::error('Stripe PaymentIntent failed', ['body' => $response->body()]);
            throw new \RuntimeException('Unable to initiate payment.');
        }

        $intent = $response->json();

        $payment->update([
            'transaction_id' => $intent['id'],
            'gateway_response' => $intent,
        ]);

        return $intent;
    }

    public function confirmSimulatedPayment(Payment $payment): bool
    {
        if ($payment->status === 'completed') {
            return true;
        }

        return str_starts_with((string) $payment->transaction_id, 'pi_test_');
    }

    public function handleWebhookPayload(string $payload, ?string $signature): void
    {
        $webhookSecret = config('services.stripe.webhook_secret');

        if (!$webhookSecret) {
            return;
        }

        // Production: verify signature with stripe/stripe-php Webhook::constructEvent
        $event = json_decode($payload, true);
        if (!$event || !isset($event['type'])) {
            return;
        }

        if ($event['type'] === 'payment_intent.succeeded') {
            $intentId = $event['data']['object']['id'] ?? null;
            if (!$intentId) {
                return;
            }

            $payment = Payment::where('transaction_id', $intentId)->first();
            if ($payment) {
                app(OrderService::class)->markOrderPaid(
                    $payment->order,
                    $payment,
                    $event['data']['object']
                );
            }
        }
    }
}
