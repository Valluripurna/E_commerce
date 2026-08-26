# Phase 3: Core Features & API Integration

## API Endpoints

### Public Catalog

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/categories` | List active categories |
| GET | `/api/v1/products` | Paginated products with filters |
| GET | `/api/v1/products/{id}` | Product detail |

**Query params for `/products`:** `q`, `category_id`, `min_price`, `max_price`, `featured`, `sort` (`price_asc`, `price_desc`, `name`, `latest`), `page`, `per_page`

### Customer Cart & Wishlist (auth + role:customer)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/cart` | View cart |
| POST | `/api/v1/cart/items` | Add item `{ product_id, quantity }` |
| PUT | `/api/v1/cart/items/{id}` | Update quantity |
| DELETE | `/api/v1/cart/items/{id}` | Remove item |
| GET | `/api/v1/wishlist` | View wishlist |
| POST | `/api/v1/wishlist/items` | Add `{ product_id }` |
| DELETE | `/api/v1/wishlist/items/{id}` | Remove item |

### Admin Products (auth + role:admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/products` | List all products |
| POST | `/api/v1/admin/products` | Create product |
| PUT | `/api/v1/admin/products/{id}` | Update product |
| DELETE | `/api/v1/admin/products/{id}` | Soft delete |

## Seed Data

```powershell
php artisan migrate:fresh --seed
```

Creates 4 categories × 3 products (12 products total) plus demo users.

## Mobile Features

- **ProductListScreen** — search, category filter, sort, infinite scroll
- **CartScreen** — quantity controls, subtotal, cart badge on tab
- **WishlistScreen** — save/remove products, move to cart
- **ManageProductsScreen** (admin) — inventory list
- **CartContext / WishlistContext** — global state synced with API

## Testing

```powershell
# Backend
php artisan test --filter=Catalog
php artisan test --filter=Cart
php artisan test --filter=AdminProduct

# Mobile
cd mobile && npm test
```

## Example Requests

```bash
# List products with filters
curl "http://localhost:8000/api/v1/products?q=headphones&sort=price_asc"

# Add to cart
curl -X POST http://localhost:8000/api/v1/cart/items \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"product_id":1,"quantity":2}'
```

## Next: Phase 4

Order placement, Stripe payments, checkout flow, and real-time order tracking.
