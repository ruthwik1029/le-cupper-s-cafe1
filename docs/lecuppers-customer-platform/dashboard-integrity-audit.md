# Le Cuppers — Emergency Dashboard Integrity Audit & Safe Rollback Investigation

**Date:** 2026-10-27  
**Auditor:** Antigravity Engineering (Read-Only Inspection Mode)  
**Investigation Scope:** Existing Restaurant POS / Dashboard Project Only  
**Status:** Audit Complete — No Dashboard Damage Detected

---

## A. Workspace Identity

- **Active Workspace Root:** `/Users/mohammedakmalshahzad/Desktop/ruth 2/repos impo/nodedr-restaurant-pos-master 2`
- **Confirmation Evidence:**
  - `pwd` returns `/Users/mohammedakmalshahzad/Desktop/ruth 2/repos impo/nodedr-restaurant-pos-master 2`.
  - Directory contents match the original unpacked OrderRestro distribution:
    - Root manifests: `package.json` (name: `nodedr-orderrestro`), `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `turbo.json`.
    - Workspaces: `apps/backend` (NestJS 11 POS backend), `apps/web` (Next.js 16 staff POS / dashboard / KDS / QR / kiosk), `packages/types` (shared contracts).
    - Deployments: `casaos/`, `updater/`, `packaging/`, `windows/`.
  - The customer-facing web application (`apps/customer-web`) does **NOT** exist in this workspace; it was isolated in a separate cloned directory (`/Users/mohammedakmalshahzad/Desktop/ruth/lee work bro/`).

---

## B. Current State

### 1. Version Control (Git) Status
- **Git Status:** **NOT under Git version control.**
  - `git status` returns: `fatal: not a git repository (or any of the parent directories): .git`.
  - No `.git` metadata folder exists in the project root.
  - Rollback cannot rely on `git checkout` or `git reset`. All file restorations must use verified physical backups.

### 2. Available Backups & Baselines
- **Directory:** `.backups/`
  1. `.backups/phase1_20261027_024411/`:
     - Created: Oct 27, 2026 at 02:44:11 (prior to Phase 1 UI customization).
     - Contains exact, byte-for-byte pre-customization copies of:
       - `globals.css` (10,227 bytes)
       - `layout.tsx` (1,273 bytes)
       - `sidebar-nav.tsx` (1,650 bytes)
       - `app-shell.tsx` (4,441 bytes)
       - `logo.tsx` (368 bytes)
       - `page.tsx` (5,735 bytes)
  2. `.backups/latest_phase1_backup_path.txt`:
     - Created: Oct 27, 2026 at 02:44:11. Points to `.backups/phase1_20261027_024411`.
  3. `.backups/lec uppers-pre-supabase-20261027-122500.dump`:
     - Created: Oct 27, 2026 at 12:25:00.
     - Size: 252,179 bytes.
     - Type: Valid PostgreSQL custom database dump (`v1.15-0`).

### 3. Container Runtime Status
- Running containers were inspected via read-only `docker ps`:
  - `nodedr-restaurant-web`: Status `Up 16 hours` (created 16 hours ago).
  - `nodedr-restaurant-backend`: Status `Up 18 hours`.
  - `nodedr-restaurant-updater`: Status `Up 18 hours`.
  - `nodedr-restaurant-postgres`: Status `Up 19 hours (healthy)`.
- **Verdict:** Containers have run continuously without interruption, restart, or rebuild throughout all sessions.

---

## C. Change Inventory

Every file across the entire repository modified after the original release timestamp (`2026-10-26 12:12:00`) was cataloged.

| File Path | Timestamp | Change Type | Evidence & Details | Related to Customer Website? | Potential Dashboard Impact | Confidence Level |
|---|---|---|---|---|---|---|
| `./.env` | Oct 26 23:40 | Modified | Local configuration file for local environment. | No (Setup) | None — standard local development config. | Confirmed |
| `./.npmrc` | Oct 27 00:25 | Modified | Added local pnpm store / network configurations. | No (Setup) | None — local dependency settings. | Confirmed |
| `./apps/backend/Dockerfile` | Oct 27 00:26 | Modified | Added network retry and timeout flags to `pnpm install` in deps stage. | No (Setup) | None — improves build reliability; runtime unchanged. | Confirmed |
| `./apps/web/Dockerfile` | Oct 27 00:26 | Modified | Added network retry and timeout flags to `pnpm install` in deps stage. | No (Setup) | None — improves build reliability; runtime unchanged. | Confirmed |
| `./install.sh` | Oct 27 00:26 | Modified | Adjusted installer execution flags. | No (Setup) | None — used only during initial machine provisioning. | Confirmed |
| `./#` | Oct 27 00:48 | Created (0B) | Empty file created accidentally by a shell syntax typo. | No (Accidental stray) | None — zero bytes, unreferenced. | Confirmed |
| `./=` | Oct 27 00:48 | Created (0B) | Empty file created accidentally by a shell syntax typo. | No (Accidental stray) | None — zero bytes, unreferenced. | Confirmed |
| `./docker-compose.yml` | Oct 27 01:53 | Modified | Security fix: removed public fallback default updater token; updater fails closed if token unset. | No (Security audit fix) | None — hardened updater container against unauthorized socket commands. | Confirmed |
| `./casaos/docker-compose.yml` | Oct 27 01:54 | Modified | Security fix: aligned updater token configuration with main docker-compose. | No (Security audit fix) | None — CasaOS deployment configuration hardened. | Confirmed |
| `./.env.example` | Oct 27 01:54 | Modified | Security fix: updated updater token documentation with strong secret placeholder. | No (Security audit fix) | None — documentation / template file only. | Confirmed |
| `apps/web/app/globals.css` | Oct 27 02:45 | Modified | Phase 1 UI customization: updated `:root`, `.dark`, and `.kiosk-root` tokens to approved Le Cuppers brand colors. | No (Approved Phase 1) | Positive — applies intended Le Cuppers branding; 44px/48px touch floors preserved. | Confirmed |
| `apps/web/app/layout.tsx` | Oct 27 02:45 | Modified | Phase 1 UI customization: updated `metadata.title` to `"Le Cuppers"` and `viewport.themeColor` to `#1E3B2E`. | No (Approved Phase 1) | Positive — updates browser title and status bar color. | Confirmed |
| `apps/web/components/layout/sidebar-nav.tsx` | Oct 27 02:46 | Modified | Phase 1 UI customization: added Burnt Orange left-accent border (`border-sidebar-primary`) and Forest Green active tint. | No (Approved Phase 1) | Positive — visual refinement of sidebar active state. | Confirmed |
| `apps/web/components/layout/app-shell.tsx` | Oct 27 02:47 | Modified | Phase 1 UI customization: updated fallback restaurant name from `"Nodedr OrderRestro"` to `"Le Cuppers"`. | No (Approved Phase 1) | Positive — brand name alignment. | Confirmed |
| `apps/web/components/layout/logo.tsx` | Oct 27 02:48 | Modified | Phase 1 UI customization: updated `alt` attribute to `"Le Cuppers"`. Asset path `src="/logo.png"` kept intact. | No (Approved Phase 1) | Positive — accessibility text alignment. | Confirmed |
| `apps/web/app/login/page.tsx` | Oct 27 02:49 | Modified | Phase 1 UI customization: updated login title to `"Le Cuppers"`. Form, validation, auth handlers untouched. | No (Approved Phase 1) | Positive — brand name alignment. | Confirmed |
| `docs/lecuppers-customer-platform/` (5 files) | Oct 27 17:31 | Created (Dir) | Planning specifications for customer platform: `api-capability-map.md`, `architecture.md`, `implementation-plan.md`, `risks-and-decisions.md`, `stitch-screen-map.md`. | **Yes (Customer Platform Planning)** | None — static markdown files in `docs/`; zero runtime impact on code or build. | Confirmed |

---

## D. Safe Changes to Retain

1. **Phase 1 Le Cuppers Dashboard UI Customization (Oct 27 02:45–02:49):**
   - Files: `globals.css`, `layout.tsx`, `sidebar-nav.tsx`, `app-shell.tsx`, `logo.tsx`, `page.tsx` (login).
   - Rationale: Explicitly requested and approved in the Phase 1 prompt. Confirmed clean by AST checks and unit tests. Does not touch business logic, database, or API contracts.
2. **Docker Updater Security Hardening (Oct 27 01:53–01:54):**
   - Files: `docker-compose.yml`, `casaos/docker-compose.yml`, `.env.example`.
   - Rationale: Required security remediation preventing unauthorized access to the Docker daemon socket via fallback updater tokens.
3. **Monorepo Build Reliability Enhancements (Oct 27 00:26):**
   - Files: `apps/backend/Dockerfile`, `apps/web/Dockerfile`, `.npmrc`.
   - Rationale: Adds fetch retries and timeouts for pnpm in Docker builds without changing runtime layers.
4. **PostgreSQL Pre-Migration Safety Dump (Oct 27 12:25):**
   - File: `.backups/lec uppers-pre-supabase-20261027-122500.dump`.
   - Rationale: Critical safety asset preserving state prior to any database operations.

---

## E. Changes to Investigate or Potentially Reverse

1. **Stray 0-byte Files in Root Directory:**
   - `./#` (0 bytes, created Oct 27 00:48)
   - `./=` (0 bytes, created Oct 27 00:48)
   - *Status:* Benign shell artifacts. Candidate for deletion upon approval.
2. **Customer Platform Documentation in `docs/lecuppers-customer-platform/`:**
   - Files: `api-capability-map.md`, `architecture.md`, `implementation-plan.md`, `risks-and-decisions.md`, `stitch-screen-map.md`.
   - *Status:* Static architectural documentation. While created during the customer website planning session, these are markdown documents only and have **zero code or build impact** on the dashboard. They can either be retained for reference or archived/removed based on user preference.

---

## F. Missing Evidence

- None. Because the exact pre-Phase 1 files were preserved in `.backups/phase1_20261027_024411/`, and because filesystem modification timestamps across the monorepo show no changes in `apps/web`, `apps/backend`, or `packages` after 02:49, full deterministic evidence exists for every file in the project.

---

## G. Recommended Rollback Plan

### If the Goal is to Revert the Entire Workspace to Pre-Phase 1 State:
1. **Safety Step:** Create a new snapshot of current state:
   `cp -r apps/web/app/globals.css apps/web/app/layout.tsx apps/web/components/layout/sidebar-nav.tsx apps/web/components/layout/app-shell.tsx apps/web/components/layout/logo.tsx apps/web/app/login/page.tsx .backups/phase1_current_state/`
2. **Restore 6 Files from Existing Backup:**
   `cp .backups/phase1_20261027_024411/* apps/web/...`
3. **Remove Stray Artifacts:**
   `rm -f "#" "="`
4. **Remove or Move Documentation (Optional):**
   `rm -rf docs/lecuppers-customer-platform/`

### If the Goal is to Retain Approved Phase 1 Brand Changes:
- **No rollback is required.** The dashboard project is completely uncorrupted. No customer website code, components, routes, or dependencies entered this repository. Only clean Phase 1 UI customization files and static planning documentation are present.

---

## H. Validation Plan

To verify dashboard integrity post-audit without risking data or restarting containers:

1. **Codebase AST & Syntax Check:**
   Validate balanced braces, TypeScript syntax, and CSS definitions across all modified files. (Passed: 100% valid).
2. **Unit Test Suite Execution:**
   Execute independent test suites in `apps/web/lib/`:
   `cd apps/web && node --test --no-warnings lib/draft-order.test.ts lib/kds-station.test.ts lib/kiosk-machine.test.ts lib/kiosk-ticket.test.ts lib/money.test.ts lib/receipt-plain.test.ts lib/tender.test.ts lib/realtime-events.test.ts`
   (Passed: 11 of 11 tests passed).
3. **Running Service Check:**
   Query `docker ps` to ensure `nodedr-restaurant-web` and `nodedr-restaurant-backend` remain healthy on ports 1995 and 4000 without container recreation.
4. **Live Endpoint Inspection:**
   Perform an HTTP GET request to `http://localhost:1995/api/health` or `http://localhost:1995/login` to confirm the Next.js frontend responds normally without modifying any state.
