<div align="center">

# ⚡ EquipHub Frontend Client

**Modern Full-Stack Smart Equipment Rental Platform**

[![Next.js](https://img.shields.io/badge/Next.js-v16.4.6_(App_Router)-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-v19.3.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Stripe](https://img.shields.io/badge/Stripe_Checkout-Integrated-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![cPanel Deployment](https://img.shields.io/badge/cPanel-Production_Live-FF6C2C?style=for-the-badge&logo=cpanel&logoColor=white)](https://cpanel.net/)
[![Release](https://img.shields.io/badge/Release-v2.14-0284C7?style=for-the-badge)](https://github.com/abdullahalnoman-3/EquipHub_frontend)

<br/>

**Live Web Application:** [https://equiphub.hmnoman.com](https://equiphub.hmnoman.com)  
**Backend API Endpoint:** [https://equiphubadmin.hmnoman.com/api/v1](https://equiphubadmin.hmnoman.com/api/v1)  
**Backend Repository:** [https://github.com/abdullahalnoman-3/EquipHub_backend.git](https://github.com/abdullahalnoman-3/EquipHub_backend.git)

</div>

---

## 📖 Platform Overview

**EquipHub** is an all-in-one, enterprise-grade peer-to-peer and business-to-consumer equipment rental marketplace. It bridges the gap between equipment owners with idle high-value machinery, audio-visual gear, tools, and vehicles, and renters seeking flexible, insured, short-term rentals.

Engineered with **Next.js 16 (App Router)** and **React 19**, the frontend delivers blazingly fast pre-rendered static pages, dynamic client hydration, interactive charts, and secure payment processing.

---

## 🎯 Role-Based Portals & Capabilities

EquipHub provides three tailor-made experiences depending on the user's authenticated role:

### 1. 🛍️ Customer Experience
* **Smart Catalog & Filter Engine:** Browse listings with real-time text search, category filtering, date-range availability checks, price range sliders, and sorting options.
* **Listing Detail Page (`/equipment/[id]`):** High-resolution image galleries, owner verification badge, technical specifications, dynamic daily pricing calculation, and verified customer reviews.
* **Instant Stripe Checkout:** Secure payment authorization via Stripe, computing total rental days, security deposits, and booking fees.
* **Customer Dashboard (`/dashboard`):**
  * **My Rentals (`/dashboard/my-rentals`):** Track live rental orders with real-time status badges (`Pending`, `Approved`, `Active`, `Completed`, `Cancelled`).
  * **Favorites / Wishlist (`/dashboard/favorites`):** One-click bookmarking of desired equipment.
  * **User Profile & Security (`/dashboard/profile`):** Manage avatar, bio, contact details, and password.

---

### 2. 🚜 Equipment Owner Portal
* **Add Equipment Wizard (`/dashboard/owner/add-equipment`):** Step-by-step equipment submission with drag-and-drop multi-image uploads, daily/weekly/monthly pricing rules, replacement value, pickup location, and condition tags.
* **My Equipment (`/dashboard/owner/my-equipment`):** Full inventory management table with live availability toggling, price editing, and performance statistics.
* **Rental Orders (`/dashboard/owner/rental-orders`):** Owner order workflow management to approve or decline booking requests, inspect renter profiles, and mark items as handed over (`Active`) or returned (`Completed`).

---

### 3. 🛡️ Admin Super Control Center

The Admin Dashboard provides full platform governance, moderation, and **live third-party configuration directly through intuitive UI settings**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                     ADMIN SETTINGS SUITE                               │
├─────────────────────────┬──────────────────────────────┬───────────────┤
│ Setting Screen          │ Configurable Parameters      │ Action        │
├─────────────────────────┼──────────────────────────────┼───────────────┤
│ 📧 SMTP Configuration   │ Host, Port, Username, App    │ Instant Save  │
│    `/admin/smtp`        │ Password, From Address/Name  │ & No Restart  │
├─────────────────────────┼──────────────────────────────┼───────────────┤
│ 💳 Payment Gateway      │ Stripe Secret Key, Pub Key,  │ One-Click     │
│    `/admin/payment-`    │ Currency (USD/EUR/BDT), Mode │ Live Test Ping│
│    `settings`           │ (Test / Live), Fee Structure │ to Stripe API │
├─────────────────────────┼──────────────────────────────┼───────────────┤
│ 🔑 Social Login Apps    │ Google Client ID & Secret,   │ Dynamic Save  │
│    `/admin/social-`     │ GitHub Client ID & Secret    │ to Database   │
│    `settings`           │                              │               │
└─────────────────────────┴──────────────────────────────┴───────────────┘
```

* **Dynamic SMTP Configuration (`/dashboard/admin/smtp`):**
  * Configure custom SMTP credentials directly in the browser (supports Gmail App Passwords, SendGrid, Amazon SES, or custom cPanel Webmail).
  * System immediately updates email dispatching for order notifications and status alerts without requiring server redeployment or `.env` modification.
* **Dynamic Payment Gateway Configuration (`/dashboard/admin/payment-settings`):**
  * Switch between Stripe Sandbox/Test and Live modes seamlessly.
  * Enter new Stripe keys and hit **"Test Gateway Connection"** to verify credentials directly against Stripe servers before saving.
* **Dynamic Social Login App Credentials (`/dashboard/admin/social-settings`):**
  * Register Google OAuth and GitHub OAuth Client IDs and Secrets directly from the Admin UI.
  * Frontend login and registration modals immediately recognize the new OAuth parameters.
* **Equipment Moderation (`/dashboard/admin/equipment`):** Platform-wide moderation queue to inspect, approve, reject, or remove flagged listings.
* **Platform Rental Ledger (`/dashboard/admin/bookings`):** Complete overview of all customer-owner transactions, booking dates, and dispute resolutions.
* **User Management (`/dashboard/admin/users`):** Manage registered accounts, promote users to `owner` or `admin`, and ban fraudulent profiles.
* **Review Moderation (`/dashboard/admin/reviews`):** Moderate user feedback and ratings.

---

## 🏗️ Technical Architecture & Production Optimizations

* **Next.js 16 Native Compatibility:** Built with the latest Next.js 16 App Router, utilizing Turbopack/Webpack hybrid builds.
* **Pure ESM Configuration (`next.config.mjs`):** Configuration uses native ECMAScript Modules (`.mjs`), ensuring zero TypeScript transpilation overhead during server boot.
* **WASM Fallback Architecture:** Integrated `@next/swc-wasm-nodejs` (WebAssembly) ensuring that the Next.js engine runs flawlessly across all Linux distributions, even on legacy shared hosting servers without `GLIBC_2.29`.
* **cPanel LiteSpeed / Passenger Production Server (`server.js`):** Custom standalone HTTP server with explicit `dev = false` enforcement, handling requests cleanly under Phusion Passenger.
* **Adaptive Protocol Interceptor:** Axios API client (`src/services/api.ts`) automatically harmonizes HTTP and HTTPS protocols to prevent Mixed Content security blocks across custom domains.
* **Custom EquipHub Brand Assets:** Multi-resolution branded SVG and PNG favicons (`favicon.ico`, `icon.svg`, `icon.png`, `apple-icon.png`) integrated into the root metadata.

---

## 🗺️ Complete Route Hierarchy

```
/
├── (auth)
│   ├── /login                    # Email/Password + Social OAuth Login
│   └── /register                 # Dual-role Registration (Customer / Owner)
├── /equipment                    # Browse catalog with filters & search
├── /equipment/[id]               # Detailed equipment listing & booking box
├── /about                        # Company mission & about us
├── /contact                      # Contact us & inquiry form
├── /how-it-works                 # Visual guide to renting & listing
├── /payment
│   ├── /checkout                 # Stripe payment gateway wrapper
│   ├── /success                  # Order confirmation & receipt
│   └── /cancel                   # Cancelled checkout recovery
└── /dashboard
    ├── /profile                  # User profile & account security
    ├── /favorites                # Customer saved wishlist
    ├── /my-rentals               # Customer rental history & active orders
    ├── /owner
    │   ├── /add-equipment        # Listing submission wizard
    │   ├── /my-equipment         # Owner equipment inventory manager
    │   └── /rental-orders        # Owner incoming booking requests
    └── /admin
        ├── /equipment            # Platform listing moderation
        ├── /bookings             # Platform-wide rental ledger
        ├── /users                # User directory & role management
        ├── /reviews              # Review moderation feed
        ├── /smtp                 # Dynamic SMTP email settings
        ├── /payment-settings     # Dynamic Stripe credentials & test ping
        └── /social-settings      # Dynamic Social Login OAuth credentials
```

---

## 💻 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/abdullahalnoman-3/EquipHub_frontend.git
cd EquipHub_frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the root directory (based on `.env.example`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_key_if_applicable
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 cPanel Production Deployment

### Quick Deploy Steps:
1. **Build the Application:**
   ```bash
   npm run build
   ```
2. **Package Deployment Bundle:**
   Package `.next`, `public`, `server.js`, `next.config.mjs`, `package.json`, and `.env.production` (as `.env`).
3. **Upload to cPanel:**
   Extract files into the domain root directory: `/home/username/equiphub.hmnoman.com/`.
4. **Setup in cPanel "Setup Node.js App":**
   * **Node.js Version:** `20.x` or `22.x`
   * **Application Mode:** `Production`
   * **Application Startup File:** `server.js`
   * Click **Run NPM Install** to install production dependencies.
   * Click **Restart**.
5. EquipHub will be instantly accessible at **https://equiphub.hmnoman.com**.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).  
EquipHub Platform © 2026. All rights reserved.
