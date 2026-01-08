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
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
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
      </Routes>
      <Chatbot />
    </div>
  );
}

export default App;
