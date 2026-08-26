# Phase 5: Admin Dashboard & Delivery Agent Features

## Overview

Phase 5 completes the role-based experience by implementing:
1. **Admin Control & Analytics (`role:admin`)**: Real-time sales metrics, revenue reports, order agent assignment, and agent/user management.
2. **Delivery Agent Portal (`role:agent`)**: Assigned delivery list, delivery status updates (`picked_up`, `out_for_delivery`, `delivered`), and agent metrics.

## API Endpoints

### Admin Endpoints (Auth + `role:admin`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/dashboard` | Aggregated analytics & sales metrics |
| GET | `/api/v1/admin/orders` | List all customer orders |
| PUT | `/api/v1/admin/orders/{id}/assign-agent` | Assign delivery agent to order |
| GET | `/api/v1/admin/users` | List system users (filtered by role) |
| POST | `/api/v1/admin/users` | Create new agent or admin user |

### Agent Endpoints (Auth + `role:agent`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/agent/dashboard` | Summary delivery stats for agent |
| GET | `/api/v1/agent/deliveries` | Assigned deliveries with status filter |
| PUT | `/api/v1/agent/deliveries/{id}/status` | Update delivery status |

## Data Flow: Agent Delivery Lifecycle

1. Customer places order → Order status: `pending` / `processing`.
2. Admin views order list (`GET /admin/orders`) → assigns Agent ID (`PUT /admin/orders/{id}/assign-agent`).
3. System creates `DeliveryAssignment` (`status: assigned`) and sets order status to `assigned`.
4. Agent opens **Deliveries** tab (`GET /agent/deliveries`) → sees assigned order.
5. Agent updates status:
   - `picked_up` → `picked_up_at` timestamp set → Order status: `processing`.
   - `out_for_delivery` → Order status: `shipped`.
   - `delivered` → `delivered_at` timestamp set → Order status: `delivered`.

## Mobile UI Components

- **AdminDashboardScreen**: Revenue, total orders, active customers, order status distribution cards.
- **AdminOrdersScreen**: Order list with modal to select & assign active delivery agents.
- **AdminUsersScreen**: User list and modal form to register new delivery agents.
- **AgentDeliveriesScreen**: Assigned delivery cards with action buttons to advance delivery states.

## Verification

- **Backend:** `php artisan route:list --path=api/v1`
- **Frontend:** `cd mobile && npx tsc --noEmit`
