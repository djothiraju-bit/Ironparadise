# IP FITNESS — Single-Gym Mobile Management Application

A complete, production-ready single-gym mobile management system for **IP FITNESS** ("TRAIN HARD. STAY CONSISTENT."). Built with a high-fidelity mobile-first interface featuring an interactive mobile simulator frame (with iOS/Android toggle and full-screen preview), a robust server-side Express backend with persistent JSON/SQLite data storage, Razorpay test payment integration with digital receipt generation, and clear distribution guides for React Native / Expo Android APK/AAB builds.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Key Architecture & Execution Choices**:
> - **Mobile Experience & Dual-Mode Shell**: To satisfy the dual requirements of testing live in this web workspace and delivering a true mobile application, the app will run an interactive smartphone simulator frame (featuring realistic device bezel, status bar, notch, and switchable iOS / Android chrome) alongside a seamless toggle to expand to a full-viewport responsive layout.
> - **Native Code Export**: In addition to the fully functional live mobile web application, we provide the complete React Native / Expo project structure, configuration files (`app.json`, `eas.json`), and step-by-step instructions to compile Android APK/AAB and iOS builds via Expo Application Services (EAS).
> - **Persistent Backend & Payments**: A dedicated Express server (`/api/*`) runs alongside Vite, persisting gym data (members, plans, attendance, payments, announcements, gym config) to a server-side database. Razorpay order creation and HMAC-SHA256 signature verification run securely on the server with both test-mode sandbox support and realistic offline/cash/UPI recording for the gym owner.

- **Confirmed Decision 1**: Interactive mobile device simulator with iOS/Android toggle and full-screen switch to test member and admin workflows directly.
- **Confirmed Decision 2**: Secure Razorpay INR payment processing on backend with digital PDF/HTML receipts and transaction history.
- **Confirmed Decision 3**: Digital Member QR Pass with Admin Scanner & manual attendance logging for zero-friction check-ins.

---

### 1. Overview & Core Concept

- **What It Does**: IP FITNESS is an end-to-end gym management application dedicated to a single gym location. It provides two tailored interfaces:
  1. **Member App**: Welcome dashboard, digital membership card with live status (Active / Expiring Soon / Expired), plan details, joining and expiry dates, online fee payment in INR with digital receipts, attendance history calendar, live Gym Open/Closed status, gym timings, interactive Google Maps directions, announcements, and direct WhatsApp/Phone gym contact.
  2. **Admin Dashboard**: Executive KPI overview (Total Members, Active, Expired, Pending Dues, Monthly/Yearly Revenue), member registry (add, edit, search, filter, deactivate), flexible plan management (Monthly, Quarterly, Half-Yearly, Yearly with custom pricing), payment recording (Cash, UPI, Online Razorpay) with verification and receipt issuing, daily check-in scanner and attendance ledger, live gym open/closed toggle with custom operating hours and emergency notices, and downloadable CSV/printable financial and member reports.
- **Target Audience / Persona**:
  - *Gym Owner & Front-Desk Staff*: Streamlined front-desk operations, fee collection tracking, attendance logging, and member communication without paper registers.
  - *Gym Members*: Athletes and fitness enthusiasts who want frictionless fee renewals, quick QR check-ins, up-to-the-minute gym status, and clear payment receipts.
- **Key Value**: Eliminates manual recordkeeping, prevents revenue leakage from expired memberships, and offers members a premium mobile experience matching modern fitness club standards.

---

### 2. User Experience & Visual Design

#### Visual Identity & Theme
- **Color System (60-30-10 Rule)**:
  - **60% Canvas**: Deep matte black (`#101010` and `#0A0A0A`) providing an energetic, focused athletic atmosphere.
  - **30% Structural Surfaces**: Dark charcoal cards (`#18181B` / `bg-zinc-900`) with subtle 1px hairline borders (`border-zinc-800`), avoiding nested boxes and heavy shadows.
  - **10% Neon Accent**: High-voltage neon lime green (`#B7F34A` / `rgb(183, 243, 74)`) reserved for primary action buttons, active tab indicators, status badges, and key metric emphasis.
  - **Typography**: Clean athletic sans (`Plus Jakarta Sans` / `Outfit` / system neo-grotesque) with tabular figures (`tabular-nums`) for currency, dates, and member IDs.
- **Splash Screen**:
  - Dramatic animated reveal with the **IP FITNESS** geometric shield logo, neon accent pulse, and tagline: *"TRAIN HARD. STAY CONSISTENT."* Smooth transition into Member or Admin login with demo quick-switch buttons for instant testing.

#### Key User Flows & Screen List

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                           IP FITNESS APP NAVIGATION                           │
├───────────────────────────────────────┬───────────────────────────────────────┤
│             MEMBER FLOWS              │              ADMIN FLOWS              │
├───────────────────────────────────────┼───────────────────────────────────────┤
│ 1. Splash Screen & Role Selection     │ 1. Admin Authentication               │
│ 2. Member Login / Self-Registration   │ 2. Operations Overview & KPI Cards    │
│ 3. Member Home Dashboard              │ 3. Member Directory (Search & CRUD)   │
│    - Membership Status Badge          │ 4. Membership Plans Configurator      │
│    - Quick Digital QR Pass            │ 5. Payment Ledger & Cash/UPI Entry    │
│    - Live Open/Closed Gym Banner      │ 6. QR Check-In Scanner & History      │
│ 4. Fee Payment & Razorpay Checkout    │ 7. Gym Settings & Operating Hours     │
│ 5. Payment Receipts & History         │ 8. Announcements & Broadcast Notice   │
│ 6. Attendance Log & Calendar          │ 9. Financial & Member Export Reports  │
│ 7. Gym Info, Timings & Directions     │                                       │
└───────────────────────────────────────┴───────────────────────────────────────┘
```

#### Ergonomics & Mobile Details
- **Fixed Bottom Tab Bar**: 4-tab thumb navigation for members (`Home`, `Pass`, `Payments`, `Gym Info`) and admin navigation drawer/tabs (`Overview`, `Members`, `Finances`, `Attendance`, `Settings`).
- **Touch Targets**: All interactive elements are minimum $44 \times 44\text{px}$ ($48\text{px}$ for checkout and check-in buttons).
- **Zero-Pill Metadata**: Dates, categories, and amounts formatted as clean unboxed text with typographic separators (`·`).

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full-Stack Express Server with File-Backed Storage**
  - *Chosen Approach*: Implement an Express backend running alongside Vite (`server.ts` launched with `tsx`), serving `/api/*` endpoints with a robust file-backed JSON database store (`data/gym-db.json`) initialized with realistic seeds.
  - *Why*: Provides guaranteed cross-session persistence, strict server-side password verification, server-side Razorpay order generation and HMAC signature verification, without external cloud dependencies or risk of database outage.
  - *Alternatives Considered*: Client-only `localStorage` (fails the requirement "Do not create only a website or static prototype; use secure backend").
- **Decision 2: Realistic Razorpay Integration with Dual-Mode Checkout**
  - *Chosen Approach*: Full server-backed Razorpay payment lifecycle. If live test keys (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`) are provided in `.env`, the server calls the Razorpay API; if not provided or in sandbox demo mode, the server uses a built-in sandbox simulator that generates real Razorpay order IDs (`order_test_...`), verifies standard signatures, updates member expiry dates accurately, and generates printable digital invoices.
  - *Why*: Guarantees every payment flow works immediately out-of-the-box without forcing the user to supply secret keys before testing, while strictly adhering to real signature verification logic.
- **Decision 3: Device Frame Simulator with Fullscreen Toggle**
  - *Chosen Approach*: Wrap the mobile UI inside an iPhone 16 Pro / Android Pixel bezel with device toggles, status bar time, battery icon, and an option to switch to responsive full-screen web mode.
  - *Why*: Allows realistic mobile UX testing in the browser workspace while fulfilling the prompt's request for an authentic mobile app experience.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SYSTEM ARCHITECTURE                               │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                            CLIENT LAYER                               │  │
│  │                                                                       │  │
│  │   ┌───────────────────────────────────────────────────────────────┐   │  │
│  │   │ Mobile Device Shell (Device Frame / Status Bar / OS Switcher) │   │  │
│  │   └───────────────────────────────┬───────────────────────────────┘   │  │
│  │                                   │                                   │  │
│  │          ┌────────────────────────┴────────────────────────┐          │  │
│  │          ▼                                                 ▼          │  │
│  │  ┌─────────────────────────┐               ┌────────────────────────┐ │  │
│  │  │    MEMBER INTERFACE     │               │    ADMIN INTERFACE     │ │  │
│  │  │  - Dashboard & QR Pass  │               │  - KPI Overview        │ │  │
│  │  │  - Fee Payment (INR)    │               │  - Member Directory    │ │  │
│  │  │  - Attendance Log       │               │  - Payment Verification│ │  │
│  │  │  - Gym Status & Info    │               │  - Scanner & Reports   │ │  │
│  │  └───────────┬─────────────┘               └───────────┬────────────┘ │  │
│  │              │                                         │              │  │
│  └──────────────┼─────────────────────────────────────────┼──────────────┘  │
│                 │          HTTP REST API (/api/*)         │                 │
│  ┌──────────────▼─────────────────────────────────────────▼──────────────┐  │
│  │                           BACKEND SERVER                              │  │
│  │                                                                       │  │
│  │   Express 4 Server (server.ts) on Port 3000                           │  │
│  │   ├── Auth Controller (JWT/Session tokens, Admin & Member roles)     │  │
│  │   ├── Members & Plans Controller (CRUD, Expiry calculation)          │  │
│  │   ├── Payment & Razorpay Controller (Orders, Signature verification)  │  │
│  │   ├── Attendance Controller (Check-in logging, Streak counting)       │  │
│  │   └── Gym Operations Controller (Open/Closed status, Timings, Notices)│  │
│  │                                                                       │  │
│  │   ┌───────────────────────────────────────────────────────────────┐   │  │
│  │   │ Persistent Storage Engine (JSON File Database with Atomic I/O)│   │  │
│  │   │ Tables: users, members, plans, payments, attendance, notices  │   │  │
│  │   └───────────────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Database Schema
- **users**: `id`, `email`, `password_hash`, `role` ('admin' | 'member'), `name`, `phone`, `created_at`.
- **members**: `id`, `user_id`, `member_code` (e.g., "IP-1042"), `plan_id`, `status` ('active' | 'expiring_soon' | 'expired' | 'inactive'), `joining_date`, `expiry_date`, `emergency_contact`, `notes`.
- **plans**: `id`, `name` ('Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'), `duration_months`, `fee_inr`, `description`, `active`.
- **payments**: `id`, `member_id`, `plan_id`, `amount_inr`, `method` ('razorpay' | 'cash' | 'upi'), `status` ('paid' | 'pending' | 'failed'), `transaction_id`, `order_id`, `receipt_no`, `paid_at`, `notes`.
- **attendance**: `id`, `member_id`, `check_in_time`, `method` ('qr_scan' | 'admin_manual').
- **gym_settings**: `gym_name`, `is_open`, `custom_status_note`, `opening_time`, `closing_time`, `address`, `phone`, `email`, `map_coords`, `allow_member_registration`.
- **announcements**: `id`, `title`, `message`, `priority` ('normal' | 'urgent'), `created_at`.

#### Step-by-Step Implementation Sequence
1. **Server & Database Infrastructure**: Setup `server.ts` with Express, CORS, JSON parsing, persistent JSON file storage engine, seed data for IP Fitness, and RESTful endpoints for auth, members, plans, payments, attendance, and gym settings.
2. **Visual Foundations & Styling**: Configure Tailwind CSS with the matte black `#101010` and neon green `#B7F34A` theme tokens, custom font styling, and device simulator wrapper.
3. **Authentication & Splash Experience**: Build the animated splash screen with the IP FITNESS brand badge and tagline, role switch (Member / Admin), and secure login with quick-fill demo credentials.
4. **Member Mobile App**:
   - Home Dashboard with dynamic greeting, active/expiring status card, remaining days counter, and live Gym Open/Closed alert.
   - Digital Member Pass with high-contrast QR code and member metadata.
   - Fee Payment Screen with plan selection, INR pricing breakdown, and Razorpay checkout modal.
   - Payment History with downloadable/printable receipts.
   - Attendance history calendar with check-in streaks.
   - Gym Info screen with live operating hours, address, interactive map link, and click-to-call/WhatsApp support.
5. **Admin Operations Portal**:
   - Operations Dashboard with KPI tiles and dues breakdown.
   - Member Management with real-time search, plan assignment, expiry auto-calculation, and manual status overrides.
   - Fee Collection & Cash/UPI Recording with instant receipt generation.
   - Check-In Scanner (simulated camera QR scanning & manual member ID input).
   - Gym Operations Control (instant live Open/Closed toggle, holiday announcements, working hours).
   - Reports section with instant CSV export and revenue summaries.
6. **Mobile Build & App Store Distribution Docs**: Complete Expo / React Native project structure, `app.json`, `eas.json`, and step-by-step instructions for generating Android APK/AAB and iOS packages.
7. **Testing & Verification**: Comprehensive build compilation check (`compile_applet`), API endpoint verification, and user flow validation.
