import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import Profile from './components/Profile';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ReturnsExchangesPage from './pages/ReturnsExchangesPage';
import WarrantyPage from './pages/WarrantyPage';
import FAQPage from './pages/FAQPage';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

function App() {
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
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/returns-exchanges" element={<ReturnsExchangesPage />} />
        <Route path="/warranty" element={<WarrantyPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/shipping-info" element={<ShippingPage />} />
      </Routes>
      <Chatbot />
    </div>
  );
}

export default App;
