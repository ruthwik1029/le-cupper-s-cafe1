# Le Cuppers Implementation Plan & Engineering Roadmap

**Document Version:** 1.0.0  
**Phase:** 1 (Repository Audit, Stitch Analysis & Implementation Plan)  
**Execution Target:** Progressive, Non-Destructive Delivery of Le Cuppers Customer Platform  

---

## 1. Roadmap Overview & Milestones

The transition of Le Cuppers from an internal restaurant POS into a full-scale, customer-facing digital hospitality ecosystem is structured into **seven sequential phases**. Each phase is self-contained, respects strict safety boundaries, and enforces explicit acceptance criteria before subsequent phases commence.

```
+--------------------------------------------------------------------------------------------------+
| PHASE 1: Audit, Stitch Analysis & Implementation Plan                                [COMPLETED] |
| - Codebase & Monorepo Inspection                                                                 |
| - Stitch Design Parsing & Screen Map                                                             |
| - API Capability Verification & Architecture Baseline                                            |
+--------------------------------------------------------------------------------------------------+
                                                 |
                                                 v
+--------------------------------------------------------------------------------------------------+
| PHASE 2: Customer Web App Scaffolding & Design System Tokens                                     |
| - Initialize apps/customer-web in pnpm workspace                                                 |
| - Implement Artisanal Hospitality tokens (Colors, Typography, Elevation)                         |
| - Atomic UI Component Library (Buttons, Badges, Modifiers, Cards)                                |
+--------------------------------------------------------------------------------------------------+
                                                 |
                                                 v
+--------------------------------------------------------------------------------------------------+
| PHASE 3: Core Customer Storefront & Menu Discovery                                               |
| - Desktop & Mobile Home Pages (Hero, Seasonality, Story, Visit Us)                               |
| - Menu Catalog & Real-Time Dietary Filters                                                       |
| - Product Customization Engine (Roast, Milk, Temp, Add-ons)                                      |
+--------------------------------------------------------------------------------------------------+
                                                 |
                                                 v
+--------------------------------------------------------------------------------------------------+
| PHASE 4: Backend Public & Customer API Extensions                                                |
| - Public Storefront Menu API (Unauthenticated Branch Catalog)                                    |
| - Customer Account & OTP Authentication Module                                                   |
| - Online Order Intake (Takeaway / Delivery / Table QR Synchronized)                              |
+--------------------------------------------------------------------------------------------------+
                                                 |
                                                 v
+--------------------------------------------------------------------------------------------------+
| PHASE 5: Cart, Checkout & Payment Gateway Integration                                            |
| - Synchronized Cart Folio & Persistent Floating Drawer                                           |
| - Checkout Flow with GST & Packaging Fee Breakdown                                               |
| - Payment Gateway Integration (Razorpay / UPI Intent) & Webhooks                                 |
+--------------------------------------------------------------------------------------------------+
                                                 |
                                                 v
+--------------------------------------------------------------------------------------------------+
| PHASE 6: Morning Rituals Loyalty, Play Zone & Terroir Stories                                    |
| - Loyalty Points Accrual & Redemption Engine                                                     |
| - Play Zone Mini-Games (Roaster's Trivia & Memory Match)                                         |
| - Terroir Harvest Gazette & Roastery Visit Booking                                               |
+--------------------------------------------------------------------------------------------------+
                                                 |
                                                 v
+--------------------------------------------------------------------------------------------------+
| PHASE 7: Supabase Migration, Production Deployment & Verification                                |
| - Additive Prisma Migrations deployed to Supabase PostgreSQL                                     |
| - Deploy apps/customer-web to Vercel                                                             |
| - End-to-End Kitchen Ticket & POS Real-Time Verification                                         |
+--------------------------------------------------------------------------------------------------+
```

---

## 2. Phase-by-Phase Execution Plan

### Phase 1: Repository Audit, Stitch Analysis & Implementation Plan
- **Objective:** Establish the comprehensive architectural baseline, verify existing code against design specifications, and define non-destructive delivery guidelines.
- **Tasks Completed:**
  - Audited monorepo layout, Docker configuration, and NestJS modules.
  - Inspected 5 screens from Stitch project `14193457308377052654` and recorded missing screens.
  - Verified existing public endpoints in `public-menu.controller.ts` and `public-kiosk.controller.ts`.
  - Authored foundational documentation under `docs/lecuppers-customer-platform/`.
- **Status:** **Completed.**

---

### Phase 2: Customer Web App Scaffolding & Design System Tokens
- **Objective:** Create the standalone Next.js customer application within the existing monorepo without altering `apps/web`.
- **Tasks:**
  1. Scaffold `apps/customer-web` using Next.js 16 (App Router) and TypeScript.
  2. Register `apps/customer-web` in `pnpm-workspace.yaml` and configure Turborepo pipelines in `turbo.json`.
  3. Link `@nodedr-restaurant/types` package as a workspace dependency.
  4. Implement Artisanal Hospitality design tokens in CSS/Tailwind:
     - Font pairing: `EB Garamond` (editorial headlines) and `Plus Jakarta Sans` (interface & tabular pricing).
     - Color palette: `#072519` (Forest Green), `#fff8f1` (Warm Ivory), `#da7b41` (Burnt Orange), `#727e67` (Sage Olive).
     - Material Symbols Outlined font integration.
  5. Build atomic UI primitives: `PillButton`, `DietaryBadge`, `QuantityStepper`, `SearchInput`.
- **Dependencies:** Turborepo workspace.
- **Acceptance Criteria:**
  - `pnpm turbo run build` passes cleanly across all packages (`backend`, `web`, `types`, and `customer-web`).
  - No existing code or styling in `apps/web` is modified.

---

### Phase 3: Core Customer Storefront & Menu Discovery
- **Objective:** Build pixel-accurate desktop and mobile views for Home, Menu Catalog, and Product Detail based on Stitch designs.
- **Tasks:**
  1. **Layout Shell:**
     - Desktop sticky header with wordmark, navigation links, dining mode pill, customer points badge, and cart trigger.
     - Mobile header with active table dropdown and persistent 5-tab bottom navigation (`Home`, `Menu`, `Play Zone`, `Orders`, `Account`).
     - Footer with Roastery Gazette newsletter subscription and physical atelier info.
  2. **Home Page (`/`):**
     - Hero section with editorial typography, Q-Grader and elevation metrics, and dual CTAs.
     - Service Mode Toggle bar (`Table QR Dine-in: Table 04` vs. `Express Takeaway & Pickup`).
     - Seasonal highlights grid with dietary stamps (Pure Veg, Vegan, Gluten-Free) and roast tags.
     - Editorial narrative block (*From Soil to Ceramic: The Sanctuary of Slow Coffee*).
     - Morning Rituals Club teaser card with bean progress bar.
     - Atelier location card with address, operating hours, and direction actions.
  3. **Menu Discovery Page (`/menu`):**
     - Horizontal category scroll pill bar with active indicator.
     - Dietary filter chips (Vegetarian, Vegan, Gluten-Free, Chef's Pick) with live client-side filtering.
     - 4:3 ratio product cards featuring price in Indian Rupees (`₹320`), flavor notes, and quick-add actions.
  4. **Product Customization Engine (`/menu/[slug]`):**
     - Single-select required modifiers (Milk foundation: Whole, Oat, Almond; Temperature: Hot, Iced).
     - Multi-select optional modifiers (Ceylon cinnamon, Extra double shot, Vanilla bean).
     - Barista culinary instructions input.
     - Interactive price calculation engine dynamically updating the CTA button price.
- **Dependencies:** Phase 2 atomic components.
- **Acceptance Criteria:**
  - Responsive layouts render accurately on 390px (mobile) and 1280px+ (desktop) matching Stitch mockups.
  - Price calculations update instantaneously with zero UI lag upon selecting modifiers.

---

### Phase 4: Backend Public & Customer API Extensions
- **Objective:** Extend NestJS backend with public discovery, customer authentication, and online order intake without disturbing POS endpoints.
- **Tasks:**
  1. **Public Storefront Module (`src/modules/storefront/`):**
     - Implement `GET /v1/public/storefront/menu` returning active menu items and modifier groups for the flagship branch without requiring table tokens.
     - Implement `GET /v1/public/storefront/branch-info` returning café opening hours and live preparation wait estimates.
  2. **Customer Identity & Auth Module (`src/modules/customer-auth/`):**
     - Create Prisma additive models: `CustomerAccount` and `CustomerSession`.
     - Implement passwordless OTP dispatch and verification endpoints (`/v1/customer/auth/otp/send` and `/v1/customer/auth/otp/verify`).
     - Implement JWT session guard (`CustomerAuthGuard`) separating customer tokens from staff RBAC tokens.
  3. **Online Ordering Service Extension:**
     - Extend `OrdersService` to accept online orders (`channel: 'ONLINE'`, `type: 'TAKEAWAY'`).
     - Implement price preview endpoint (`POST /v1/customer/orders/calculate`) computing subtotal, applied coupon codes, and 5% Indian GST.
- **Dependencies:** NestJS, Prisma 6.
- **Acceptance Criteria:**
  - Automated Jest unit tests pass for new storefront controllers and customer auth guards.
  - Existing `PublicMenuController` (Table QR) continues to function without regression.

---

### Phase 5: Cart, Checkout & Payment Gateway Integration
- **Objective:** Implement the end-to-end purchasing workflow from shopping cart to digital payment settlement.
- **Tasks:**
  1. **Shopping Cart Experience:**
     - Desktop sticky Order Folio sidebar (`Table 04 • Service Ticket`).
     - Mobile floating bottom pill tray with item counter bubble and total amount.
     - Cart item editing (adjust quantities, re-configure modifiers, or remove item).
  2. **Checkout Flow (`/checkout`):**
     - Service mode verification: Table Dine-In vs. Express Takeaway pickup window.
     - Guest contact details (name, phone number for SMS tracking).
     - Transparent billing hierarchy (Subtotal, 5% GST, waived dine-in packaging fee, Total).
  3. **Payment Gateway Integration:**
     - Backend payment service for Razorpay / UPI Intent (`POST /v1/customer/payments/create-session`).
     - Frontend checkout integration (UPI App Switch / Card / Netbanking modal).
     - Cryptographic webhook listener (`POST /v1/customer/payments/webhook`) validating payment success, transitioning order status to `PAID`, and dispatching KOT tickets to the kitchen KDS.
- **Dependencies:** Phase 3 Cart UI, Phase 4 Order APIs.
- **Acceptance Criteria:**
  - Orders placed via online checkout appear immediately on the existing staff KDS screen (`apps/web/app/(dashboard)/kds`) with station routing.
  - Payment records in the database reconcile accurately with order totals.

---

### Phase 6: Morning Rituals Loyalty, Play Zone & Terroir Stories
- **Objective:** Build brand engagement experiences including the loyalty guild, barista waiting games, and editorial content.
- **Tasks:**
  1. **Loyalty Guild (Morning Rituals Club):**
     - Additive Prisma model `LoyaltyTransaction` tracking roast bean accruals and redemptions.
     - Automatic rule engine: Earn 10 beans per ₹100 spent on paid orders.
     - Customer rewards portal (`/account/loyalty`) displaying bean balance, tier badge (*Fellow Cupper*), and redeemable pour-over vouchers.
  2. **Play Zone Gamification (`/play-zone`):**
     - Daily Roaster's Trivia: 3 interactive questions on coffee varietals, shade washing, and roasting temperatures.
     - Memory Match: Card pairing mini-game matching coffee cherries, drippers, and ceramic cups.
     - Verified score submission awarding +30 bonus beans upon completion (rate-limited per guest/day).
  3. **Terroir Journal & Roastery Visit:**
     - Harvest journal blog articles (*Provenance & Epistolary*).
     - Roastery atelier tour reservation form with date/time slot selection.
- **Dependencies:** Customer account module (Phase 4).
- **Acceptance Criteria:**
  - Points earned from game completion and orders correctly reflect in the customer's live profile.
  - Redemptions apply appropriate discount deltas during cart checkout.

---

### Phase 7: Supabase Migration, Production Deployment & Verification
- **Objective:** Transition database to Supabase and deploy customer web to Vercel.
- **Tasks:**
  1. **Database Migration to Supabase:**
     - Provision Supabase managed PostgreSQL instance.
     - Export schema and seed data from local Docker Postgres using `pg_dump`.
     - Apply schema to Supabase and deploy additive customer migrations via `prisma migrate deploy`.
     - Update backend configuration with Supabase pooled connection string.
  2. **Production Web Deployment:**
     - Configure Vercel project linked to `apps/customer-web`.
     - Set production environment variables (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_BRANCH_ID`).
     - Configure custom domain (`lecuppers.com`) and SSL certificates.
  3. **End-to-End System Smoke Test:**
     - Validate staff POS and KDS operations on existing local terminals.
     - Place live test orders on Vercel customer website and verify KOT kitchen printout and KDS screen receipt.
- **Dependencies:** All previous phases.
- **Acceptance Criteria:**
  - Zero data loss during Supabase migration.
  - Customer website achieves 95+ Google Lighthouse performance score on Vercel.
  - POS cashier checkout and KDS continue running uninterrupted.
