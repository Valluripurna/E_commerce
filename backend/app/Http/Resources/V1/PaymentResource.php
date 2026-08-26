<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'transaction_id' => $this->transaction_id,
            'payment_method' => $this->payment_method,
            'status' => $this->status,
            'amount' => (float) $this->amount,
            'currency' => $this->currency,
            'paid_at' => $this->paid_at?->toIso8601String(),
        ];
    }
}
