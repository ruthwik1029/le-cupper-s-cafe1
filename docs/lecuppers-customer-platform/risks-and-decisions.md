# Le Cuppers Technical Risks & Architectural Decisions (ADR)

**Document Version:** 1.0.0  
**Status:** Pending Stakeholder Input & Technical Review  
**Audience:** Senior Engineering, Product Leadership, Operations  

---

## 1. Executive Summary

This document outlines key technical decisions and potential risks associated with introducing the Le Cuppers customer-facing web platform into an active restaurant point-of-sale ecosystem. Each item details the trade-offs, recommended approach, and specific decisions requiring stakeholder confirmation.

---

## 2. Key Architecture Decisions Requiring Input

### Decision 1: Customer Authentication Strategy
- **Context:** The existing POS backend uses staff-level JWT cookies with bcrypt passwords and TOTP 2FA. The customer storefront requires a frictionless login experience that works seamlessly across mobile and desktop.
- **Options Evaluated:**
  - **Option A (Recommended): Passwordless Mobile Number OTP (SMS / WhatsApp)**
    - *Pros:* Standard for Indian e-commerce and dining; highest conversion rate; directly maps to Indian phone numbers already tracked in the POS `customers` CRM table.
    - *Cons:* Incurs per-message SMS gateway fees (e.g., Twilio, MSG91, or Gupshup); requires SMS carrier fallback handling.
  - **Option B: Email Magic Links**
    - *Pros:* Zero per-SMS cost (via Resend/SendGrid); low spam vulnerability.
    - *Cons:* High friction on mobile devices; café guests sitting at tables rarely check emails to place a quick coffee order.
  - **Option C: Supabase Auth (OAuth / Google / Apple / Phone)**
    - *Pros:* Managed token infrastructure, out-of-the-box social login and phone OTP.
    - *Cons:* Couples frontend authentication directly to Supabase rather than the NestJS backend, requiring an auth synchronization bridge.
- **Recommended Path:** **Option A (Mobile Phone OTP via Indian SMS Gateway with WhatsApp fallback)**.
- **Stakeholder Decision Needed:** Approval of Mobile OTP approach and selection of preferred SMS provider (MSG91, Twilio, or Kaleyra).

---

### Decision 2: Online Payment Gateway Selection
- **Context:** The existing backend records manual settlements (`CASH`, `CARD`, `UPI` static QR) at the POS counter. The customer website requires digital payment settlement for online takeaway and table QR checkout.
- **Options Evaluated:**
  - **Option A (Recommended): Razorpay Standard Integration**
    - *Pros:* Market leader in India; native support for UPI Intent (GPay, PhonePe, Paytm), credit/debit cards, Netbanking, and EMI; rich webhooks with cryptographic SHA256 signatures; robust Node.js SDK.
    - *Cons:* Standard 2% domestic transaction fee.
  - **Option B: PhonePe Payment Gateway**
    - *Pros:* Competitive MDR rates; strong UPI market share in urban India.
    - *Cons:* Less extensive developer documentation and SDK ergonomics compared to Razorpay.
  - **Option C: Stripe India**
    - *Pros:* Exceptional developer tooling and webhook reliability.
    - *Cons:* Severe regulatory restrictions for Indian domestic cards and recurring mandates; limited native UPI Intent flows.
- **Recommended Path:** **Option A (Razorpay)**.
- **Stakeholder Decision Needed:** Confirmation to proceed with Razorpay integration and provision of sandbox API keys.

---

### Decision 3: Morning Rituals Guild Loyalty Rules & Accrual Engine
- **Context:** The Stitch designs show a loyalty widget: *"Earn 10 roast beans per ₹100 spent. Redeem for bespoke pour-over flights, seasonal viennoiserie, and invitation-only cupping circles. Current Balance: 140 Beans, Next Reward at 200."*
- **Policy Rules to Finalize:**
  1. **Accrual Rate:** Confirm 10 beans per ₹100 spent (equivalent to 10% gross value or 1 bean = ₹1 store value).
  2. **Tax & Packaging Inclusion:** Are loyalty points awarded on the pre-tax item subtotal (`₹650.00`) or the final inclusive total (`₹682.50`)? (Recommended: pre-tax subtotal to avoid awarding points on government taxes).
  3. **Play Zone Game Points Cap:** The mobile design awards `+30 Bean Points` for winning Roaster's Trivia or Memory Match.
     - *Risk:* Automated bots or repeated replays could exploit free bean accrual.
     - *Mitigation:* Restrict game bonus points to a maximum of **1 reward per day per verified customer phone number**, unlocked only when the guest has an active café order.
  4. **Points Expiration:** Will roast beans expire after 6 or 12 months of account inactivity?
- **Stakeholder Decision Needed:** Sign-off on loyalty accrual boundaries and anti-abuse caps for Play Zone mini-games.

---

### Decision 4: Database Migration to Supabase & Connection Strategy
- **Context:** The existing PostgreSQL database runs locally inside a Docker container (`postgres:16-alpine`). The target architecture plans to migrate the database to Supabase.
- **Risks & Trade-Offs:**
  - **Latency Impact on POS Terminals:** In-store POS cashier terminals currently execute queries against `localhost:5432` with sub-millisecond response times. Shifting the database to the cloud introduces network latency (20ms – 50ms) to every cashier barcode scan, order split, and cash drawer kick.
  - **Offline Resilience:** If the café experiences an internet outage, an on-premise database keeps the restaurant operating. A cloud-only database halts in-store operations unless an offline local-first sync hub is maintained.
- **Recommended Strategy (Two-Tier Hybrid Architecture):**
  - **Phase A (Current & Customer Launch):** Keep the core database in Supabase (in the AWS Mumbai `ap-south-1` region for minimal India latency).
  - **Connection Pooling:** Use Supabase's **Supavisor Transaction Pooler (port 6543)** for the cloud NestJS backend and customer website, reserving direct port 5432 for schema migrations.
  - **LAN Fallback:** Maintain the existing `sync` module (`apps/backend/src/sync/`) in the repository, allowing local POS cash registers to queue transactions locally and sync upward when network connectivity is restored.
- **Stakeholder Decision Needed:** Approval of cloud-primary database migration vs. keeping an on-premise local sync node for POS terminals.

---

### Decision 5: Kitchen Ticket (KOT) & Thermal Receipt Printing from Cloud Orders
- **Context:** The existing backend uses kernel device drivers (`/dev/usb/lp0` and `usbfs`) on the local server to print kitchen orders to physical 80mm thermal printers via ESC/POS commands.
- **Problem:** When the NestJS backend moves to a cloud host (AWS/Railway), the cloud container cannot physically see the café's local USB printer nodes.
- **Options:**
  - **Option 1 (Recommended): KDS First (Paperless Kitchen):** Kitchen stations run the existing web KDS interface (`/kds`) on Android tablets or wall monitors. New online orders from `lecuppers.com` appear in real-time on KDS screens via Socket.IO push. No local printer driver needed.
  - **Option 2: Network TCP Thermal Printers:** Replace or configure thermal printers with Ethernet/Wi-Fi static IPs and run a lightweight local print daemon (scripts already exist in `windows/` and `scripts/`) to bridge cloud print jobs.
- **Stakeholder Decision Needed:** Confirmation of whether kitchen stations rely exclusively on digital KDS screens or require physical USB thermal paper prints for cloud orders.

---

### Decision 6: Git Repository & Version Control Initialization
- **Context:** The current workspace is **NOT under Git** (`fatal: not a git repository`).
- **Safety Constraint:** Per project instructions, Git must not be initialized or committed without explicit approval.
- **Recommended Path:** Initialize Git repository locally, create a `.gitignore` excluding `node_modules`, `.next`, `dist`, `.env`, and OS artifacts (`.DS_Store`), and create a clean baseline commit for Phase 1.
- **Stakeholder Decision Needed:** Approval to initialize Git tracking on the repository.

---

## 3. Risk Mitigation Summary Matrix

| Identified Risk | Severity | Impact | Mitigation Strategy |
|---|---|---|---|
| **Accidental Overwrite of POS UI** | Critical | Restaurant staff locked out of POS | Implement customer site in separate `apps/customer-web` package. |
| **Database Schema Corruption** | Critical | Loss of financial / inventory data | All Prisma changes must be strictly additive; no schema drops or resets. |
| **High Latency on Cloud POS** | High | Slow checkout queues in café | Deploy Supabase in Mumbai region (`ap-south-1`) with Supavisor pooler. |
| **Printer Inaccessibility from Cloud** | Medium | Orders not printed in kitchen | Rely on digital KDS screens via Socket.IO; use local bridge daemon for paper. |
| **Play Zone Points Farming** | Medium | Financial loss from free beans | Cap trivia/game points to once per day tied to verified mobile phone. |
| **SMS Cost Overhead** | Low | Operational cost inflation | Implement 60-second OTP cooldown and rate limiting per IP/phone number. |
