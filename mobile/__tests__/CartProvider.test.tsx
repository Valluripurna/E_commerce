import React from 'react';

describe('Cart Calculation Utility Test', () => {
  it('calculates total items and cart total price accurately', () => {
    const cartItems = [
      { id: 1, product: { id: 1, name: 'Item A', price: 29.99 }, quantity: 2 },
      { id: 2, product: { id: 2, name: 'Item B', price: 49.99 }, quantity: 1 },
    ];

    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    expect(totalQuantity).toBe(3);
    expect(totalPrice).toBeCloseTo(109.97, 2);
  });
});
