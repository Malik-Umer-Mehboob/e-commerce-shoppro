import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
const SplashPage = lazy(() => import('./pages/SplashPage'));

// Auth Components
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const GoogleCallback = lazy(() => import('./pages/auth/GoogleCallback'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const VerifyOtp = lazy(() => import('./pages/auth/VerifyOtp'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const SocialCallback = lazy(() => import('./pages/auth/SocialCallback.jsx'));

// Admin Components
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const AddProduct = lazy(() => import('./pages/admin/AddProduct'));
const ReportsDashboard = lazy(() => import('./pages/admin/ReportsDashboard'));
const Discounts = lazy(() => import('./pages/admin/Discounts'));
const BulkUpload = lazy(() => import('./pages/admin/BulkUpload'));
const LowStock = lazy(() => import('./pages/admin/LowStock'));
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));
const SellerLayout = lazy(() => import('./components/layout/SellerLayout'));
const CustomerLayout = lazy(() => import('./components/layout/CustomerLayout'));
const Settings = lazy(() => import('./pages/admin/Settings'));
const Campaigns = lazy(() => import('./pages/admin/marketing/Campaigns'));
const Segments = lazy(() => import('./pages/admin/marketing/Segments'));
const Newsletters = lazy(() => import('./pages/admin/marketing/Newsletters'));
const Templates = lazy(() => import('./pages/admin/marketing/Templates'));
const AdminBlogManager = lazy(() => import('./pages/admin/blog/AdminBlogManager.jsx'));
const CreateBlog = lazy(() => import('./pages/admin/blog/CreateBlog.jsx'));
const AdminPostEditor = lazy(() => import('./pages/admin/blog/AdminPostEditor.jsx'));
const AdminCommentModeration = lazy(() => import('./pages/admin/blog/AdminCommentModeration.jsx'));
const SearchAnalytics = lazy(() => import('./pages/admin/SearchAnalytics.jsx'));
const AdminSearchDashboard = lazy(() => import('./pages/admin/search/AdminSearchDashboard.jsx'));
const Users = lazy(() => import('./pages/admin/Users'));
const Reviews = lazy(() => import('./pages/admin/Reviews'));
const Warehouses = lazy(() => import('./pages/admin/Warehouses'));
const SystemLogs = lazy(() => import('./pages/admin/SystemLogs'));
const RiderAssignments = lazy(() => import('./pages/admin/RiderAssignments'));
const AdminReturns = lazy(() => import('./pages/admin/Returns'));
const Categories = lazy(() => import('./pages/admin/Categories'));
const SellerManagement = lazy(() => import('./pages/admin/SellerManagement'));
const StaffManagement = lazy(() => import('./pages/admin/StaffManagement'));

// Rider Components
const RiderDashboard = lazy(() => import('./pages/rider/Dashboard'));
const RiderSettings = lazy(() => import('./pages/rider/Settings'));
const RiderDeliveries = lazy(() => import('./pages/rider/Deliveries'));

// Seller Components
const SellerDashboard = lazy(() => import('./pages/seller/Dashboard'));
const SellerProducts = lazy(() => import('./pages/seller/Products'));
const SellerOrders = lazy(() => import('./pages/seller/Orders'));
const SellerAnalytics = lazy(() => import('./pages/seller/Analytics'));
const SellerSettings = lazy(() => import('./pages/seller/Settings'));
const SellerReportsDashboard = lazy(() => import('./pages/seller/SellerReportsDashboard'));
const CategoryRequest = lazy(() => import('./pages/seller/CategoryRequest'));

// Support Components
const SupportDashboard = lazy(() => import('./pages/support/Dashboard'));
const AgentTicketsList = lazy(() => import('./pages/support/TicketsList'));
const AgentTicketDetail = lazy(() => import('./pages/support/TicketDetail'));
const KBManagement = lazy(() => import('./pages/support/KBManagement'));
const SupportLayout = lazy(() => import('./pages/support/components/SupportLayout'));
const SupportSettings = lazy(() => import('./pages/support/Settings'));

// Customer Components
const Checkout = lazy(() => import('./pages/customer/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/customer/OrderConfirmation'));
const Home = lazy(() => import('./pages/customer/Home'));
const CartPage = lazy(() => import('./pages/customer/CartPage'));
const WishlistPage = lazy(() => import('./pages/customer/WishlistPage'));
const ProductDetail = lazy(() => import('./pages/products/ProductDetail'));
const SearchResults = lazy(() => import('./pages/search/SearchResults'));
const NotificationPreferences = lazy(() => import('./pages/notifications/NotificationPreferences'));
const HelpCenter = lazy(() => import('./pages/help/HelpCenter'));
const ArticleDetail = lazy(() => import('./pages/help/ArticleDetail'));
const HelpSearch = lazy(() => import('./pages/help/HelpSearch'));
const CategoryArticles = lazy(() => import('./pages/help/CategoryArticles'));
const ContactForm = lazy(() => import('./pages/help/ContactForm'));
const OrderLookup = lazy(() => import('./pages/help/OrderLookup'));
const MyTickets = lazy(() => import('./pages/customer/MyTickets'));
const TicketDetail = lazy(() => import('./pages/customer/TicketDetail'));
const ReturnRequest = lazy(() => import('./pages/customer/ReturnRequest'));
const CustomerReturns = lazy(() => import('./pages/customer/Returns'));
const CustomerProfile = lazy(() => import('./pages/customer/Profile'));
const EmailPreferenceCenter = lazy(() => import('./pages/customer/EmailPreferenceCenter'));
const Unsubscribe = lazy(() => import('./pages/Unsubscribe'));
const AffiliateDashboard = lazy(() => import('./pages/customer/AffiliateDashboard.jsx'));
const AffiliateRegistration = lazy(() => import('./pages/customer/AffiliateRegistration.jsx'));
const ReferralProgram = lazy(() => import('./pages/customer/ReferralProgram.jsx'));
const BlogHome = lazy(() => import('./pages/blog/BlogHome.jsx'));
const BlogPostDetail = lazy(() => import('./pages/blog/BlogPostDetail.jsx'));
const BlogCategories = lazy(() => import('./pages/blog/BlogCategories.jsx'));
const ProductComparisonPage = lazy(() => import('./pages/customer/Compare'));
const SharedWishlistPage = lazy(() => import('./pages/customer/SharedWishlistPage.jsx'));
const LoyaltyDashboard = lazy(() => import('./pages/loyalty/LoyaltyDashboard.jsx'));
const GiftCardShop = lazy(() => import('./pages/loyalty/GiftCardShop.jsx'));
const GiftCardBalance = lazy(() => import('./pages/loyalty/GiftCardBalance.jsx'));
const Products = lazy(() => import('./pages/customer/Products'));
const CustomerOrders = lazy(() => import('./pages/customer/Orders'));
const OrderDetail = lazy(() => import('./pages/customer/OrderDetail'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminShippingZones = lazy(() => import('./pages/admin/ShippingZones'));
const NotificationCenter = lazy(() => import('./pages/customer/NotificationCenter'));

// Shared/Common Components
const ChatWidget = lazy(() => import('./components/common/ChatWidget'));
const AffiliateLinkTracker = lazy(() => import('./components/common/AffiliateLinkTracker.jsx'));
const ComparisonSidebar = lazy(() => import('./components/common/ComparisonSidebar.jsx'));

const LoadingSpinner = () => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        flexDirection: 'column',
        gap: '16px',
    }}>
        <div style={{
            width: '44px',
            height: '44px',
            border: '3px solid #E2E8F0',
            borderTop: '3px solid #F97316',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{
            color: '#94A3B8',
            fontSize: '14px',
            fontWeight: '500',
        }}>
            Loading...
        </p>
        <style>{`
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `}</style>
    </div>
);

function App() {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const getDefaultRoute = () => {
    if (!isAuthenticated) return '/login';
    const role = user?.role ?? user?.roles?.[0]?.name ?? user?.roles?.[0];
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'seller') return '/seller/dashboard';
    if (role === 'support') return '/support/dashboard';
    if (role === 'rider') return '/rider/dashboard';
    return '/home';
  };

  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <AffiliateLinkTracker />
        <ComparisonSidebar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/cart" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CartPage />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/order-confirmation" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <OrderConfirmation />
            </ProtectedRoute>
          } />
          <Route path="/wishlist" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <WishlistPage />
            </ProtectedRoute>
          } />
          <Route path="/products" element={<Products />} />
          <Route path="/shop" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/compare" element={<ProductComparisonPage />} />
          <Route path="/wishlist/shared/:token" element={<SharedWishlistPage />} />
          
          {/* Loyalty & Gift Card Routes */}
          <Route path="/loyalty" element={
            <ProtectedRoute allowedRoles={['customer', 'admin', 'seller', 'support']}>
              <LoyaltyDashboard />
            </ProtectedRoute>
          } />
          <Route path="/gift-cards" element={<GiftCardShop />} />
          <Route path="/gift-cards/balance" element={<GiftCardBalance />} />
          <Route path="/auth/social/:provider/callback" element={<SocialCallback />} />
          <Route path="/notifications/preferences" element={
            <ProtectedRoute allowedRoles={['customer', 'admin', 'seller', 'support']}>
              <NotificationPreferences />
            </ProtectedRoute>
          } />
          <Route path="/user/notifications" element={
            <ProtectedRoute allowedRoles={['customer', 'admin', 'seller', 'support']}>
              <NotificationCenter />
            </ProtectedRoute>
          } />

          {/* Help Center Routes */}
          <Route path="/help" element={
            <CustomerLayout>
              <HelpCenter />
            </CustomerLayout>
          } />
          <Route path="/help/article/:slug" element={
            <CustomerLayout>
              <ArticleDetail />
            </CustomerLayout>
          } />
          <Route path="/help/category/:slug" element={
            <CustomerLayout>
              <CategoryArticles />
            </CustomerLayout>
          } />
          <Route path="/help/search" element={
            <CustomerLayout>
              <HelpSearch />
            </CustomerLayout>
          } />
          <Route path="/help/contact" element={
            <CustomerLayout>
              <ContactForm />
            </CustomerLayout>
          } />
          <Route path="/help/order-lookup" element={
            <CustomerLayout>
              <OrderLookup />
            </CustomerLayout>
          } />

          {/* Blog Routes */}
          <Route path="/blog" element={<BlogHome />} />
          <Route path="/blog/categories" element={<BlogCategories />} />
          <Route path="/blog/:slug" element={<BlogPostDetail />} />

          {/* Customer Support Routes */}
          <Route path="/my-tickets" element={
            <ProtectedRoute allowedRoles={['customer', 'admin', 'seller', 'support']}>
              <MyTickets />
            </ProtectedRoute>
          } />
          <Route path="/my-tickets/:id" element={
            <ProtectedRoute allowedRoles={['customer', 'admin', 'seller', 'support']}>
              <TicketDetail />
            </ProtectedRoute>
          } />
          <Route path="/customer/returns" element={
            <ProtectedRoute allowedRoles={['customer', 'admin', 'seller', 'support']}>
              <ReturnRequest />
            </ProtectedRoute>
          } />
          <Route path="/returns" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerReturns />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerProfile />
            </ProtectedRoute>
          } />
          <Route path="/customer/orders/:id" element={
            <ProtectedRoute allowedRoles={['customer', 'admin', 'seller', 'support']}>
              <OrderDetail />
            </ProtectedRoute>
          } />
          <Route path="/user/orders" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerOrders />
            </ProtectedRoute>
          } />
          <Route path="/email-preferences" element={
            <ProtectedRoute allowedRoles={['customer', 'admin', 'seller', 'support']}>
              <EmailPreferenceCenter />
            </ProtectedRoute>
          } />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
          
          {/* Affiliate & Referral Routes */}
          <Route path="/affiliate/register" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <AffiliateRegistration />
            </ProtectedRoute>
          } />
          <Route path="/affiliate/dashboard" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <AffiliateDashboard />
            </ProtectedRoute>
          } />
          <Route path="/referrals" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <ReferralProgram />
            </ProtectedRoute>
          } />
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to={getDefaultRoute()} replace />}
          />
          <Route
            path="/register"
            element={!isAuthenticated ? <Register /> : <Navigate to={getDefaultRoute()} replace />}
          />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/products" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <AdminProducts />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/products/add" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <AddProduct />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/products/edit/:id" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <AddProduct />
              </AdminLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/discounts" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <Discounts />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/bulk-upload" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <BulkUpload />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/low-stock" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <LowStock />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <AdminOrders />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/returns" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminReturns />
            </ProtectedRoute>
          } />
          <Route path="/admin/shipping-zones" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <AdminShippingZones />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <ReportsDashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/marketing/campaigns" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <Campaigns />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/marketing/segments" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <Segments />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/marketing/newsletters" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <Newsletters />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/marketing/templates" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <Templates />
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* Admin Blog Routes */}
          <Route path="/admin/blog" element={
            <ProtectedRoute allowedRoles={['admin', 'editor']}>
              <AdminLayout>
                <AdminBlogManager />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/blog/create" element={
            <ProtectedRoute allowedRoles={['admin', 'editor', 'author']}>
              <AdminLayout>
                <CreateBlog />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/blog/edit/:id" element={
            <ProtectedRoute allowedRoles={['admin', 'editor', 'author']}>
              <AdminLayout>
                <AdminPostEditor />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/blog/comments" element={
            <ProtectedRoute allowedRoles={['admin', 'editor']}>
              <AdminLayout>
                <AdminCommentModeration />
              </AdminLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/search" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <SearchAnalytics />
              </AdminLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/staff" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <StaffManagement />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <Users />
              </AdminLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/reviews" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <Reviews />
              </AdminLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/warehouses" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <Warehouses />
              </AdminLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/system-logs" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <SystemLogs />
              </AdminLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/rider-assignments" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <RiderAssignments />
              </AdminLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/categories" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <Categories />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/sellers" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <SellerManagement />
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* Rider Routes */}
          <Route path="/rider/dashboard" element={
            <ProtectedRoute allowedRoles={['rider']}>
              <RiderDashboard />
            </ProtectedRoute>
          } />
          <Route path="/rider/settings" element={
            <ProtectedRoute allowedRoles={['rider']}>
              <RiderSettings />
            </ProtectedRoute>
          } />
          <Route path="/rider/deliveries" element={
            <ProtectedRoute allowedRoles={['rider']}>
              <RiderDeliveries />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/settings" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <Settings />
              </AdminLayout>
            </ProtectedRoute>
          } />

          <Route path="/seller/dashboard" element={
            <ProtectedRoute allowedRoles={['seller']}>
              <SellerLayout>
                <SellerDashboard />
              </SellerLayout>
            </ProtectedRoute>
          } />

          <Route path="/seller/products" element={
            <ProtectedRoute allowedRoles={['seller']}>
              <SellerLayout>
                <SellerProducts />
              </SellerLayout>
            </ProtectedRoute>
          } />
          <Route path="/seller/products/add" element={
            <ProtectedRoute allowedRoles={['seller']}>
              <SellerLayout>
                <AddProduct />
              </SellerLayout>
            </ProtectedRoute>
          } />
          <Route path="/seller/products/edit/:id" element={
            <ProtectedRoute allowedRoles={['seller']}>
              <SellerLayout>
                <AddProduct />
              </SellerLayout>
            </ProtectedRoute>
          } />
          <Route path="/seller/orders" element={
            <ProtectedRoute allowedRoles={['seller']}>
              <SellerLayout>
                <SellerOrders />
              </SellerLayout>
            </ProtectedRoute>
          } />
          <Route path="/seller/analytics" element={
            <ProtectedRoute allowedRoles={['seller']}>
              <SellerLayout>
                <SellerAnalytics />
              </SellerLayout>
            </ProtectedRoute>
          } />
          <Route path="/seller/settings" element={
            <ProtectedRoute allowedRoles={['seller']}>
              <SellerLayout>
                <SellerSettings />
              </SellerLayout>
            </ProtectedRoute>
          } />
          <Route path="/seller/reports" element={
            <ProtectedRoute allowedRoles={['seller']}>
              <SellerLayout>
                <SellerReportsDashboard />
              </SellerLayout>
            </ProtectedRoute>
          } />

          <Route path="/seller/category-request" element={
            <ProtectedRoute allowedRoles={['seller']}>
              <SellerLayout>
                <CategoryRequest />
              </SellerLayout>
            </ProtectedRoute>
          } />

          <Route path="/support/dashboard" element={
            <ProtectedRoute allowedRoles={['support', 'admin']}>
              <SupportLayout>
                <SupportDashboard />
              </SupportLayout>
            </ProtectedRoute>
          } />
          <Route path="/support/tickets" element={
            <ProtectedRoute allowedRoles={['support', 'admin']}>
              <SupportLayout>
                <AgentTicketsList />
              </SupportLayout>
            </ProtectedRoute>
          } />
          <Route path="/support/tickets/:id" element={
            <ProtectedRoute allowedRoles={['support', 'admin']}>
              <AgentTicketDetail />
            </ProtectedRoute>
          } />
          <Route path="/support/kb" element={
            <ProtectedRoute allowedRoles={['support', 'admin']}>
              <SupportLayout>
                <KBManagement />
              </SupportLayout>
            </ProtectedRoute>
          } />
          <Route path="/support/settings" element={
            <ProtectedRoute allowedRoles={['support']}>
              <SupportLayout>
                <SupportSettings />
              </SupportLayout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
        <ChatWidget />
      </Suspense>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
