# Stitch Design Analysis & Screen Mapping: Le Cuppers

**Project Name:** Le Cuppers Web Experience  
**Stitch Project Resource:** `projects/14193457308377052654`  
**Design Theme:** Artisanal Hospitality  
**Primary Brand Aesthetic:** Editorial Culinary Journal & Tactile Specialty Roastery  

---

## 1. Design System & Theme Foundations

### 1.1 Brand Philosophy & Tone
- **Cultivated & Artisanal:** Grounded in botanical forest greens, warm paper-ivory clay tones, and warm walnut timber accents, echoing hand-thrown ceramic ware, linen table runners, and single-origin micro-lots from Karnataka's Western Ghats.
- **Epicurean Clarity:** Uncluttered visual hierarchy prioritizing sensory photography, transparent ingredient provenance, and unambiguous dietary labeling.
- **Effortless Hospitality:** Seamless switching between fast-track in-store Table QR ordering and express takeaway pickup counters.

### 1.2 Core Color Palette (Tokens & Roles)

| Token Name | Hex Code | Semantic Role |
|---|---|---|
| `primary` | `#072519` | Deepest botanical green; primary headlines & high-contrast elements |
| `primary-container` | `#1e3b2e` | Forest Green anchor; primary buttons, badges, active navigation pills |
| `on-primary` | `#ffffff` | Primary button text & icon fills |
| `surface` / `background` | `#fff8f1` / `#f6f2e8` | Warm Ivory canvas; paper-like tactility softening visual fatigue |
| `surface-container-low`| `#f9f3eb` | Secondary background sections, utility subheaders, card wells |
| `surface-container-lowest`| `#ffffff` | Clean ceramic card surfaces, input fields, and elevated drawers |
| `secondary` | `#56624c` / `#727e67` | Sage Olive; subtle metadata, provenance tags, category chips |
| `secondary-container` | `#dae7cb` | Soft sage tint; table identification badges, dietary chips |
| `tertiary-container` | `#5b2600` / `#da7b41` | Burnt Orange; high-heat accent for loyalty club, roasting badges, highlights |
| `on-tertiary-container` | `#e7854a` | Urgency badges, roasting batch counters, bean point callouts |
| `on-surface` | `#1e1b17` / `#13110d` | Deep charcoal ink for body and titles; never optical black `#000000` |
| `on-surface-variant` | `#424844` | Muted body copy, culinary descriptions, secondary form labels |
| `outline` / `outline-variant` | `#727974` / `#c1c8c2`| 1px hairline dividers, search borders, subtle card edges |

### 1.3 Typographic Scale
- **Display & Editorial Headlines:** **EB Garamond**
  - `display`: 56px / Line Height: 64px, Medium 500 (`-0.02em` tracking)
  - `display-mobile`: 38px / Line Height: 44px, Medium 500
  - `headline-lg`: 40px / Line Height: 48px, Medium 500
  - `headline-md`: 28px / Line Height: 34px, SemiBold 600
  - `headline-sm`: 22px / Line Height: 28px, SemiBold 600
  - *Italic usage:* Selected tasting notes (e.g., *Notes of bergamot, orange blossom & stone fruit*).
- **Interface & Functional Controls:** **Plus Jakarta Sans**
  - `title-lg`: 18px / Line Height: 24px, Bold 700 (`-0.01em` tracking)
  - `title-md`: 16px / Line Height: 22px, SemiBold 600
  - `body-lg`: 17px / Line Height: 26px, Regular 400
  - `body-md`: 15px / Line Height: 22px, Regular 400
  - `body-sm`: 13px / Line Height: 18px, Regular 400 (`+0.01em` tracking)
  - `label-lg`: 14px / Line Height: 18px, SemiBold 600 (`+0.02em` tracking)
  - `label-md`: 12px / Line Height: 16px, SemiBold 600 (`+0.04em` tracking)
  - `label-sm`: 10px / Line Height: 14px, Bold 700 (`+0.06em` tracking)
  - **Price Format:** Always Plus Jakarta Sans with tabular figures (`font-variant-numeric: tabular-nums`) prefixed by Indian Rupee symbol (e.g., `₹320.00`).
- **Iconography:** **Google Material Symbols Outlined** (`opsz 20..48`, `wght 100..700`, `FILL 0..1`).

---

## 2. Screen Inspection: Accessed vs. Inferred

### 2.1 Verified Screens in Stitch Project
The Stitch project `14193457308377052654` contains exactly **5 screens** which were fetched and inspected:

| Screen Resource ID | Screen Title | Device Type | Dimensions | Proposed Application Route |
|---|---|---|---|---|
| `cdc0bc85c3fe455e92a970ccc0ab1c5b` | **Le Cuppers — Home** | Desktop | 2560 × 8568 | `/` (Home) |
| `56871d8d48e146b295d722014dbfbe07` | **Le Cuppers — Mobile Home** | Mobile | 780 × 4572 | `/` (Mobile Viewport) |
| `1e0e85d091864f4d978333480d0e1b82` | **Le Cuppers — Menu Discovery** | Desktop | 2560 × 4918 | `/menu` |
| `a9e0f888e5a940b19b164e2dea5feaac` | **Le Cuppers — Mobile Menu Discovery** | Mobile | 780 × 3952 | `/menu` (Mobile Viewport) |
| `405a6048736a4182bdbf01dae344b44c` | **Le Cuppers — Product Detail & Cart** | Desktop | 2560 × 4054 | `/menu/[slug]` & `/cart` |

### 2.2 Missing / Inferred Screens (Explicitly Reported)
As required by safety rules, we explicitly report that the following requested screens **do not exist as standalone mockups in Stitch** and must be built following the Artisanal Hospitality design system:

1. **Dedicated Multi-Step Checkout Screen (`/checkout`):**
   - *Status in Stitch:* Not present as a standalone screen. The desktop cart panel on Screen 5 ends with a "Proceed to Checkout" button (`₹682.50` total).
   - *Inferred Architecture:* A dedicated `/checkout` route handling customer contact details, delivery address / table confirmation, tip selector, and payment gateway integration (Razorpay / UPI).
2. **Customer Account & Authentication Screen (`/account`, `/account/login`):**
   - *Status in Stitch:* Not present. Screen 1 has a header pill (`140 pts • Artisan Club`), and mobile screens have an `Account` bottom navigation tab.
   - *Inferred Architecture:* Customer phone/OTP login, active orders tracking, saved addresses, and loyalty balance.
3. **Le Cuppers Play Zone Screen (`/play-zone`):**
   - *Status in Stitch:* Teased in Mobile Home Section 2 ("Brews take 6 minutes. Challenge your palate. Play Roaster’s Trivia or Memory Match. Score high to win +30 Bean Points") and present as a bottom tab item, but no interactive game screen was designed.
   - *Inferred Architecture:* Mini-games module containing Roaster's Trivia (3 coffee knowledge questions) and Memory Match (card pair matching against timer).
4. **Terroir Journal & News (`/our-story`, `/journal`):**
   - *Status in Stitch:* Teased via Section 4 on Home ("From Soil to Ceramic: The Sanctuary of Slow Coffee") and footer newsletter/journal links, but no standalone newsfeed exists.
   - *Inferred Architecture:* A blog/story section featuring harvest chronicles, estate profiles, and brewing guides.

---

## 3. Comprehensive Screen-by-Screen Breakdown

### 3.1 Screen 1: Desktop Home (`/`)
- **Header Navigation (Sticky):**
  - Wordmark Logo (`Le Cuppers`) in EB Garamond.
  - Links: `Home` (active pill), `Menu`, `Our Story`, `Offers`, `Visit Us`.
  - Service Context: `Dine-in: Table 04` pill badge.
  - Interactive Actions: Search icon modal, Customer Avatar with `140 pts • Artisan Club`, Mini-Cart trigger (`2 • ₹640`), and Primary `Order Now` pill button.
- **Section 1: Hero & Table Commerce Toggle:**
  - Micro-tag: `EST. SPECIALTY ROASTERY & CAFÉ`.
  - Headline: *"Crafted with Intention, Poured with Reverence."*
  - Dual CTAs: `Explore Menu` (Forest Green pill) and `Order Now` (Burnt Orange pill).
  - Metric Accent Bar: `1,820m Elevation Harvest`, `88.5+ Q-Grader Score`, `72 hrs Lamination Rest`.
  - Cinematic Visual: Porcelain cup with latte art on reclaimed oak, floating origin card (`Attikan Estate Micro-Lot`), and animated `Roasting Today: Batch #104` badge.
  - Service Mode Switcher: Pill bar toggling between `Table QR Dine-in (Table #04)` and `Express Takeaway & Pickup` with dynamic wait estimate (`8 – 12 mins`).
- **Section 2: Category Filter Strip:**
  - Horizontally scrollable pill buttons: `All Offerings`, `Specialty Espresso & Pour-overs`, `Signature Cold Brews`, `Artisanal Viennoiserie`, `Sourdough Tartines & Plates`, `Handcrafted Desserts`.
  - Seasonality indicator tag.
- **Section 3: Signature & Seasonal Creations (4-Column Grid):**
  - Item 1: *Iced Cardamom Fig Cold Brew* (`₹320`, Steeped 20h, Veg).
  - Item 2: *Smoked Wild Mushroom Tartine* (`₹460`, 36-hr Ferment, Veg).
  - Item 3: *Vanilla Sea Salt Croissant* (`₹280`, AOP French Butter, Veg).
  - Item 4: *Orange Blossom Cortado* (`₹290`, Coorg Estate Washed, Vegan).
  - Each card features: 4:3 photo, dietary stamp, roast tag, origin estate, headline, notes, modifier button (`tune`), and `+ Add` button.
- **Section 4: Editorial Story Block ("From Soil to Ceramic"):**
  - Full-width forest green inverted section (`#072519`).
  - Asymmetric photography showing coffee cupping and pottery kick wheel.
  - Narrative on shade-canopy Karnataka harvests, 6-kilo drum roasting, and custom ceramics.
  - 3 value cards: `Direct Trade (+40% fair market)`, `Heritage Milling`, `Water Chemistry (Remineralized RO)`.
- **Section 5: Seasonal Offers & Loyalty Glimpse:**
  - Card A (Burnt Orange): *Morning Rituals Club* — "Earn 10 roast beans per ₹100 spent", balance widget showing `140 Beans / Next Reward at 200 (70%)`, button `Check My Rewards`.
  - Card B: *The Western Ghats Trio* — weekend single-estate tasting flight (`₹520`).
- **Section 6: Physical Atelier & Operating Rhythm:**
  - Address: *14 Lavelle Road, Richmond Park, Bengaluru, Karnataka 560001*.
  - Hours: *Monday – Sunday: 8:00 AM – 11:00 PM (Kitchen closes 10:15 PM)*.
  - Actions: `Get Directions` and `Book Cupping Table`.
- **Footer:**
  - Newsletter subscription form (`Editorial Roastery Gazette`).
  - Links: Epistolary & Craft, Atelier Hospitality, Legal & Regulatory (FSSAI, GSTIN, Terms, Privacy).

### 3.2 Screen 2: Mobile Home (`/` mobile viewport)
- **Compact Header:**
  - Mini wordmark, active table dropdown badge (`T-04`), search icon, and cart icon with count badge `2`.
- **Service Mode Bar:**
  - Live pulse indicator: `Table #04 Active • 2 Items in queue` with toggle button `To Takeaway`.
- **Mobile Hero:**
  - Micro-tag `Attikan Estate Micro-Lot #12`.
  - Scaled headline in `EB Garamond` (`38px`).
  - Dual full-width action buttons: `Explore Menu` and `Order Table #04`.
- **Play Zone Teaser Banner:**
  - High-impact forest green container with game console icon: *"Brews take 6 minutes. Challenge your palate. Play Roaster’s Trivia or Memory Match. Score high to win +30 Bean Points toward artisanal pours."*
  - CTA button: `Enter Lounge`.
- **Curated Seasonal Scroll (Horizontal Swipe):**
  - Horizontal swipeable cards (240px wide) with snap scrolling.
  - Live `Add` buttons with micro-animations.
- **Rituals Membership Progress Widget:**
  - `Morning Rituals Club`, Tier: *Fellow Cupper*, current beans: `140`, progress bar, `60 beans until your next Single Origin Pour-over`.
- **Physical Roastery Card:**
  - Atelier location, hours, `Get Directions` and `Concierge` call trigger.
- **Mobile Bottom Navigation Bar (Fixed):**
  - 5-tab bar with safe-area padding:
    1. `Home` (icon: `home`)
    2. `Menu` (icon: `restaurant_menu`)
    3. `Play Zone` (pill badge with pulsing indicator, icon: `sports_esports`)
    4. `Orders` (icon: `receipt_long`)
    5. `Account` (icon: `person`)

### 3.3 Screen 3: Desktop Menu Discovery (`/menu`)
- **Top Utility Context Bar:**
  - `Ordering for Table 04 • Dine-in Active`, switch to takeaway button, prep time estimate (`~12-16 mins`), roastery batch details (`#942 Coorg Estate`).
- **Editorial Section Header:**
  - Vol. 08 Header: *"The Seasonal Menu — Single-origin coffees, handcrafted slow extractions, and seasonal kitchen provisions."*
  - Integrated pill search bar with real-time text matching and clear button.
- **Dietary Filter Strip:**
  - Filter pills: `Vegetarian` (green dot), `Vegan` (eco leaf), `Gluten-Free` (grain icon), `Chef's Signature` (star icon).
- **Two-Column Master-Detail Layout:**
  - **Left Area (8 Columns):** Catalog grid of responsive menu item cards:
    - *Valparai Estate Pour Over* (`₹290`)
    - *Spanish Latte* (`₹310`)
    - *Avocado & Confit Tomato Toast* (`₹420`)
    - *Almond Frangipane Croissant* (`₹260`)
    - *Cascara Hibiscus Fizz* (`₹280`)
    - *Slow Braised Chicken Brioche* (`₹460`)
  - **Right Area (4 Columns - Sticky Rail):**
    - Live Table Order Ticket Card (`Table 04 • Service Ticket`, 2 items).
    - Itemized cart line items with inline quantity steppers (`-`, `+`) and `Remove`.
    - Real-time subtotal, GST calculation (5%), and total.
    - Loyalty earning callout: `+68 Beans`.
    - CTA button: `Proceed to Checkout` (`₹682.50`).

### 3.4 Screen 4: Mobile Menu Discovery (`/menu` mobile viewport)
- **Sticky Sub-Header:**
  - Table context pill and wait time badge.
  - Mobile search bar with sensory notes filter trigger (`tune`).
- **Horizontal Scroll Category & Dietary Bars:**
  - Category buttons: `All Offerings`, `Pour Overs & Espresso`, `Cold Brews`, `Artisanal Viennoiserie`, `Sourdough Tartines`, `Play & Quiz Treats`.
  - Filter chips with toggle active state.
- **Single-Column Product Stream:**
  - Cards with 192px image height, dietary markers, single origin badges, price, and dual buttons: `Tune Roast` / `Gluten-Free?` (opens customizer) and `+ Add` (instant add to tray).
- **Interactive Customization Bottom Sheet:**
  - Slide-up bottom sheet with backdrop blur.
  - Dripper selection: `V60 Clarity`, `Kalita Wave`, `Aeropress`.
  - Dairy / Plant bases: `Standard (Whole)` (Free), `Oat Mylk` (+₹45).
  - Barista note input field.
  - Sticky bottom button: `Add with Preferences • ₹290`.
- **Persistent Floating Bottom Cart Pill:**
  - Floats above bottom navigation: Cart icon with bubble `2`, `2 Items in Tray`, `₹640 total`, and `View Order` button.

### 3.5 Screen 5: Desktop Product Detail & Cart (`/menu/[slug]`)
- **Left Column (7-8 Columns): Product Customization Engine:**
  - Large square photographic hero with pure veg stamp and atelier tag.
  - Heading: *Spanish Latte with Sweet Condensed Milk*.
  - Allergen guidance warning callout box.
  - **Modifier 1: Milk Foundation (Required Single Select):**
    - `Farm Whole Milk` (Standard • Included)
    - `Oatly Barista` (+₹60.00)
    - `Almond Milk` (+₹50.00)
  - **Modifier 2: Temperature & Serving Style (Required Single Select):**
    - `Hot (Velvety Steam, 65°C)` in stoneware ceramic (Included)
    - `Iced Over Crystal Cubes` in chilled double-wall glass (+₹20.00)
  - **Modifier 3: Flavor Enhancements & Roastery Shots (Optional Multi-Select):**
    - `Ceylon Cinnamon Dusting` (Complementary)
    - `Extra Double Shot Espresso` (+₹80.00)
    - `Organic Madagascan Vanilla Bean` (+₹40.00)
  - **Special Atelier Instructions:** Textarea for barista culinary notes.
  - **Quantity Counter & Dynamic Price CTA:**
    - Stepper: `-`, `1`, `+`
    - Pill Button: `Add to Order • ₹310.00` (dynamically recalculating based on selected modifier deltas).
- **Right Column (4-5 Columns): Synchronized Dine-In Order Folio:**
  - Folio header: *Dine-In • Table 04* (2 items in tray).
  - Itemized rows with selected modifiers listed.
  - Loyalty callout: *Artisan Harvest Club: You will earn +68 Le Cuppers Beans on this order*.
  - Pricing Breakdown:
    - Item Subtotal: `₹650.00`
    - Restaurant GST (5%): `₹32.50`
    - Packaging & Hospitality Fee: `₹0.00 (Dine-in Waiver)`
    - Total Estimated: `₹682.50`
  - Dual CTAs: `Proceed to Checkout` (primary) and `Continue Browsing Menu` (secondary).
  - Recommended Pairings Widget: *Cardamom Pistachio Financier (+₹180)* with quick-add button.

---

## 4. Reusable Component Inventory

To ensure maintainability and high design fidelity, the customer web platform will be built from the following reusable component hierarchy:

```text
apps/customer-web/components/
├── layout/
│   ├── header-nav.tsx             # Desktop sticky header with loyalty badge & cart button
│   ├── mobile-header.tsx          # Mobile header with table pill & search trigger
│   ├── mobile-bottom-nav.tsx      # 5-tab fixed bottom navigation with badge indicators
│   ├── footer.tsx                 # Gazette subscription, brand story links, legal compliance
│   └── service-mode-bar.tsx       # Dining mode switcher (Table Dine-In vs. Express Takeaway)
├── menu/
│   ├── menu-catalog.tsx           # Category section controller & item filters
│   ├── category-pill-strip.tsx    # Horizontal scrollable category navigation
│   ├── dietary-badge.tsx          # Pure Veg, Non-Veg, Vegan, Gluten-Free iconography
│   ├── menu-item-card.tsx         # Editorial 4:3 product card with quick-add & tune actions
│   └── customizer-drawer.tsx      # Slide-out modal / bottom sheet for modifier choices
├── cart/
│   ├── order-folio-rail.tsx       # Desktop sticky order sidebar
│   ├── cart-item-row.tsx          # Line item row with modifier breakdown & quantity stepper
│   ├── price-summary.tsx          # Subtotal, GST, packaging fee, and total hierarchy
│   ├── loyalty-reward-callout.tsx # Points to be earned on active order
│   └── floating-cart-tray.tsx     # Mobile floating pill bar above bottom nav
├── loyalty/
│   ├── loyalty-card.tsx           # Morning Rituals Guild tier card & bean progress bar
│   └── rewards-carousel.tsx       # Redeemable pour-over flights & pastry rewards
├── games/
│   ├── play-zone-teaser.tsx       # Banner prompting trivia while waiting for barista
│   ├── roasters-trivia.tsx        # 3-question coffee knowledge challenge
│   └── memory-match.tsx           # 8-card coffee varietal card match game
└── ui/                            # Atomic primitives
    ├── button.tsx                 # Forest Green primary, Burnt Orange accent, Ivory ghost
    ├── pill-button.tsx            # Full rounded capsule buttons
    ├── quantity-stepper.tsx       # Circular decrement/increment capsule with tabular count
    └── search-input.tsx           # Pill-shaped search bar with clear button
```
