# EquipHub — Smart Equipment Rental Platform

> **Full-Stack Smart Equipment Rental Platform** built with **Next.js 16 (App Router)**, **Tailwind CSS**, **Recharts**, **Stripe Checkout**, and a live **Node.js Express + MongoDB** backend.

---

## 🌐 Live URLs & Backend API

- **Frontend Client:** `http://localhost:3000`
- **Backend API Base:** `http://equiphubadmin.hmnoman.com/api/v1`
- **GitHub Frontend Repository:** [https://github.com/abdullahalnoman-3/EquipHub_frontend.git](https://github.com/abdullahalnoman-3/EquipHub_frontend.git)
- **GitHub Backend Repository:** [https://github.com/abdullahalnoman-3/EquipHub_backend.git](https://github.com/abdullahalnoman-3/EquipHub_backend.git)

---

## 🔑 Demo Credentials (Seeded Accounts)

You can log in directly with any of the pre-configured role accounts:

| Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@equiphub.com` | `Password123` | Full access to User Management, Equipment Moderation, Platform Bookings, Review Approval & SMTP Settings |
| **Equipment Owner** | `owner@equiphub.com` | `Password123` | Add Equipment with ImgBB upload, Edit/Delete inventory, View & Fulfill customer rental orders |
| **Verified Customer** | `customer@equiphub.com` | `Password123` | Book Equipment, Stripe Checkout, View Rental History, Invoices, Favorites & Leave Reviews |

---

## ✨ Features & Architecture Highlights

### 1. Public Marketplace & Browsing
- **Dynamic Homepage:** Animated Hero banner with quick search, Featured Equipment section, Categories filter, Customer Testimonials & Reviews, FAQ accordion, and Why Choose Us.
- **All Equipment Catalog (`/equipment`):** Responsive 3-column grid, real-time debounced search, category dropdown, price range filter, availability check, and multi-criteria sorting (Price Low to High, High to Low, Recently Added).
- **Private Equipment Details (`/equipment/:id`):** High-definition image preview, full technical specifications, condition, brand, model, depot location, terms & conditions, owner verification card, and interactive Customer Reviews with 5-star ratings.
- **Add to Favorites (`/dashboard/favorites`):** Seamless one-click heart button toggle with optimistic UI updates and toast feedback.

### 2. Stripe Payment & Rental Booking
- **Smart Booking Modal:** Real-time rental duration (days) calculation, dynamic price computation based on quantity, inventory stock verification, and contact/delivery inputs.
- **Stripe Checkout Hosted Redirect:** Integrated with test sandbox credentials (`pk_test_...`, `sk_test_...`) supporting test cards (`4242 4242 4242 4242`).
- **Payment Confirmation (`/payment/success`):** Automated session verification, transaction ID capture, digital receipt, and instant database record creation.
- **Payment Cancellation (`/payment/cancel`):** Clean cancellation view with retry actions.

### 3. Role-Based Protected Dashboard (`/dashboard`)
- **Strict Route Guards:** Unauthorized users are securely routed away from `/dashboard/admin/*` and `/dashboard/owner/*` with custom 403 Forbidden screens.
- **Refresh Protection:** Local cache recovery eliminates false logouts and route errors on browser hard reloads (`F5`).
- **Customer Space:**
  - My Rentals (`/dashboard/my-rentals`): Booking history, payment status, active/completed badges, printable invoice receipts, and review shortcuts.
  - Saved Favorites (`/dashboard/favorites`): Bookmarked equipment grid with one-click reservation and removal.
- **Owner Space:**
  - Add Equipment (`/dashboard/owner/add-equipment`): Full-featured listing form with direct ImgBB file upload and real-time marketplace card preview.
  - My Equipment (`/dashboard/owner/my-equipment`): Inventory table with live approval badges (`Pending`, `Approved`, `Rejected`), edit modal, and safe deletion.
  - Rental Orders (`/dashboard/owner/rental-orders`): Customer fulfillment table with status update controls (`Active`, `Completed`, `Cancelled`).
- **Admin Control Panel:**
  - User Management (`/dashboard/admin/users`): Master user table with live one-click role upgrades (`Customer` ↔ `Owner` ↔ `Admin`).
  - Equipment Moderation (`/dashboard/admin/equipment`): One-click Approve and Reject controls that notify owners.
  - Master Platform Bookings (`/dashboard/admin/bookings`): Complete platform transaction audit log.
  - Review Moderation (`/dashboard/admin/reviews`): Approve, reject, and toggle visibility of customer feedback.
  - SMTP & Email Management (`/dashboard/admin/smtp`): Outbound mail server configuration, masked credential security, test email probe, and HTML notification template previews.

### 4. Visual Analytics & Production Polish
- **Recharts Integration:** Monthly platform gross revenue growth area chart and booking velocity bar charts for Admin, alongside monthly net earnings charts for Owners.
- **Global Loading Skeleton (`/loading.tsx`):** Pulsing skeleton placeholders that prevent blank screens.
- **Custom 404 Page (`/not-found.tsx`):** Branded lost equipment view with quick navigation.
- **Global Error Boundary (`/error.tsx`):** Catches unhandled exceptions with retry handlers.
- **Theme Support:** Dark / Light mode toggle powered by React Context and Tailwind dark variant.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router with Webpack)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 & PostCSS
- **Charts:** Recharts
- **Icons:** Lucide React
- **Notifications:** SweetAlert2 & Custom Toasts
- **Image Upload:** ImgBB API v1
- **Payments:** Stripe Checkout SDK
- **HTTP Client:** Axios with JWT Interceptors & Bearer Token Authorization

---

## 🚀 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/abdullahalnoman-3/EquipHub_frontend.git
cd EquipHub_frontend
```

### 2. Install dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://equiphubadmin.hmnoman.com/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51MockStripePublishableKeyForEquipHubDemo
STRIPE_SECRET_KEY=sk_test_51MockStripeSecretKeyForTestingEquipHub2026
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 💳 Testing Payments with Stripe
1. Log in as `customer@equiphub.com` / `Password123`.
2. Browse any available equipment and click **"Book Equipment Now"**.
3. Choose rental start and end dates.
4. Click **"Proceed to Stripe Checkout"**.
5. Use test card:
   - Card Number: `4242 4242 4242 4242`
   - Expiration: Any future date (e.g., `12/28`)
   - CVC: `123`
   - ZIP: `12345`
6. Upon payment confirmation, you will be automatically redirected to `/payment/success` with your transaction ID and booking invoice recorded in MongoDB.

---

## 📄 License
Developed for Assignment 9 (Category 003) — EquipHub Smart Equipment Rental Platform.
