# E-Commerce Mobile Application (Monorepo)

Production-ready e-commerce platform: **React Native** mobile app + **Laravel** REST API + **MySQL**.

## Repository Structure

```
E_commerce/
├── backend/          # Laravel 11 API (Sanctum, Broadcasting, FCM)
├── mobile/           # React Native (Native Base UI)
├── docs/             # Architecture & phase guides
└── .github/          # CI/CD workflows (Phase 6)
```

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| PHP | 8.2+ | Laravel backend |
| Composer | 2.x | PHP dependencies |
| MySQL | 8.0+ | Database |
| Node.js | 20 LTS | React Native |
| JDK | 17 | Android builds |
| Xcode | 15+ (macOS) | iOS builds |

## Quick Start

### 1. Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### 2. Mobile

```bash
cd mobile
npm install
# iOS (macOS only): cd ios && pod install && cd ..
npm run android   # or npm run ios
```

## Git Workflow

- `main` — production-ready releases
- `develop` — integration branch for features
- Feature branches: `feature/phase-2-auth`, `fix/cart-quantity`, etc.

## Development Phases

See [docs/PHASE-1-SETUP.md](docs/PHASE-1-SETUP.md), [docs/PHASE-2-AUTH.md](docs/PHASE-2-AUTH.md), [docs/PHASE-3-CATALOG.md](docs/PHASE-3-CATALOG.md), and [docs/PHASE-4-ORDERS.md](docs/PHASE-4-ORDERS.md).

### Demo Accounts (after `php artisan db:seed`)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@ecommerce.test | Password1 |
| Agent | agent@ecommerce.test | Password1 |
| Customer | customer@ecommerce.test | Password1 |
