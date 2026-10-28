# Le Cuppers Architecture Specification: Current State vs. Proposed Target

**Document Version:** 1.0.0  
**Phase:** 1 (Repository Audit, Stitch Analysis & Implementation Plan)  
**System Target:** Production-Ready Restaurant Technology Ecosystem  

---

## 1. Executive Summary

This document establishes the architectural baseline of the existing restaurant point-of-sale (POS) and back-office management system, and defines the proposed architecture for introducing a dedicated, high-aesthetic customer-facing digital web platform (**Le Cuppers**).

### Core Architectural Mandates
1. **Preserve the POS Core:** The existing staff-facing Point-of-Sale (POS), Kitchen Display System (KDS), Table Management, Inventory, Accounting, Attendance, and Compliance modules must remain completely intact and functional.
2. **Reuse Backend Services:** The existing NestJS backend and PostgreSQL database schema will be reused as the single source of truth for menu items, pricing, inventory deductions, kitchen routing, and order processing.
3. **Decouple Customer Front-End:** The customer-facing web platform will be implemented as an independent Next.js application (`apps/customer-web`) within the monorepo workspace, designed for edge hosting on Vercel and zero operational collision with local hardware POS terminals.
4. **Controlled Cloud Database Evolution:** The database will transition from local Dockerized PostgreSQL to Supabase through structured, backwards-compatible Prisma migrations without data loss or schema resets.

---

## 2. Current Architecture (As Audited)

### 2.1 Workspace & Monorepo Topology
- **Monorepo Manager:** `pnpm` workspaces (`v11.10.0`) orchestrated by **Turborepo** (`v2.10.9`).
- **Workspace Config (`pnpm-workspace.yaml`):**
  ```yaml
  packages:
    - "apps/*"
    - "packages/*"
  ```
- **Monorepo Layout:**
  ```text
  nodedr-restaurant-pos/
  ├── apps/
  │   ├── backend/        # NestJS 11 REST API, Socket.IO, Swagger, Prisma ORM
  │   └── web/            # Next.js 16 staff POS, KDS, Back-office, Table-QR & Kiosk
  ├── packages/
  │   └── types/          # Shared Zod validation schemas & TypeScript DTO contracts
  ├── docker-compose.yml  # Local stack: postgres, backend (with USB printer passthrough), web, updater
  ├── updater/            # Independent container sidecar for one-click updates
  ├── windows/            # MSIX packaging scripts for offline Windows POS deployment
  └── docs/               # System documentation (POS, KDS, Veri*Factu, Indian Compliance)
  ```
- **Git Status:** **NOT under Git.** The repository directory (`nodedr-restaurant-pos-master 2`) contains no `.git` metadata (originating from an unzipped source release).

### 2.2 Existing Staff & Terminal Web Application (`apps/web`)
- **Framework:** Next.js `16.4.2` (App Router), React `19.2.8`.
- **Styling & UI:** Tailwind CSS `v4.3.3`, `@base-ui/react`, Radix/shadcn patterns, `motion` (v13.1.0), Lucide React.
- **Routing Surface (`app/`):**
  - `(dashboard)/`: Route group covering 15 internal domains:
    - `/pos`: Cashier checkout, split billing, table ordering, bar/kitchen printing.
    - `/kds`: Real-time Kitchen Display System partitioned by station.
    - `/tables`: Floor plan, table status (FREE, OCCUPIED, RESERVED), waiter assignment.
    - `/menu`: Category and item management, recipe ingredients, modifier groups.
    - `/orders`: Order management, KOTs, bill refunds, settlement history.
    - `/customers`: Staff-facing CRM (search, birthday/allergies, loyalty points balance, store credit).
    - `/inventory`: Purchase orders, goods receipts, waste logs, stock transfers.
    - `/accounting`: Cash closings, expenses, tax regimes, Indian GST ledgers.
    - `/attendance`, `/team`, `/reservations`, `/delivery`, `/marketing`, `/reports`, `/settings`.
  - `/kiosk/[token]`: Self-service tablet kiosk mode with full-screen PWA manifest and service worker.
  - `/login`: Staff authentication (Email/Password or PIN-based fast-switch).
  - `/page.tsx`: Marketing landing page for the OrderRestro software product.

### 2.3 Existing NestJS Backend API (`apps/backend`)
- **Framework:** NestJS `11.2.6`, Node `>=22`.
- **Database & ORM:** PostgreSQL `16`, Prisma `6.19.3`.
- **API Architecture:** Versioned REST (`/api/v1/`), OpenAPI/Swagger documentation (`/api/docs`), Socket.IO real-time gateways (`/kds`, `/tables`, `/orders`).
- **Security & Authorization:**
  - JWT in `httpOnly` secure cookies.
  - Role-Based Access Control (RBAC) enforced via `@Auth(permission)` decorators and `PermissionsPolicyGuard`.
  - Rate limiting via `@nestjs/throttler` (default: 300 req/min; public table QR: 10 req/min; kiosk: 20 req/min).
  - TOTP Two-Factor Authentication (`two-factor.service.ts`).
- **Public Entry Points (`apps/backend/src/modules/public`):**
  - `PublicMenuController` (`/v1/public/menu/:qrToken`): Resolves a physical table by opaque `qrToken`, returns branch categories, allows guests to order (`POST /v1/public/menu/:qrToken/order`), check order status, or call staff (`POST /v1/public/menu/:qrToken/request`).
  - `PublicKioskController` (`/v1/public/kiosk/:kioskToken`): Unauthenticated kiosk ordering by branch kiosk token.
- **Hardware Integration:**
  - Thermal receipt printing via ESC/POS directly to USB (`/dev/usb/lp0` and libusb `class-7`) or network TCP.
  - Cash drawer triggering via ESC/POS kick codes.

### 2.4 Existing Docker & Infrastructure Setup
- **`postgres` container:** `postgres:16-alpine`, internal Docker network only (port 5432 not exposed to host).
- **`backend` container:** Node Alpine runtime, depends on healthy postgres. Grants `device_cgroup_rules` for major device numbers `189` (USB) and `180` (printer `usblp0`). Exposes port 4000 internally.
- **`web` container:** Built with `BACKEND_URL=http://backend:4000`, publishes host port `1995:3000`.
- **`updater` container:** Docker socket volume mount for rolling image updates.

---

## 3. Architectural Deficiencies for a Public Customer Brand

While the current system provides an exceptional offline-first POS and back-office, it lacks the foundational elements required for an artisanal, customer-facing e-commerce storefront:

1. **No Non-Table Public Menu Endpoint:** Both `PublicMenuController` and `PublicKioskController` require physical hardware identifiers (`qrToken` tied to a specific table ID or `kioskToken` tied to a physical station). A customer visiting `lecuppers.com` from home has no table or kiosk token.
2. **No Customer Account & Authentication Model:** The `User` model is strictly for restaurant staff with administrative roles and restaurant IDs. The `Customer` model is purely an offline CRM record created by cashiers, lacking password hashes, OAuth providers, or session tokens.
3. **No Online Payment Gateway Integration:** All existing payments in `POST /v1/orders/:id/checkout` are settled by staff on POS terminals. No online payment providers (Razorpay, Stripe, UPI Intent) are integrated.
4. **No Digital Customer Ordering (Takeaway/Delivery):** Orders placed via public QR or kiosk must be attached to a `tableId` or marked as kiosk orders. Online pickup or scheduled takeaway cannot be initiated by customers.
5. **No Engagement Engines:** The database and backend have no concepts for Roaster's Trivia, Memory Match games, customer loyalty point ledgers, or editorial harvest gazettes.

---

## 4. Proposed Target Architecture

```
                                  +-------------------------------------------------------------+
                                  |                     CUSTOMER TOUCHPOINTS                    |
                                  +-------------------------------------------------------------+
                                                                 |
                                       +-------------------------+-------------------------+
                                       |                                                   |
                                       v                                                   v
                         [Customer Mobile Web / PWA]                             [Customer Desktop Web]
                         (EB Garamond / Jakarta Sans)                            (Curated Atelier UI)
                                       |                                                   |
                                       +-------------------------+-------------------------+
                                                                 |
                                                                 v
                                             +---------------------------------------+
                                             |           apps/customer-web           |
                                             |      Next.js 16 (App Router)          |
                                             |      Hosted on Vercel Edge            |
                                             +---------------------------------------+
                                                                 |
                                              HTTPS / JSON REST  | (API Proxy / CORS)
                                                                 v
                                             +---------------------------------------+
                                             |             apps/backend              |
                                             |       NestJS 11 Application           |
                                             |   (Staff API + Customer Storefront)   |
                                             +---------------------------------------+
                                                                 |
                                     +---------------------------+---------------------------+
                                     |                           |                           |
                                     v                           v                           v
                           [Prisma ORM 6.x]              [Socket.IO Gateway]        [Payment Gateway]
                                     |                           |                  (Razorpay / UPI)
                                     v                           |
                        +-------------------------+              |
                        |   PostgreSQL Database   |              |
                        |   (Supabase Managed)    |              |
                        +-------------------------+              |
                                     ^                           |
                                     | DB Connection             |
                                     |                           v
+------------------------------------+---------------------------+-----------------------------------+
|                                  IN-STORE RESTAURANT OPERATIONS                                   |
+------------------------------------+---------------------------+-----------------------------------+
|                                    |                           |                                   |
|                                    v                           v                                   v
|                          [apps/web (POS Terminals)]   [Kitchen KDS Screens]       [ESC/POS Printers]       |
|                          - Cashier checkout           - Realtime ticket updates   - Kitchen order KOTs     |
|                          - Floor & table seating      - Station item routing      - Customer bill receipts |
|                          - Inventory & accounting                                                          |
+----------------------------------------------------------------------------------------------------+
```

### 4.1 Structural Layout in Monorepo
The proposed architecture adds `apps/customer-web` without altering `apps/web` or breaking monorepo dependencies:

```text
nodedr-restaurant-pos/
├── apps/
│   ├── backend/               # Reused & extended NestJS API
│   ├── web/                   # PRESERVED: Staff POS, KDS, Back-office
│   └── customer-web/          # NEW: Le Cuppers Customer Brand Experience
├── packages/
│   ├── types/                 # Shared DTOs (Extended with Customer & Storefront schemas)
│   └── ui/                    # Optional future extraction of shared design primitives
├── docs/
│   └── lecuppers-customer-platform/ # Implementation specifications & audit reports
```

### 4.2 Application Responsibilities

| Dimension | `apps/web` (Existing POS & Ops) | `apps/customer-web` (New Brand Web) |
|---|---|---|
| **Audience** | Cashiers, Waiters, Kitchen Staff, Managers, Owners | Café guests, online customers, loyalty members |
| **Visual Aesthetic** | High-density administrative UI, shadcn slate/neutral | Artisanal Hospitality, EB Garamond, Forest Green, Ivory |
| **Deployment Target** | On-premise Docker server / LAN / Staff subdomain | **Vercel** Edge hosting (`lecuppers.com`) |
| **Authentication** | Staff JWT cookie with RBAC permissions | Customer OTP / JWT session (`customer.jwt`) |
| **State Management** | Fast table switching, offline drafts, printer queues | Shopping cart, dining mode toggle, bean progress |
| **Hardware** | USB thermal printers, cash drawers, barcode scanners | Standard browser / mobile responsive viewports |

---

## 5. Database Architecture & Supabase Strategy

### 5.1 Preservation Rule
The current schema (`apps/backend/prisma/schema.prisma`) comprises **62 models and 23 enums**. Under no circumstances will existing models (`Order`, `OrderItem`, `Table`, `MenuItem`, `StockBatch`, etc.) be dropped or refactored with destructive migrations.

### 5.2 Extended Data Models (Additive Only)
The customer platform requires new and extended models added via planned Prisma migrations:

```prisma
// 1. Customer Authentication & Account Identity
model CustomerAccount {
  id            String    @id @default(cuid())
  phone         String    @unique
  email         String?   @unique
  name          String
  passwordHash  String?   // optional if using passwordless OTP
  avatarUrl     String?
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Multi-branch customer profile links
  profiles      Customer[]
  sessions      CustomerSession[]
  loyaltyLedger LoyaltyTransaction[]
  gameSessions  CustomerGameScore[]
  addresses     CustomerSavedAddress[]
}

// 2. Verified Loyalty Ledger (Morning Rituals Guild)
model LoyaltyTransaction {
  id          String   @id @default(cuid())
  accountId   String
  account     CustomerAccount @relation(fields: [accountId], references: [id], onDelete: Cascade)
  branchId    String
  points      Int      // positive for accrual (+10 per ₹100), negative for redemption
  balanceAfter Int
  reason      String   // "ORDER_EARN", "TRIVIA_WIN", "REWARD_REDEMPTION"
  orderId     String?
  createdAt   DateTime @default(now())

  @@index([accountId])
}

// 3. Play Zone Gamification & Quiz Scores
model CustomerGameScore {
  id          String   @id @default(cuid())
  accountId   String
  account     CustomerAccount @relation(fields: [accountId], references: [id], onDelete: Cascade)
  gameType    String   // "ROASTER_TRIVIA", "MEMORY_MATCH"
  score       Int
  pointsAwarded Int    @default(0)
  playedAt    DateTime @default(now())

  @@index([accountId, gameType])
}
```

### 5.3 Supabase Cloud Migration Plan
1. **Target:** Managed PostgreSQL on Supabase.
2. **Connection Strategy:**
   - **Direct connection (port 5432):** Used exclusively for Prisma migrations (`prisma migrate deploy`).
   - **Transaction pooler (port 6543 / Supavisor):** Configured for high-concurrency runtime NestJS queries on cloud hosts.
3. **Migration Steps:**
   - Step 1: Export current PostgreSQL schema and seed data using `pg_dump --clean --no-owner`.
   - Step 2: Provision Supabase project; configure compute tier and region (e.g., `ap-south-1` Mumbai for India latency).
   - Step 3: Restore data into Supabase and verify data integrity.
   - Step 4: Apply additive customer migrations using standard `prisma migrate deploy`.
   - Step 5: Update backend environment variable `DATABASE_URL` with pooled connection string.

---

## 6. Hosting & Network Architecture

### 6.1 Customer Web Platform on Vercel
- **Repository Link:** Vercel deploys `apps/customer-web` as the root of the production project.
- **Environment Variables:**
  - `NEXT_PUBLIC_API_URL`: Public URL of the NestJS backend (e.g., `https://api.lecuppers.com`).
  - `NEXT_PUBLIC_BRANCH_ID`: Default flagship branch identifier (Bengaluru Atelier).
- **Performance:** Dynamic SSR for menu pages with Incremental Static Regeneration (ISR, e.g., 60-second revalidation for pantry menu updates).

### 6.2 Backend Cloud Hosting
- **Target Host:** AWS ECS, Railway, or Render with managed Docker container deployment.
- **CORS Configuration:** Explicitly allow `https://lecuppers.com`, `https://*.vercel.app`, and local development origins.
- **WebSocket Gateway:** Real-time Socket.IO communication enabled with WSS on cloud reverse proxies.
- **LAN POS Hardware Compatibility:** If thermal receipt printers remain physical on the café LAN, a lightweight local print relay agent (already supported in `windows/` and `scripts/`) bridges cloud KOT events to local USB printers.

---

## 7. Verification & Architectural Guardrails

- **Zero Breaking Changes:** POS routes (`/pos`, `/kds`, `/tables`) in `apps/web` must return HTTP 200 without any code or style alterations.
- **Isolated Assets:** The Stitch design assets (EB Garamond font, Warm Ivory palette, editorial imagery) belong strictly to `apps/customer-web`.
- **Shared Contracts:** All new customer endpoints must define Zod schemas in `packages/types` to guarantee end-to-end type safety between the backend and customer web app.
