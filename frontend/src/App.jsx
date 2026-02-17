import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ShopPage from './components/ShopPage';
import ProductDetails from './components/ProductDetails';
import Chatbot from './components/Chatbot';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import SuccessPage from './pages/SuccessPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import WishlistPage from './pages/WishlistPage';
import Profile from './components/Profile';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ReturnsExchangesPage from './pages/ReturnsExchangesPage';
import WarrantyPage from './pages/WarrantyPage';
import FAQPage from './pages/FAQPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserList from './pages/admin/UserList';
import OrderList from './pages/admin/OrderList';
import ProductList from './pages/admin/ProductList';
import ProductEditScreen from './pages/admin/ProductEditScreen';
import ScrollToTop from './components/ScrollToTop';
import { useAuth } from './context/AuthContext';

function ConditionalChatbot() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  if (isAdminRoute) return null;
  return <Chatbot />;
}

function App() {
  const { user } = useAuth();

  // ✅ Chatbase secure loader
  useEffect(() => {
  const chatbaseId = import.meta.env.VITE_CHATBASE_ID;

  // 🔴 If no user → REMOVE chatbot
  if (!user || user?.isAdmin) {
    const existingScript = document.getElementById(chatbaseId);
    if (existingScript) existingScript.remove();

    const iframe = document.querySelector('iframe[src*="chatbase"]');
    if (iframe) iframe.remove();

    return;
  }

  // 🟢 Load chatbot for normal user
  if (!chatbaseId) return;
  if (document.getElementById(chatbaseId)) return;

  window.chatbaseConfig = {
    chatbotId: chatbaseId,
    userId: user._id,
    userEmail: user.email,
    userName: user.name,
  };

  const script = document.createElement('script');
  script.src = 'https://www.chatbase.co/embed.min.js';
  script.id = chatbaseId;
  script.domain = 'www.chatbase.co';
  script.defer = true;

  document.body.appendChild(script);
}, [user]);


  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<ProtectedRoute><ShopPage /></ProtectedRoute>} />
        <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
        <Route path="/login" element={<RegisterPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/shipping" element={<ProtectedRoute><ShippingPage /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
        <Route path="/success" element={<ProtectedRoute><SuccessPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/returns-exchanges" element={<ReturnsExchangesPage />} />
        <Route path="/warranty" element={<WarrantyPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/cookie-policy" element={<CookiePolicyPage />} />
        <Route path="/shipping-info" element={<ShippingPage />} />

        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserList />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/edit" element={<ProductEditScreen />} />
          <Route path="products/edit/:id" element={<ProductEditScreen />} />
          <Route path="orders" element={<OrderList />} />
        </Route>
      </Routes>

      {/* Optional local chatbot UI */}
      {/* <ConditionalChatbot /> */}

      <Toaster position="top-right" />
    </div>
  );
}

export default App;
