<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class OrderServiceTest extends TestCase
{
    public function test_calculates_subtotal_and_taxes_correctly(): void
    {
        $items = [
            ['price' => 100.00, 'quantity' => 2],
            ['price' => 50.00, 'quantity' => 1],
        ];

        $subtotal = array_reduce($items, function ($acc, $item) {
            return $acc + ($item['price'] * $item['quantity']);
        }, 0.0);

        $taxRate = 0.08; // 8% tax
        $tax = $subtotal * $taxRate;
        $total = $subtotal + $tax;

        $this->assertEquals(250.00, $subtotal);
        $this->assertEquals(20.00, $tax);
        $this->assertEquals(270.00, $total);
    }
}
