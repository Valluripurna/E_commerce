# Phase 1: System Architecture & Project Setup

## System Architecture (Logical Diagram)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        MOBILE CLIENTS (React Native)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                   │
│  │   Customer   │  │    Admin     │  │    Agent     │                   │
│  │  Tab Nav     │  │  Tab Nav     │  │  Tab Nav     │                   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                   │
│         │                 │                 │                            │
│         └─────────────────┼─────────────────┘                            │
│                           ▼                                              │
│              ┌────────────────────────┐                                  │
│              │  Services Layer (Axios) │                                  │
│              │  Auth / Products / Cart │                                  │
│              └────────────┬───────────┘                                  │
│                           │ HTTPS + Bearer Token (Sanctum)               │
└───────────────────────────┼──────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     LARAVEL API (api/v1/*)                               │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  ┌──────────────┐  │
│  │ Middleware  │→ │ Controllers  │→ │ Repositories│→ │   Models     │  │
│  │ Auth+Role   │  │ Api/V1/*     │  │ (optional)  │  │  Eloquent    │  │
│  └─────────────┘  └──────────────┘  └─────────────┘  └──────┬───────┘  │
│         │                              Events / Jobs           │         │
│         ▼                              (Broadcast, FCM)      ▼         │
│  ┌─────────────┐                                    ┌──────────────┐   │
│  │   Sanctum   │                                    │    MySQL     │   │
│  │   Tokens    │                                    │  (Indexed)   │   │
│  └─────────────┘                                    └──────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │  Stripe  │  │  Pusher  │  │   FCM    │
        │ Payments │  │ Realtime │  │   Push   │
        └──────────┘  └──────────┘  └──────────┘
```

### Data Flow: Customer Purchase

1. Customer browses `GET /api/v1/products` (public, cached).
2. Adds item → `POST /api/v1/cart/items` (authenticated).
3. Checkout → `POST /api/v1/orders` (DB transaction: order + items + payment + stock decrement + cart clear).
4. Stripe webhook confirms payment → order status `processing`.
5. Admin assigns agent → `PUT /api/v1/admin/orders/{id}/assign-agent`.
6. Agent updates status → broadcast `OrderStatusUpdated` → customer UI updates in real time.
7. FCM push sent on each status change.

---

## Step 1: Git & Version Control

Already initialized in this repo:

```powershell
git init -b main
git checkout -b develop
```

**Branch strategy:**
- `main` — tagged releases only
- `develop` — daily integration
- `feature/*` — one feature per branch, PR into `develop`

**First commit (when ready):**

```powershell
git add .
git commit -m "chore: initialize monorepo with Phase 1 foundation"
```

---

## Step 2: Backend (Laravel) Setup

### Prerequisites (Windows)

Install PHP 8.2+, Composer, and MySQL:

```powershell
# Option A: Laravel Herd (recommended) — https://herd.laravel.com/windows
# Option B: XAMPP + Composer from getcomposer.org
```

### Create Laravel Project

Because `backend/` already contains migrations, either:

**A) Fresh install then copy migrations:**

```powershell
cd c:\Users\purna\OneDrive\Desktop\E_commerce
composer create-project laravel/laravel backend-tmp
# Copy database/migrations/* into backend-tmp, then replace backend/
```

**B) If backend/ is empty except our files:**

```powershell
composer create-project laravel/laravel backend --prefer-dist
# Re-add migrations from git (they are in database/migrations/)
```

### Configure `.env`

```powershell
cd backend
copy .env.example .env
php artisan key:generate
```

Create MySQL database:

```sql
CREATE DATABASE ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Run migrations:

```powershell
php artisan migrate
```

### API-Only Configuration

See `backend/bootstrap/app.php` and `backend/routes/api.php` in this repo.

**Key decisions:**
- All routes under `routes/api.php` with prefix `v1`
- Force JSON via middleware (no Blade views)
- Rate limiting on auth routes (5/min login)

---

## Step 3: Database Schema

Migrations live in `backend/database/migrations/`.

### Entity Relationship Summary

| Table | Relationships | Why |
|-------|---------------|-----|
| `users` | 1:1 cart, wishlist; 1:N orders | Role enum drives RBAC |
| `categories` | self-referential parent_id | Nested categories |
| `products` | N:1 category; 1:N images | Catalog + inventory |
| `carts` | 1:1 user; 1:N cart_items | One cart per customer |
| `orders` | N:1 user; 1:N order_items; 1:1 payment | Order snapshot preserves price at purchase |
| `delivery_assignments` | 1:1 order; N:1 agent | Separate delivery lifecycle |

### Performance Indexes

- Composite `(user_id, status)` on orders — fast order history filters
- `(category_id, is_active)` on products — catalog queries
- `fullText` on products name/description — search (MySQL 8+)
- Unique `(cart_id, product_id)` — prevents duplicate line items

---

## Step 4: React Native Frontend Setup

```powershell
cd c:\Users\purna\OneDrive\Desktop\E_commerce
npx @react-native-community/cli@latest init ECommerceMobile --directory mobile --skip-install
cd mobile
npm install native-base react-native-svg react-native-safe-area-context
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-gesture-handler
npm install axios @react-native-async-storage/async-storage
npm install react-native-keychain
npm install
```

> **Note:** NativeBase v3 requires `react-native-svg`. For new projects, also consider `@gluestack-ui/themed` (NativeBase successor).

### Folder Structure

```
mobile/src/
├── components/     # Reusable UI (ProductCard, CartItem)
├── context/        # AuthContext, CartContext
├── hooks/          # useProducts, useAuth
├── navigation/     # RootNavigator, role-based tabs
├── screens/        # Feature screens by role
├── services/       # api.ts, authService.ts
├── types/          # TypeScript interfaces
└── utils/          # formatters, validators
```

---

## Validation & Testing (Phase 1)

### Backend

```powershell
php artisan migrate:fresh --seed   # after seeders exist
php artisan route:list --path=api
```

### Frontend

```powershell
cd mobile
npm test
npx react-native start
npm run android
```

---

## Next: Phase 2

Proceed to [PHASE-2-AUTH.md](PHASE-2-AUTH.md) for Sanctum authentication and role-based navigation.
