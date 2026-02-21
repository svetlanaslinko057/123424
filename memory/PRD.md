# Y-Store Marketplace - PRD

## Original Problem Statement
Поднять фронтенд, бэкенд, MongoDB из GitHub репозитория https://github.com/svetlanaslinko057/cccccc2
Изучить текущий код, архитектуру, админку, фронт, бэк и подготовить к доработке.

## Architecture Summary

### Tech Stack
- **Backend**: FastAPI (Python 3.11), uvicorn, motor (async MongoDB driver)
- **Frontend**: React 19 + Tailwind CSS + shadcn/ui + lucide-react
- **Database**: MongoDB (motor async driver)
- **Bot**: Aiogram 3.x (Telegram Admin Bot @YStore_a_bot)
- **Payments**: Fondy (Merchant ID 1558123)
- **Delivery**: Nova Poshta API

### Key Integrations
- **Telegram Bot**: @YStore_a_bot (Token: 8239151803:AAF...)
- **Nova Poshta API**: 5cb1e3ebc23e75d737fd57c1e056ecc9
- **Fondy**: Merchant ID 1558123
- **Emergent LLM Key**: sk-emergent-49e23D0001bD9B3B69
- **Google OAuth**: via Emergent Auth

## What's Been Implemented

### 2026-02-21 - Initial Setup ✅
- [x] Cloned repository from GitHub
- [x] Created .env files with provided credentials
- [x] Installed all dependencies (pip + yarn)
- [x] Started backend (FastAPI on port 8001)
- [x] Started frontend (React on port 3000)
- [x] Started MongoDB
- [x] Started Telegram Bot (@YStore_a_bot)
- [x] Seeded 40 products and 41 categories
- [x] Created admin user (admin@ystore.com / admin123)

### Existing Features (from repo)
#### Backend
- Full order lifecycle (NEW→AWAITING_PAYMENT→PAID→PROCESSING→SHIPPED→DELIVERED→REFUNDED)
- TTN tracking via Nova Poshta API
- Fondy payment integration
- Refund system
- CRM module
- Risk assessment
- Guard/Fraud detection
- Analytics (basic + advanced)
- Automation engine
- Growth scheduler (abandoned carts, etc.)

#### Frontend
- Homepage V2 with hero slider, categories, products
- Catalog V2 with filters, sorting, pagination
- Product Detail V2 with gallery, specs, reviews
- Checkout V2 (Guest + Auth)
- Google OAuth
- Admin Panel with multiple tabs:
  - Analytics dashboard
  - Product management
  - Category management
  - Orders analytics
  - CRM dashboard
  - Promotions management
  - Reviews management
  - Returns dashboard
  - Risk center
  - A/B tests

#### Telegram Bot
- TTN wizard (create/track shipments)
- Broadcast wizard (mass notifications)
- Incidents wizard
- Pickup control (at-risk parcels)
- Returns handler
- Dashboard, orders, deliveries, CRM, finance views
- Guard alerts
- Automation engine

## Current State

**Backend**: RUNNING ✅ (http://localhost:8001)
**Frontend**: RUNNING ✅ (http://localhost:3000)
**MongoDB**: RUNNING ✅
**Telegram Bot**: RUNNING ✅ (@YStore_a_bot)

**Database Stats**:
- Products: 40
- Categories: 41
- Users: 1 (admin)

## Credentials
- **Admin**: admin@ystore.com / admin123
- **API URL**: https://checkout-premium.preview.emergentagent.com

## V2.0 Roadmap Progress

### ✅ COMPLETE (from previous sessions)
- BLOCK V2-1: Auth V2 (Google + Email + Guest Checkout)
- BLOCK V2-2: Account V2 (Cabinet with orders)
- BLOCK V2-3: Catalog V2 (Filters, Sorting, Pagination)
- BLOCK V2-4: Homepage V2 Components
- BLOCK V2-5: Product Page V2 (Gallery, Buy panel)
- BLOCK V2-8: Header V2 (Search, Navigation)
- BLOCK V2-9: TTN Tracking + Order Status System
- BLOCK V2-10: Order Flow + Refunds
- BLOCK V2-11: Design System + UI Unification Layer
- BLOCK V2-12: Retail Header + MegaMenu + Search Suggestions
- BLOCK V2-12R: Header V3 - Retail-style двухстрочный header ✅ (2026-02-21)
- BLOCK V2-12R.1: Social Block + Visual Balance ✅ (2026-02-21)
- BLOCK V2-13: Cart V2 + Side Drawer + Mini Cart Animation ✅ (2026-02-21)
- BLOCK V2-14: Homepage Retail Layout (DealOfDay, PromoGrid, BrandsStrip, Advantages, Testimonials, Blog) ✅ (2026-02-21)
- BLOCK V2-15: MegaMenu 2.0 (3-column, subcategories, popular tags, promo) ✅ (2026-02-21)

### 📋 PENDING (Next Tasks from user)
- BLOCK V2-14: Homepage Hero 2.0 (как Foxtrot - фон с глубиной, промо-плашки, анимации)
- Further UI/UX polish
- Additional admin features

## URLs
- **Preview**: https://checkout-premium.preview.emergentagent.com
- **API**: https://checkout-premium.preview.emergentagent.com/api
- **Admin**: /admin (requires admin login)
- **Telegram Bot**: @YStore_a_bot

## File Structure Summary

### Backend (/app/backend/)
```
├── server.py              # Main FastAPI with all endpoints
├── app.py                 # Modular app (alternative entry)
├── core/                  # Config, DB, Security
├── modules/
│   ├── auth/              # Auth V2 (Google OAuth, JWT)
│   ├── products/          # Products CRUD
│   ├── orders/            # Orders V2 + State Machine
│   ├── payments/          # Fondy integration
│   ├── delivery/          # Nova Poshta TTN
│   ├── refunds/           # Refund system
│   ├── bot/               # Telegram Admin Bot
│   ├── crm/               # CRM module
│   ├── analytics/         # Analytics
│   ├── guard/             # Fraud detection
│   └── ...
└── requirements.txt
```

### Frontend (/app/frontend/)
```
├── src/
│   ├── App.js             # Main app with routes
│   ├── pages/             # All pages (Home, Catalog, Admin, etc.)
│   ├── components/        # UI components
│   │   ├── layout/        # HeaderV2, Footer, MegaMenu
│   │   ├── admin/         # Admin dashboard components
│   │   └── ui/            # shadcn/ui components
│   ├── contexts/          # Auth, Cart, Favorites, etc.
│   ├── services/          # API services
│   └── utils/             # Utilities
└── package.json
```
