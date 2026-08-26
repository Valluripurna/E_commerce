<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $items = $this->whenLoaded('items');

        return [
            'id' => $this->id,
            'items' => CartItemResource::collection($items),
            'item_count' => $this->when($items, fn () => $this->items->sum('quantity')),
            'subtotal' => $this->when($items, fn () => (float) $this->items->sum(
                fn ($item) => $item->quantity * $item->unit_price
            )),
        ];
    }
}
