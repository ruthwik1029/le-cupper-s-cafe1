# Le Cuppers API Capability & Gap Map

**Document Version:** 1.0.0  
**Audit Target:** Existing NestJS Backend (`apps/backend`) vs. Le Cuppers Customer Platform  
**Verification Method:** Direct Source Code Inspection  

---

## 1. Executive Summary

This document establishes the verified inventory of backend endpoints currently implemented in the NestJS application, highlights reusable APIs for the customer platform, and identifies critical gaps that must be developed to support the full Le Cuppers brand experience (public menu browsing, customer accounts, online takeaway/delivery orders, digital payment gateways, and gamified loyalty).

### Capability Status Legend
- **[VERIFIED - EXISTING]:** Verified directly in `apps/backend/src/` controllers and services with functioning database logic.
- **[PLANNED / STUBBED]:** Referenced in documentation or entity types, but lacking functioning customer-facing API logic.
- **[REQUIRED EXTENSION]:** Missing backend capability required to satisfy the Stitch customer experience and business goals.

---

## 2. Existing Endpoints & Verification Audit

### 2.1 Public Menu & Table Flow (`apps/backend/src/modules/public/public-menu.controller.ts`)

| HTTP Method & Route | Auth & Guard | Source Verification | Status & Operational Scope |
|---|---|---|---|
| `GET /v1/public/menu/:qrToken` | Public (Unauthenticated) | `public-menu.controller.ts:18` | **[VERIFIED - EXISTING]** Resolves table by opaque `qrToken`, returns branch name, table name, and all active menu categories with modifier groups. |
| `POST /v1/public/menu/:qrToken/order` | Public (Rate limit: 10/min) | `public-menu.controller.ts:26` | **[VERIFIED - EXISTING]** Validates via `publicOrderSchema`. If open order exists for table, appends items (`addItems`). Otherwise creates order with `type: 'QR_ORDER'`. |
| `GET /v1/public/menu/:qrToken/status` | Public (Unauthenticated) | `public-menu.controller.ts:33` | **[VERIFIED - EXISTING]** Returns current live order status (`OPEN`, `BILLED`), acceptance status, line items, and active table requests. |
| `POST /v1/public/menu/:qrToken/request` | Public (Rate limit: 6/min) | `public-menu.controller.ts:40` | **[VERIFIED - EXISTING]** Submits table request (`WAITER` or `BILL`), emits real-time event to branch staff via Socket.IO, and dispatches notifications. |

### 2.2 Public Kiosk Flow (`apps/backend/src/modules/public/public-kiosk.controller.ts`)

| HTTP Method & Route | Auth & Guard | Source Verification | Status & Operational Scope |
|---|---|---|---|
| `GET /v1/public/kiosk/:kioskToken` | Public (Rate limit: 60/min) | `public-kiosk.controller.ts:16` | **[VERIFIED - EXISTING]** Returns branch menu categories for self-service kiosk tablet. |
| `POST /v1/public/kiosk/:kioskToken/order` | Public (Rate limit: 20/min) | `public-kiosk.controller.ts:24` | **[VERIFIED - EXISTING]** Creates order with `type: 'KIOSK'` and `channel: 'STAFF'`. |

### 2.3 Orders & Checkout (`apps/backend/src/modules/orders/orders.controller.ts`)

| HTTP Method & Route | Auth & Guard | Source Verification | Status & Operational Scope |
|---|---|---|---|
| `POST /v1/orders` | Staff Auth (`orders.manage`) | `orders.controller.ts:60` | **[VERIFIED - EXISTING]** Primary order creation for staff POS terminals. |
| `POST /v1/orders/:id/items` | Staff Auth (`orders.manage`) | `orders.controller.ts:74` | **[VERIFIED - EXISTING]** Adds items to an existing open ticket. |
| `POST /v1/orders/:id/discount-preview` | Staff Auth | `orders.controller.ts:140` | **[VERIFIED - EXISTING]** Calculates coupon discounts or automatic promotion rules against order total. |
| `POST /v1/orders/:id/checkout` | Staff Auth (`bills.print`) | `orders.controller.ts:175` | **[VERIFIED - EXISTING]** Staff settles order with payment methods (`CASH`, `CARD`, `UPI`, `GIFT_CARD`, `WALLET`). **No online customer payment integration.** |
| `POST /v1/orders/:id/refund` | Staff Auth (`bills.refund`) | `orders.controller.ts:270` | **[VERIFIED - EXISTING]** Issues full or partial refund on settled payments. |

### 2.4 Customer CRM (`apps/backend/src/modules/customers/customers.controller.ts`)

| HTTP Method & Route | Auth & Guard | Source Verification | Status & Operational Scope |
|---|---|---|---|
| `GET /v1/customers` | Staff Auth (`customers.manage`) | `customers.controller.ts:29` | **[VERIFIED - EXISTING]** Lists CRM customer profiles by branch with search filter. |
| `GET /v1/customers/:id` | Staff Auth (`customers.manage`) | `customers.controller.ts:40` | **[VERIFIED - EXISTING]** Retrieves customer details, order history (last 20 paid orders), and active gift cards. |
| `POST /v1/customers` | Staff Auth (`customers.manage`) | `customers.controller.ts:51` | **[VERIFIED - EXISTING]** Creates customer record with phone, name, email, and address. |
| `PATCH /v1/customers/:id` | Staff Auth (`customers.manage`) | `customers.controller.ts:63` | **[VERIFIED - EXISTING]** Updates customer CRM details and notes. |

### 2.5 Real-Time Gateway (`apps/backend/src/realtime/realtime.gateway.ts`)

| Gateway & Event | Transport | Source Verification | Status & Operational Scope |
|---|---|---|---|
| `/kds` namespace | Socket.IO | `realtime.gateway.ts` | **[VERIFIED - EXISTING]** Pushes new kitchen tickets to station screens upon order creation. |
| `/tables` namespace | Socket.IO | `realtime.gateway.ts` | **[VERIFIED - EXISTING]** Emits table status changes (`FREE`, `OCCUPIED`) and waiter/bill requests. |
| `/orders` namespace | Socket.IO | `realtime.gateway.ts` | **[VERIFIED - EXISTING]** Emits live status changes (`OPEN` -> `PREPARING` -> `READY` -> `PAID`). |

---

## 3. Capability Gaps & Required API Extensions

To deliver the Le Cuppers customer experience outlined in the Stitch design, the following API modules must be introduced into `apps/backend/src/modules/`:

### 3.1 Storefront & Public Discovery (`/v1/public/storefront/*`)
- **Gap:** Currently, retrieving menu categories strictly requires a physical table `qrToken` or branch `kioskToken`. A user browsing the website from home receives an HTTP 404.
- **Required Extension:**
  - `GET /v1/public/storefront/menu`: Returns the complete Le Cuppers catalog for the default/flagship branch without requiring a table token. Supports category filtering, search queries, and dietary tags (`veg`, `vegan`, `gluten-free`).
  - `GET /v1/public/storefront/items/:id`: Detailed view of a single provision with modifier groups (grind types, dairy bases, temperatures, syrups) and allergen advisories.
  - `GET /v1/public/storefront/branches`: Returns café atelier location, opening hours, kitchen timings, and current wait-time estimates (e.g., `8 – 12 mins`).

### 3.2 Customer Authentication & Profile (`/v1/customer/auth/*` & `/v1/customer/profile/*`)
- **Gap:** There is currently zero self-service customer authentication. The `users` table is reserved for staff, and the `customers` table has no password hash or auth tokens.
- **Required Extension:**
  - `POST /v1/customer/auth/otp/send`: Initiates passwordless authentication by dispatching a 6-digit one-time passcode to the customer's mobile number or email.
  - `POST /v1/customer/auth/otp/verify`: Validates OTP and issues an `httpOnly` customer session JWT (`customer_token`).
  - `GET /v1/customer/profile`: Returns authenticated customer profile, saved delivery addresses, active orders, and bean points balance.
  - `PATCH /v1/customer/profile`: Updates customer details, dietary preferences, and birthday.

### 3.3 Online Customer Ordering & Checkout (`/v1/customer/orders/*`)
- **Gap:** Existing `createOrder` logic in `PublicMenuService` only supports in-store `QR_ORDER` attached to a `tableId`. Customers ordering for **Express Takeaway & Pickup** or **Delivery** cannot place orders.
- **Required Extension:**
  - `POST /v1/customer/orders`: Accepts cart items, service mode (`TAKEAWAY` or `DELIVERY`), customer contact details, scheduled pickup slot, and special culinary instructions. Creates an order with `channel: 'ONLINE'` and `type: 'TAKEAWAY'`.
  - `POST /v1/customer/orders/calculate`: Previews itemized pricing, applied coupon codes, packaging charges (waived for dine-in), and Indian GST (5%).

### 3.4 Digital Payment Gateway Integration (`/v1/customer/payments/*`)
- **Gap:** The existing system records settlements manually through POS cashiers (`POST /v1/orders/:id/checkout`). There is no online payment gateway integration.
- **Required Extension:**
  - `POST /v1/customer/payments/create-session`: Initializes an online payment transaction with the selected payment gateway (e.g., Razorpay / UPI Intent / Cards). Returns the gateway `orderId` and client token.
  - `POST /v1/customer/payments/webhook`: Authenticated server-to-server webhook endpoint verifying cryptographic signatures, marking the order as `PAID`, releasing the ticket to the kitchen KDS, and triggering KOT printing.

### 3.5 Morning Rituals Loyalty Guild (`/v1/customer/loyalty/*`)
- **Gap:** The `customers` table has an integer `loyaltyPoints` field, but there is no rule engine calculating accruals, no ledger tracking history, and no redemption logic.
- **Required Extension:**
  - `GET /v1/customer/loyalty/balance`: Returns total roast bean points, current tier (*Fellow Cupper*), and progress toward next milestone (e.g., `140 / 200 beans`).
  - `GET /v1/customer/loyalty/history`: Paginated ledger of points earned from orders and games, or deducted for redemptions.
  - `POST /v1/customer/loyalty/redeem`: Applies points toward reward items (e.g., bespoke pour-over flight or bakery treat) as a discount line on checkout.

### 3.6 Play Zone Gamification & Quizzes (`/v1/games/*`)
- **Gap:** No gamification features exist in the backend.
- **Required Extension:**
  - `GET /v1/games/trivia/daily`: Returns 3 randomized coffee trivia questions for customers waiting for barista extractions.
  - `POST /v1/games/score`: Records game completion, validates anti-cheat thresholds, and credits bonus bean points (`+30 Beans`) to the customer's loyalty ledger (capped once per order/day).

---

## 4. API Reusability & Data Compatibility Matrix

| Customer Web Feature | Reusable Backend Component | Required Extension / Adaptation |
|---|---|---|
| **Menu Browsing** | `menuCategoriesForBranch()` query in `PublicMenuService` | Wrap in branch-scoped public endpoint without table token requirement. |
| **Dine-in Table QR** | `PublicMenuController` (`/v1/public/menu/:qrToken`) | Reuse 100% as-is when guest scans physical table QR code. |
| **Modifier Validation** | `enforceModifierLimits()` in `OrdersService` | Reuse directly to validate min/max modifier selections. |
| **Kitchen Ticket Creation** | `OrdersService.createOrder()` & KDS Socket.IO | Reuse directly; routes new online orders to kitchen screens seamlessly. |
| **Tax Calculation** | `pricing.ts` (Round2 discipline & GST calculation) | Reuse directly for item subtotal and 5% restaurant GST calculations. |
| **Coupon Discounts** | `POST /v1/orders/:id/discount-preview` logic | Expose unauthenticated public calculate endpoint for customer cart preview. |
| **Customer Storage** | `Customer` Prisma model in `customers` table | Add `CustomerAccount` relation to support authenticated online sessions. |
