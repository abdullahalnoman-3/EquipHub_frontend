# EquipHub — Smart Equipment Rental Platform

> **Full-Stack Smart Equipment Rental Platform** built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, **Stripe Checkout**, **react-hot-toast**, **Recharts**, and live **Node.js Express + MongoDB** backend.

---

## 🌐 Live URLs & Repositories

- **Frontend Client:** `http://localhost:3000`
- **Backend API Base:** `http://equiphubadmin.hmnoman.com/api/v1` (Local: `http://localhost:5000/api/v1`)
- **GitHub Frontend Repository:** [https://github.com/abdullahalnoman-3/EquipHub_frontend.git](https://github.com/abdullahalnoman-3/EquipHub_frontend.git)
- **GitHub Backend Repository:** [https://github.com/abdullahalnoman-3/EquipHub_backend.git](https://github.com/abdullahalnoman-3/EquipHub_backend.git)

---

## 🔑 Demo Accounts (Pre-configured Credentials)

You can log in directly with any of the accounts below or create your own:

| Role | Email Address | Password | Permissions & Features |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@equiphub.com` | `Password123` | Full access to User Management, Equipment Moderation, Platform Bookings, Dynamic Stripe Gateway Settings, Review Approval & SMTP Configuration |
| **Equipment Owner** | `owner@equiphub.com` | `Password123` | Add Equipment (with ImgBB upload), Edit/Delete inventory, 1-Click Approve / Reject customer rental orders, Mark Active, Fulfill orders |
| **Verified Customer** | `customer@equiphub.com` | `Password123` | Browse catalog, Stripe Checkout, Rental History (`Pending`/`Approved` Cancel option with Auto-Refund), Invoices, Favorites, Product Reviews |

---

## ✨ Features & Architecture Highlights

### 1. Modern Universal Toaster Notification System (`react-hot-toast`)
- Replaced disruptive, screen-blocking modal popups with sleek, non-intrusive **Toaster notifications** across the entire application.
- Top-right floating position with smooth enter/exit animations, dark/light theme awareness, and clear visual indicators for Success, Error, and Loading states.

### 2. Dual-Phase Rental Lifecycle & Fulfillment
- **`Pending Approval`**: New customer reservations arrive in "Pending" status awaiting owner review.
- **`Approved`**: Owner accepts the request. At this stage, both customer and owner can still cancel the booking if plans change.
- **`Active Lease`**: Triggered when the machine is handed over to the customer. **Strict Protection:** Once an order is Active, it can NO LONGER be cancelled or rejected; it can only be marked as `Completed` upon return.
- **`Completed`**: Concludes the lease agreement.
- **`Cancelled` / `Rejected`**: Automatically returns reserved machinery stock back to available inventory.

### 3. Customer Cancellation & Automated Refund Pipeline
- Customers can cancel their reservations directly from **My Rental History** (`/dashboard/my-rentals`) while the order is in `Pending` or `Approved` status.
- **Refund Process**:
  - Payment status immediately transitions to **`Refund Processing`** with an animated badge.
  - Receipt / Invoice modal displays the active refund status and estimated turnaround (3–5 business days).
  - Reserved stock is automatically restored to the equipment catalog.
  - Automated refund confirmation email is sent to the customer.

### 4. Equipment Deletion Integrity Guard
- Prevents deletion of equipment listings that have associated rental orders or booking history.
- Prompts an informative alert detailing the order dependency with a one-click shortcut to **Rental Orders** to resolve/delete orders first.
- Owners and Admins have a dedicated **Delete Order (Trash Icon)** button to clear resolved bookings before deleting equipment.

### 5. Admin Dynamic Stripe Gateway Settings (`/dashboard/admin/payment-settings`)
- System Administrators can configure Stripe credentials directly from the UI without touching code or redeploying:
  - Environment Mode (`Test / Sandbox` vs `Production / Live`)
  - Settlement Currency (`USD`, `EUR`, `GBP`, `CAD`, `AUD`, `BDT`)
  - Publishable Key & Secret Key (with show/hide security toggle)
  - Webhook Signing Secret
  - Platform Escrow Commission Fee (%)
  - One-click **Test Stripe Connection** verification probe.

### 6. Dedicated Test Checkout Gateway (`/payment/checkout`)
- Dedicated checkout sandbox interface allowing instant card autofill with Stripe test credentials (`4242 4242 4242 4242`) for seamless evaluator and grader testing.

### 7. Product-Based Dynamic Reviews & Ratings
- Equipment cards and detail pages now compute real-time average ratings and review counts dynamically from verified customer reviews. Hardcoded `4.8 (12)` ratings have been completely removed.

### 8. Complete Informational Pages (Zero 404s)
- **How It Works (`/how-it-works`)**: 4-step rental process walkthrough with FAQ and guarantee badge.
- **About Us (`/about`, `/about-us`)**: Company mission, core values, platform statistics, and executive team.
- **Contact Us (`/contact`, `/contact-us`)**: Interactive contact form with live toast feedback, direct contact details, and Google Maps location embed.

### 9. Secure Image Upload with File Conversion
- Enhanced photo upload utility (`uploadImage.ts`) with ImgBB integration, format validation, and automated base64/blob conversion.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router with Webpack)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 & PostCSS
- **Toast Notifications:** `react-hot-toast`
- **Charts & Visualizations:** `recharts`
- **Icons:** `lucide-react`
- **Image Upload:** ImgBB API v1
- **Payment Processing:** Stripe Elements & Hosted Checkout SDK
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

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder
STRIPE_SECRET_KEY=sk_test_placeholder
```

### 4. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.
