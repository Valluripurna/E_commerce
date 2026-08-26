# Phase 4: Orders, Payments & Real-Time Tracking

## Fixes Applied (pre-Phase 4)

- TypeScript: `ActivityIndicator` from `react-native`, Cart +/- buttons use `Button`
- Jest: Keychain mock in `jest.setup.js`
- Added `@react-native-community/cli`, `@types/jest`, `metro.config.js`
- Generated `android/` native project scaffold

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/orders` | customer | Order history |
| POST | `/api/v1/orders` | customer | Place order from cart |
| GET | `/api/v1/orders/{id}` | customer | Order detail + tracking |
| POST | `/api/v1/payments/confirm` | customer | Confirm simulated/test payment |
| POST | `/api/v1/payments/webhook` | public | Stripe webhook |

## Order Flow (Transaction)

1. Lock cart + validate stock
2. Create order + order_items (price snapshot)
3. Decrement inventory
4. Create pending payment + Stripe PaymentIntent (or local simulation)
5. Clear cart
6. Broadcast `OrderStatusUpdated`
7. Mobile calls `/payments/confirm` (local/test) → status `processing`

## Mobile Screens

- **CheckoutScreen** — address, summary, place order
- **OrderConfirmationScreen** — success state
- **OrderTrackingScreen** — progress bar + polling (10s)
- **OrderHistoryScreen** — past orders from Profile

## Stripe Setup (Production)

```powershell
composer require stripe/stripe-php   # optional; HTTP client used by default
```

Set in `.env`:
```
STRIPE_KEY=pk_test_xxx
STRIPE_SECRET=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_SIMULATE_CONFIRM=false
```

## Testing

```powershell
php artisan test --filter=Order
cd mobile && npm test && npx tsc --noEmit
```

## Real-Time (Production)

Configure Pusher in `.env` and subscribe mobile client to `private-orders.{id}` for `OrderStatusUpdated` events.
