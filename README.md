# 🛒 ShopPro — Frontend

> **A complete, production-ready multi-vendor e-commerce platform** built with React 19, Tailwind CSS v4, and Redux Toolkit. Features 6 role-based panels, full order lifecycle, payment system, delivery management, and advanced SEO.

---

## 🌟 Complete Feature List

### 👥 User Roles & Access Control
- 5 roles: **Admin, Seller, Customer, Support Staff, Delivery Rider**
- Each role has a **completely separate protected dashboard**
- Email domain enforcement per role:
  - 🛒 Customer → @gmail.com only
  - 🏪 Seller → @yahoo.com only
  - 🎧 Support → @hotmail.com only
  - 🚴 Rider → @rider.com only
  - 👑 Admin → fixed credentials
- Role-based route protection (ProtectedRoute component)
- Unauthorized access auto-redirects

### 🔐 Authentication & Security
- Email & password login with Zod validation
- Google OAuth — Continue with Google (fully working)
- Forgot password → 6-digit OTP via Gmail → Reset password
- Rate limiting — account locks after 5 failed attempts
  - Shows remaining attempts on each wrong try
  - Shows lockout timer countdown
- Device logout — see & revoke all active sessions
- Role-based redirect after login
- Token stored in Redux + localStorage (persists on refresh)

### 🏪 Product Management
- Add / Edit / Delete products (Admin & Seller)
- Draft → Published → Archived status toggle
- Product categories & subcategories (nested)
- Multiple image upload with preview (max 5)
- Product variants — Size, Color, Material
- Auto SKU generation
- Stock quantity with low stock threshold
- Discount / Offer tagging with badges
- Bulk CSV upload
- Low stock alerts page

### 🛒 Cart & Wishlist
- Add to cart with quantity selector
- Mini cart popup on add
- Update / Remove cart items
- Persistent cart across sessions
- Wishlist — save favorite products
- Move wishlist items directly to cart
- Share wishlist feature

### 💳 Order Management
- Full order flow: Cart → Checkout → Processing → Shipped → Delivered
- Order status visual timeline
- Order cancellation with **24-hour time window**
  - Shows hours remaining to cancel
  - Auto stock restore on cancellation
- Return / Refund request system
- Order history per user

### 💰 Payment System
- **Cash on Delivery (COD)** — pay when order arrives
- **Bank Transfer** — with bank details display & reference number input
- **Stripe placeholder** — Coming Soon (structure ready)
- Payment status tracking: Pending / Paid / Failed / Refunded
- Admin can mark orders as paid / process refunds

### 🚚 Shipping & Delivery
- Shipping address management (multiple per user)
- **Delivery charges by city/region** — auto-calculated on checkout
  - Karachi: Rs. 150 (2 days)
  - Lahore: Rs. 150 (2 days)
  - Islamabad: Rs. 200 (3 days)
  - Other cities: Rs. 350 (7 days)
- Order tracking status timeline
- **Delivery Rider assignment** by admin
- Rider panel to update delivery status

### 📦 Inventory & Warehouse
- Real-time stock deduction on order
- Low stock alerts (admin & seller)
- **Warehouse management** — multiple warehouses
- Stock tracking per warehouse per product
- Product availability status

### 📊 Admin Dashboard (Dynamic)
- Real-time stats: Total Orders, Revenue, New Users, Products
- Month-over-month growth percentages
- Recent orders table (live from database)
- Low stock product list

### 🎯 Discount & Coupon System
- Coupon codes at checkout
- Percentage & fixed amount discounts
- Expiry date & usage limits per user
- Minimum order amount condition

### ⭐ Reviews & Ratings
- 1–5 star rating system
- **Verified Purchase badge** (auto-detected from order history)
- Admin moderation — approve/reject reviews
- Average rating calculation per product

### 🔍 Search & Filtering
- Live product search
- Filter by: price range, category, brand, rating
- Sort by: newest, price low/high, popularity
- **Search Analytics dashboard** (admin)

### ❤️ Wishlist System
- Save favorite products
- Move to cart from wishlist
- Share wishlist via unique link

### 📩 Notification System
- Order confirmation emails
- Shipping update emails
- OTP password reset emails
- Low stock alerts for admin/seller

### 📄 Invoice & Reports
- Auto-generated PDF invoices
- Monthly sales reports
- Seller analytics with bar charts
- Top selling products report

### 🧑 Customer Account Panel
- Profile management with avatar upload
- Order tracking with status timeline
- Address book (multiple addresses)
- Wishlist management
- Returns & refunds tracking

### 🧑‍💼 Admin Control Panel
- **User Management** — view all users by role
- **Block / Unblock users** with reason
- Manage products (all sellers)
- Manage orders & payment status
- Manage coupons & discounts
- Email campaign management
- Newsletter & templates
- Blog manager with article creation
- **Search Analytics**
- **System Logs** — all activity tracked
- **Warehouse Management**
- **Rider Assignment** for deliveries
- Settings & profile

### 🚴 Delivery Rider Panel
- Active deliveries dashboard
- Today's stats (delivered, active, total)
- Mark orders as Picked Up → Delivered
- Delivery address & customer details

### ⚙️ Advanced Features
- 🌐 **SEO meta tags** on all product pages (Open Graph, Twitter Card, Schema.org)
- 🗺️ **Sitemap generator** at /sitemap.xml
- 📋 **System Logs** — who did what, when, from where
- 🖼️ Avatar upload for all roles
- 🔑 Change password from settings
- 📱 Device session management — logout specific devices
- 🌙 Dark mode ready (Tailwind CSS v4)
- 📱 Fully responsive — mobile to desktop
- 🔒 Per-role route protection
- 🎭 Loading skeletons on all async data
- 🔔 Toast notifications throughout

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| ⚛️ React 19 | UI Framework |
| ⚡ Vite 8 | Build Tool |
| 🎨 Tailwind CSS v4 | Styling (no config file needed) |
| 🗃️ Redux Toolkit | Global State Management |
| 🛣️ React Router DOM v6 | Client-side Routing |
| 🌐 Axios | HTTP API Calls |
| 🔄 React Query v5 | Server State & Caching |
| 📝 React Hook Form | Form Management |
| ✅ Zod | Schema Validation |
| 📊 Recharts | Charts & Analytics |
| 🎠 Swiper | Product Image Sliders |
| 🎭 Framer Motion | Animations |
| 🔷 Lucide React | Icon Library |
| 🔔 React Hot Toast | Toast Notifications |
| 🍬 SweetAlert2 | Confirmation Dialogs |
| 📅 Date-fns | Date Formatting |
| ⭐ React Stars | Star Rating Component |
| 📄 React Paginate | Pagination |
| 🪖 React Helmet Async | SEO Meta Tags |

---

## 🎨 Theme & Design

| Color | Hex | Usage |
|---|---|---|
| 🟦 Navy | `#0F172A` | Sidebar, Header, Navbar |
| 🟠 Orange | `#F97316` | Buttons, Active States, CTAs |
| ⬜ White | `#F8FAFC` | Backgrounds, Cards |
| 🟢 Green | `#10B981` | Success, In Stock, Delivered |
| 🔴 Red | `#EF4444` | Errors, Out of Stock, Blocked |

---

## 📁 Project Structure

```
shoppro-frontend/
├── src/
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── VerifyOtp.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   └── GoogleCallback.jsx
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Users.jsx
│   │   │   ├── Reviews.jsx
│   │   │   ├── Discounts.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── LowStock.jsx
│   │   │   ├── BulkUpload.jsx
│   │   │   ├── Warehouses.jsx
│   │   │   ├── SystemLogs.jsx
│   │   │   ├── SearchAnalytics.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── marketing/
│   │   │       ├── Campaigns.jsx
│   │   │       ├── Segments.jsx
│   │   │       ├── Newsletters.jsx
│   │   │       └── Templates.jsx
│   │   │   └── blog/
│   │   │       ├── BlogManager.jsx
│   │   │       └── CreateBlog.jsx
│   │   ├── seller/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── Settings.jsx
│   │   ├── support/
│   │   │   └── Dashboard.jsx
│   │   ├── rider/
│   │   │   └── Dashboard.jsx
│   │   └── customer/
│   │       ├── Home.jsx
│   │       ├── Cart.jsx
│   │       ├── Checkout.jsx
│   │       ├── Wishlist.jsx
│   │       └── Orders.jsx
│   ├── components/
│   │   ├── ProtectedRoute.jsx
│   │   ├── SEOHead.jsx
│   │   ├── ProductCard.jsx
│   │   └── Footer.jsx
│   ├── store/
│   │   ├── index.js
│   │   └── authSlice.js
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── adminService.js
│   │   ├── cartService.js
│   │   ├── wishlistService.js
│   │   ├── orderService.js
│   │   └── shippingService.js
│   └── index.css
├── vite.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm
- ShopPro Backend running on `http://localhost:8000`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/shoppro-frontend.git

# 2. Navigate to project
cd shoppro-frontend

# 3. Install all dependencies
npm install

# 4. Start development server
npm run dev
```

### Open in browser
```
http://localhost:5173
```

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| 👑 Admin | malik.umerkhan97@gmail.com | malikawan97 |
| 🏪 Seller | any@yahoo.com | Register first |
| 🛒 Customer | any@gmail.com | Register first |
| 🎧 Support | any@hotmail.com | Register first |
| 🚴 Rider | any@rider.com | Register first |

> ⚠️ **Email domain is strictly enforced per role**

---

## 📜 Scripts

```bash
npm run dev       # Start development server (port 5173)
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

---

## 🔗 Backend Repository

👉 **[ShopPro Backend Repository](https://github.com/YOUR_USERNAME/shoppro-backend)**

Backend must be running at `http://localhost:8000`

---

## 📄 License

[MIT License](LICENSE)

---

## 👨‍💻 Developer

**Malik Umer Khan**
- 📧 malik.umerkhan97@gmail.com


---

> 💡 **Portfolio Project** — Demonstrates professional full-stack e-commerce development with React 19, role-based access, real payment flow, delivery management, SEO optimization, and clean UI/UX design.
