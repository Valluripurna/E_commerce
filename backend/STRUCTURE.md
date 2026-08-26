backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       └── V1/
│   │   │           ├── Auth/
│   │   │           │   ├── LoginController.php
│   │   │           │   ├── RegisterController.php
│   │   │           │   └── LogoutController.php
│   │   │           ├── Admin/
│   │   │           │   ├── ProductController.php
│   │   │           │   ├── OrderController.php
│   │   │           │   ├── UserController.php
│   │   │           │   └── ReportController.php
│   │   │           ├── Agent/
│   │   │           │   └── DeliveryController.php
│   │   │           ├── CartController.php
│   │   │           ├── OrderController.php
│   │   │           ├── PaymentController.php
│   │   │           ├── ProductController.php
│   │   │           └── WishlistController.php
│   │   ├── Middleware/
│   │   │   └── RoleMiddleware.php
│   │   ├── Requests/          # Form Request validation
│   │   └── Resources/         # API Resources (JSON transformers)
│   │       └── V1/
│   ├── Models/
│   ├── Repositories/          # Optional: complex query abstraction
│   ├── Services/
│   │   ├── OrderService.php
│   │   ├── PaymentService.php
│   │   └── NotificationService.php
│   ├── Events/
│   │   └── OrderStatusUpdated.php
│   └── Listeners/
├── database/
│   ├── migrations/            # ✅ Phase 1 complete
│   ├── seeders/
│   └── factories/
├── routes/
│   └── api.php
└── tests/
    ├── Feature/
    └── Unit/
