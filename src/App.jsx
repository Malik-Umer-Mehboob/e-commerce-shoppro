import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import GoogleCallback from './pages/auth/GoogleCallback';
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyOtp from './pages/auth/VerifyOtp';
import ResetPassword from './pages/auth/ResetPassword';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AddProduct from './pages/admin/AddProduct';
import ReportsDashboard from './pages/admin/ReportsDashboard';
import SellerDashboard from './pages/seller/Dashboard';
import SellerProducts from './pages/seller/Products';
import SellerReportsDashboard from './pages/seller/SellerReportsDashboard';
import SupportDashboard from './pages/support/Dashboard';
import AgentTicketsList from './pages/support/TicketsList';
import AgentTicketDetail from './pages/support/TicketDetail';
import KBManagement from './pages/support/KBManagement';
import SupportLayout from './pages/support/components/SupportLayout';
import Home from './pages/customer/Home';
import CartPage from './pages/customer/CartPage';
import WishlistPage from './pages/customer/WishlistPage';
import ProductDetail from './pages/products/ProductDetail';
import Discounts from './pages/admin/Discounts';
import BulkUpload from './pages/admin/BulkUpload';
import LowStock from './pages/admin/LowStock';
import SearchResults from './pages/search/SearchResults';
import NotificationPreferences from './pages/notifications/NotificationPreferences';
import HelpCenter from './pages/help/HelpCenter';
import ArticleDetail from './pages/help/ArticleDetail';
import ContactForm from './pages/help/ContactForm';
import OrderLookup from './pages/help/OrderLookup';
import MyTickets from './pages/customer/MyTickets';
import TicketDetail from './pages/customer/TicketDetail';
import ReturnRequest from './pages/customer/ReturnRequest';
import ChatWidget from './components/common/ChatWidget';
import Campaigns from './pages/admin/marketing/Campaigns';
import Segments from './pages/admin/marketing/Segments';
import Newsletters from './pages/admin/marketing/Newsletters';
import Templates from './pages/admin/marketing/Templates';
import EmailPreferenceCenter from './pages/customer/EmailPreferenceCenter';
import Unsubscribe from './pages/Unsubscribe';
import AffiliateDashboard from './pages/customer/AffiliateDashboard.jsx';
import AffiliateRegistration from './pages/customer/AffiliateRegistration.jsx';
import ReferralProgram from './pages/customer/ReferralProgram.jsx';
import AffiliateLinkTracker from './components/common/AffiliateLinkTracker.jsx';
import BlogHome from './pages/blog/BlogHome.jsx';
import BlogPostDetail from './pages/blog/BlogPostDetail.jsx';
import AdminBlogManager from './pages/admin/blog/AdminBlogManager.jsx';
import AdminPostEditor from './pages/admin/blog/AdminPostEditor.jsx';
import AdminCommentModeration from './pages/admin/blog/AdminCommentModeration.jsx';
import BlogCategories from './pages/blog/BlogCategories.jsx';
import ProductComparisonPage from './pages/customer/ProductComparisonPage.jsx';
import SharedWishlistPage from './pages/customer/SharedWishlistPage.jsx';
import ComparisonSidebar from './components/common/ComparisonSidebar.jsx';
import LoyaltyDashboard from './pages/loyalty/LoyaltyDashboard.jsx';
import GiftCardShop from './pages/loyalty/GiftCardShop.jsx';
import GiftCardBalance from './pages/loyalty/GiftCardBalance.jsx';
import SocialCallback from './pages/auth/SocialCallback.jsx';
import AdminSearchDashboard from './pages/admin/search/AdminSearchDashboard.jsx';
import { Toaster } from 'react-hot-toast';

function App() {
  const { isAuthenticated, role } = useSelector(state => state.auth);

  const getDefaultRoute = () => {
    if (!isAuthenticated) return '/login';
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'seller') return '/seller/dashboard';
    if (role === 'support') return '/support/dashboard';
    return '/home';
  };

  return (
    <>
      <AffiliateLinkTracker />
      <ComparisonSidebar />
      <Routes>
      <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/wishlist" element={
        <ProtectedRoute allowedRoles={['customer', 'admin', 'seller', 'support']}>
          <WishlistPage />
        </ProtectedRoute>
      } />
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

      {/* Help Center Routes */}
      <Route path="/help" element={<HelpCenter />} />
      <Route path="/help/article/:slug" element={<ArticleDetail />} />
      <Route path="/help/contact" element={<ContactForm />} />
      <Route path="/help/order-lookup" element={<OrderLookup />} />

      {/* Blog Routes */}
      <Route path="/blog" element={<BlogHome />} />
      <Route path="/blog/categories" element={<BlogCategories />} />
      <Route path="/blog/:slug" element={<BlogPostDetail />} />

      {/* Customer Support Routes */}
      <Route path="/customer/tickets" element={
        <ProtectedRoute allowedRoles={['customer', 'admin', 'seller', 'support']}>
          <MyTickets />
        </ProtectedRoute>
      } />
      <Route path="/customer/tickets/:id" element={
        <ProtectedRoute allowedRoles={['customer', 'admin', 'seller', 'support']}>
          <TicketDetail />
        </ProtectedRoute>
      } />
      <Route path="/customer/returns" element={
        <ProtectedRoute allowedRoles={['customer', 'admin', 'seller', 'support']}>
          <ReturnRequest />
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
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="/admin/products" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminProducts />
        </ProtectedRoute>
      } />
      <Route path="/admin/products/add" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AddProduct />
        </ProtectedRoute>
      } />
      <Route path="/admin/products/edit/:id" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AddProduct />
        </ProtectedRoute>
      } />

      <Route path="/admin/discounts" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Discounts />
        </ProtectedRoute>
      } />
      <Route path="/admin/bulk-upload" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <BulkUpload />
        </ProtectedRoute>
      } />
      <Route path="/admin/low-stock" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <LowStock />
        </ProtectedRoute>
      } />
      <Route path="/admin/reports" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <ReportsDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/marketing/campaigns" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Campaigns />
        </ProtectedRoute>
      } />
      <Route path="/admin/marketing/segments" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Segments />
        </ProtectedRoute>
      } />
      <Route path="/admin/marketing/newsletters" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Newsletters />
        </ProtectedRoute>
      } />
      <Route path="/admin/marketing/templates" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Templates />
        </ProtectedRoute>
      } />

      {/* Admin Blog Routes */}
      <Route path="/admin/blog" element={
        <ProtectedRoute allowedRoles={['admin', 'editor']}>
          <AdminBlogManager />
        </ProtectedRoute>
      } />
      <Route path="/admin/blog/create" element={
        <ProtectedRoute allowedRoles={['admin', 'editor', 'author']}>
          <AdminPostEditor />
        </ProtectedRoute>
      } />
      <Route path="/admin/blog/edit/:id" element={
        <ProtectedRoute allowedRoles={['admin', 'editor', 'author']}>
          <AdminPostEditor />
        </ProtectedRoute>
      } />
      <Route path="/admin/blog/comments" element={
        <ProtectedRoute allowedRoles={['admin', 'editor']}>
          <AdminCommentModeration />
        </ProtectedRoute>
      } />

      <Route path="/seller/dashboard" element={
        <ProtectedRoute allowedRoles={['seller']}>
          <SellerDashboard />
        </ProtectedRoute>
      } />

      <Route path="/seller/products" element={
        <ProtectedRoute allowedRoles={['seller']}>
          <SellerProducts />
        </ProtectedRoute>
      } />
      <Route path="/seller/products/add" element={
        <ProtectedRoute allowedRoles={['seller']}>
          <AddProduct />
        </ProtectedRoute>
      } />
      <Route path="/seller/reports" element={
        <ProtectedRoute allowedRoles={['seller']}>
          <SellerReportsDashboard />
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

      <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
      </Routes>
      <ChatWidget />
      <Toaster position="top-right" />
    </>
  );
}

export default App;