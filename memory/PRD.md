# Y-Store Marketplace - PRD

## Original Problem Statement
Поднять фронтенд, бэкенд, MongoDB из GitHub репозитория и реализовать V2.0 Roadmap:
- https://github.com/svetlanaslinko057/ccccccc
- Превратить приложение из "витрины" в полноценный e-commerce с TTN трекингом, статусами заказов, возвратами

## Architecture Summary

### Tech Stack
- **Backend**: FastAPI (Python 3.11), uvicorn, motor
- **Frontend**: React 19 + Tailwind CSS + shadcn/ui
- **Database**: MongoDB (motor async driver)
- **Bot**: Aiogram 3.x (Telegram Admin Bot)
- **Payments**: Fondy
- **Delivery**: Nova Poshta API

### Key Integrations
- **Telegram Bot**: @YStore_a_bot
- **Nova Poshta API**: 5cb1e3ebc23e75d737fd57c1e056ecc9
- **Fondy**: Merchant ID 1558123
- **Emergent LLM Key**: sk-emergent-49e23D0001bD9B3B69
- **Google OAuth**: via Emergent Auth

## What's Been Implemented

### 2026-02-21 - BLOCK V2-9: TTN Tracking + Order Status System ✅
- [x] **Order Tracking API** (`GET /api/v2/orders/{order_id}/tracking`)
  - Returns order status, TTN, NP tracking status, timeline
  - Live fetch from Nova Poshta API
  - Auto-updates order with fresh NP status
- [x] **Order Timeline API** (`GET /api/v2/orders/{order_id}/timeline`)
  - Full status history with timestamps
- [x] **Refresh Tracking** (`POST /api/v2/orders/{order_id}/refresh-tracking`)
  - Force refresh from Nova Poshta
- [x] **Status Service** (`orders_status_service.py`)
  - Atomic status transitions with validation
  - Status history recording
  - Allowed transitions: NEW→AWAITING_PAYMENT→PAID→PROCESSING→SHIPPED→DELIVERED→REFUNDED

### 2026-02-21 - BLOCK V2-10: Order Flow + Refunds ✅
- [x] **Payment Success Handler** (`payment_success_handler.py`)
  - Idempotent payment processing
  - Auto PAID→PROCESSING transition
  - Ledger recording
- [x] **Refund Request API** (`POST /api/v2/refunds/request/{order_id}`)
  - Customer refund requests
  - Creates refund record + transitions order
- [x] **Refund Admin API**
  - `GET /api/v2/admin/refunds/pending` - pending refunds
  - `POST /api/v2/admin/refunds/approve/{order_id}` - approve refund
  - `POST /api/v2/admin/refunds/reject/{order_id}` - reject refund
- [x] **NP Tracking Cron** (`np_tracking_cron.py`)
  - Auto-sync delivery statuses
  - Auto SHIPPED→DELIVERED on NP delivered

### 2026-02-21 - BLOCK V2-4: Homepage Components ✅
- [x] Created homepage V2 components:
  - `AdvantagesStrip.jsx` - преимущества (доставка, гарантия, оплата)
  - `PromoGrid.jsx` - промо-сетка с тайлами
  - `DealOfDay.jsx` - товар дня с таймером
  - `BrandsStrip.jsx` - лента брендов
  - `BlogTeasers.jsx` - тизеры блога
  - `Testimonials.jsx` - отзывы покупателей
  - `ProductCarousel.jsx` - карусель продуктов

### Frontend CSS Added
- Order Card + Tracking styles (V2-9)
- Homepage V2 styles (V2-4)
- Catalog V2 styles (V2-6)
- Product Page V2 styles (V2-7)

## Current State

**Backend**: RUNNING ✅
- All V2-9, V2-10 APIs working
- 23/23 tests passed
- Full order lifecycle tested

**Frontend**: RUNNING ✅
- Homepage, Catalog, Product pages working
- Order tracking components ready

**Database Stats**:
- Products: 43
- Categories: 10
- Test orders: 1 (REFUNDED)

## Test Credentials
- **Test User**: test@test.com / test123
- **Admin**: admin@ystore.com / admin123
- **Test Order**: 00533399-5b5f-4add-95a0-f2c95f01bcfa

## API Endpoints Summary

### V2-9: Order Tracking
- `GET /api/v2/orders/{order_id}/tracking` ✅
- `GET /api/v2/orders/{order_id}/timeline` ✅
- `POST /api/v2/orders/{order_id}/refresh-tracking` ✅

### V2-10: Refunds
- `POST /api/v2/refunds/request/{order_id}` ✅
- `GET /api/v2/refunds/my` ✅
- `GET /api/v2/refunds/{refund_id}` ✅
- `GET /api/v2/admin/refunds/pending` ✅
- `POST /api/v2/admin/refunds/approve/{order_id}` ✅
- `POST /api/v2/admin/refunds/reject/{order_id}` ✅

## V2.0 Roadmap Progress

### ✅ COMPLETE
- BLOCK V2-1: Auth V2 (Google + Email + Guest Checkout)
- BLOCK V2-2: Account V2 (Cabinet with orders)
- BLOCK V2-3: Catalog V2 (Filters, Sorting, Pagination)
- BLOCK V2-5: Product Page V2 (Gallery, Buy panel)
- BLOCK V2-8: Header V2 (Search, Navigation)
- **BLOCK V2-9: TTN Tracking + Order Status System**
- **BLOCK V2-10: Order Flow + Refunds**

### 📋 PENDING (Frontend Integration)
- BLOCK V2-4: Homepage V2 - components created, need Page Builder integration
- BLOCK V2-6: Advanced Catalog Filters - CSS ready, need full implementation
- BLOCK V2-7: Product Page V2 - CSS ready, need component updates

### 📋 FUTURE
- BLOCK V2-0: Remove Marketplace remnants
- Order Notifications (SMS/Email on status change)
- Payment webhooks integration

## URLs
- **Frontend**: https://retail-megastore-dev.preview.emergentagent.com
- **API**: https://retail-megastore-dev.preview.emergentagent.com/api
- **Admin**: /admin
