# Phase 2: Authentication & Role-Based Access Control

## Overview

Phase 2 implements the security backbone: **Laravel Sanctum** token auth, **role middleware**, and **React Native** auth state with encrypted token storage.

## API Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/v1/register` | Public | — | Customer registration |
| POST | `/api/v1/login` | Public | — | Login (5 req/min throttle) |
| GET | `/api/v1/me` | Bearer | Any | Current user profile |
| POST | `/api/v1/logout` | Bearer | Any | Revoke current token |
| GET | `/api/v1/customer/dashboard` | Bearer | customer | RBAC demo |
| GET | `/api/v1/admin/dashboard` | Bearer | admin | RBAC demo |
| GET | `/api/v1/agent/dashboard` | Bearer | agent | RBAC demo |

## Backend Setup (after Laravel install)

```powershell
cd backend
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
php artisan db:seed
php artisan serve
```

### Demo seeded accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@ecommerce.test | Password1 |
| Agent | agent@ecommerce.test | Password1 |
| Customer | customer@ecommerce.test | Password1 |

## Security Decisions

1. **Self-registration limited to `customer` role** — admins/agents are seeded or created by admin.
2. **Password rules** — min 8 chars, mixed case, numbers (Laravel `Password` rule).
3. **Login rate limit** — `throttle:5,1` prevents brute force.
4. **Single active token** — previous tokens revoked on login (optional hardening).
5. **Generic error messages** — "credentials incorrect" without revealing if email exists.
6. **Keychain storage (mobile)** — tokens encrypted in OS keychain, not AsyncStorage.

## Testing

```powershell
# Backend
php artisan test --filter=Auth

# Mobile
cd mobile
npm test
```

### Example: Login API test

```bash
curl -X POST http://localhost:8000/api/v1/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"customer@ecommerce.test\",\"password\":\"Password1\"}"
```

### Example: Admin-only route

```bash
curl http://localhost:8000/api/v1/admin/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Mobile Flow

```
App Launch
    → AuthProvider bootstrap
    → Keychain.load() → set Axios Bearer → GET /me
    → RootNavigator picks navigator by user.role

Login Success
    → Keychain.save(token)
    → CustomerTabs | AdminTabs | AgentTabs
```

## File Map

### Backend
- `app/Http/Controllers/Api/V1/Auth/*` — Register, Login, Logout, Me
- `app/Http/Middleware/RoleMiddleware.php`
- `app/Http/Resources/V1/UserResource.php`
- `routes/api.php`

### Mobile
- `src/context/AuthProvider.tsx`
- `src/services/authService.ts` + `tokenStorage.ts`
- `src/screens/auth/LoginScreen.tsx`
- `src/navigation/RootNavigator.tsx`

## Next: Phase 3

Product catalog, cart APIs, and `CartContext`.
