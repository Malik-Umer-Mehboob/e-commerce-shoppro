# 🛒 ShopPro — Frontend

> **A modern, professional multi-vendor e-commerce platform** built with React 19, Tailwind CSS v4, and Redux Toolkit. Designed for real-world use with a clean Navy & Orange theme.

---

## 🌟 Features

### 👥 User Roles & Access Control
- 🔴 **Admin** — Full system control with analytics dashboard
- 🟠 **Seller** — Product & order management panel
- 🟢 **Customer** — Shopping experience with cart & checkout
- 🔵 **Support Staff** — Order & customer query management
- Each role has a **separate protected dashboard**
- Feature restrictions per role (seller cannot access admin analytics)

### 🔐 Authentication & Security
- Email & password login with validation
- Google OAuth — Continue with Google
- Forgot password with **6-digit OTP** via email
- OTP verify → Reset password flow
- Rate limiting — account locks after 5 failed attempts
- Role-based redirect after login
- Email domain restrictions per role

### 🏪 Product Management
- Add / Edit / Delete products (Admin & Seller)
- Product categories & subcategories (nested)
- Multiple image upload with preview
- Product variants — Size, Color, Material
- Stock quantity tracking with thresholds
- SKU auto-generation
- Draft & Publish toggle
- Discount / Offer tagging with badges
- Bulk CSV upload
- Low stock alerts

### 🛒 Cart & Wishlist
- Add to cart with quantity selector
- Update / Remove cart items
- Persistent cart across sessions
- Mini cart popup on add
- Wishlist — save favorite products
- Move wishlist items to cart

### 💳 Order Management
- Full order flow: Cart → Checkout → Processing → Shipped → Delivered
- Order status visual timeline
- Order cancellation (time-based)
- Return / Refund request system
- Order history per user

### 💰 Payment System
- Cash on Delivery (COD)
- Bank Transfer option
- Stripe-ready structure (placeholder)
- Payment status tracking: Pending / Paid / Failed / Refunded

### 🚚 Shipping & Delivery
- Shipping address management
- Multiple addresses per user
- Delivery charges based on city/region
- Order tracking status

### 🔍 Search & Filtering
- Live product search with autocomplete
- Filter by: price range, category, brand, rating
- Sort by: newest, price low/high, popularity
- Search analytics dashboard (admin)

### ⭐ Reviews & Ratings
- 1–5 star rating system
- Verified purchase badge
- Admin moderation — approve/reject reviews

### 🎯 Discount & Coupon System
- Coupon codes at checkout
- Percentage & fixed amount discounts
- Expiry date & usage limits per user
- Minimum order amount condition

### 📩 Notification System
- Order confirmation emails
- Shipping update emails
- OTP password reset emails
- Low stock alerts for admin/seller

### 📊 Admin Dashboard
- Real-time stats: Orders, Revenue, Users, Products
- Recent orders table (live from database)
- Monthly growth percentages
- Low stock product alerts
- Dynamic data — no hardcoded values

### 📄 Invoice & Reports
- Auto-generated invoices
- Monthly sales reports
- Seller analytics with revenue charts
- Top selling products

### 🧑 Customer Account Panel
- Profile management with avatar upload
- Order tracking with status timeline
- Address book management
- Wishlist management
- Returns & refunds tracking

### 🧑‍💼 Admin Control Panel
- Manage users (view all roles)
- Manage products (all sellers)
- Manage orders & payments
- Manage coupons & discounts
- Email campaign management
- Newsletter management
- Blog manager with article creation
- Search analytics
- Settings & profile

### ⚙️ Advanced Features
- 🌙 Dark mode ready (Tailwind CSS v4)
- 📱 Fully responsive — mobile to desktop
- 🔒 Protected routes per role
- 🌐 SEO-friendly page structure
- 📝 Blog Manager with rich article creation
- 📈 Search Analytics dashboard
- 📧 Email Campaign management
- 📰 Newsletter & Email Templates
- 🖼️ Avatar upload for all roles
- 🔑 Change password from settings

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| ⚛️ React 19 | UI Framework |
| ⚡ Vite 8 | Build Tool |
| 🎨 Tailwind CSS v4 | Styling (no config file) |
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

---

## 🎨 Theme & Design

| Color | Hex | Usage |
|---|---|---|
| 🟦 Navy | `#0F172A` | Sidebar, Header, Navbar |
| 🟠 Orange | `#F97316` | Buttons, Active States, CTAs |
| ⬜ White | `#F8FAFC` | Backgrounds, Cards |
| 🟢 Green | `#10B981` | Success, In Stock |
| 🔴 Red | `#EF4444` | Errors, Out of Stock |

---

## 📁 Project Structure

```
shoppro-frontend/
├── src/
│   ├── pages/
│   │   ├── auth/              # Login, Register, ForgotPassword
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── VerifyOtp.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   └── GoogleCallback.jsx
│   │   ├── admin/             # Full admin panel
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── LowStock.jsx
│   │   │   ├── BulkUpload.jsx
│   │   │   ├── Discounts.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── SearchAnalytics.jsx
│   │   │   ├── blog/
│   │   │   │   ├── BlogManager.jsx
│   │   │   │   └── CreateBlog.jsx
│   │   │   └── marketing/
│   │   │       ├── Campaigns.jsx
│   │   │       ├── Segments.jsx
│   │   │       ├── Newsletters.jsx
│   │   │       └── Templates.jsx
│   │   ├── seller/            # Seller panel
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── Settings.jsx
│   │   ├── support/           # Support panel
│   │   │   └── Dashboard.jsx
│   │   └── customer/          # Customer pages
│   │       ├── Home.jsx
│   │       ├── Cart.jsx
│   │       ├── Wishlist.jsx
│   │       └── Orders.jsx
│   ├── components/
│   │   ├── ProtectedRoute.jsx
│   │   ├── ProductCard.jsx
│   │   └── layout/
│   ├── store/
│   │   ├── index.js
│   │   └── authSlice.js
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── productService.js
│   │   └── adminService.js
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

> ⚠️ **Important:** Email domain is enforced per role
> - Customer → must use @gmail.com
> - Seller → must use @yahoo.com
> - Support → must use @hotmail.com

---

## 📜 Scripts

```bash
npm run dev       # Start development server (port 5173)
npm run build     # Build for production
npm run preview   # Preview production build locally
npm run lint      # Run ESLint checks
```

---

## 🔗 Backend

This frontend requires the ShopPro Laravel backend to be running.

👉 **[ShopPro Backend Repository](https://github.com/YOUR_USERNAME/shoppro-backend)**

Make sure backend is running at `http://localhost:8000` before starting frontend.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Developer

**Malik Umer Khan**
- 📧 malik.umerkhan97@gmail.com
- 🐙 [GitHub](https://github.com/YOUR_USERNAME)

---

> 💡 **Portfolio Project** — Built to demonstrate professional full-stack e-commerce development with modern React, Redux, and clean UI/UX design patterns.
