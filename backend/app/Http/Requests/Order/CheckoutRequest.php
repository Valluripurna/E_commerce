<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (!$this->has('payment_method')) {
            $this->merge(['payment_method' => 'stripe']);
        }
    }

    public function rules(): array
    {
        return [
            'shipping_address' => ['required', 'string', 'max:1000'],
            'billing_address' => ['nullable', 'string', 'max:1000'],
            'customer_notes' => ['nullable', 'string', 'max:500'],
            'payment_method' => ['nullable', 'string', 'in:stripe,card'],
        ];
    }
}
