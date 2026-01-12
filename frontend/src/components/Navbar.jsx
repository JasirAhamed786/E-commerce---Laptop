import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Store, Menu, LogOut, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import logo from '../../Lap logo 2.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.qty, 0);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white text-slate-800 sticky top-0 z-50 shadow-sm border-b border-gray-100 animate-fade-in">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">

        {/* 1. Logo (Orange Accent) */}
        <Link to="/" className="flex items-start leading-none group">
          <img src={logo} alt="DormDeals Logo" className="h-8 w-8 hover:scale-105 transition-transform duration-200" />
          <div className="flex flex-col ml-2">
            <span className="text-xl font-bold italic text-orange-600 tracking-tighter group-hover:text-orange-700 transition">DormDeals</span>
            <span className="text-[10px] text-slate-500 font-medium">Student Marketplace</span>
          </div>
        </Link>



        {/* 3. Right Icons (Dark Grey with Orange Hover) */}
        <div className="flex items-center gap-4 font-medium text-sm text-slate-600">

          {/* User Authentication Section */}
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-2 text-slate-700 hover:text-orange-600 transition-colors px-3 py-2 rounded-lg hover:bg-orange-50">
                <User className="w-5 h-5" />
                <span className="hidden lg:block font-medium">{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 hover:text-orange-600 transition-colors px-3 py-2 rounded-lg hover:bg-orange-50"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:block">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 font-medium shadow-sm"
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </Link>
          )}

          <Link to="/cart" className="flex items-center gap-2 hover:text-orange-600 transition p-2 rounded-lg hover:bg-orange-50 relative">
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden lg:block">Cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          <div className="flex items-center gap-2 hover:text-orange-600 transition p-2 rounded-lg hover:bg-orange-50 cursor-pointer">
            <Store className="w-5 h-5" />
            <span className="hidden lg:block">Sell Item</span>
          </div>

          <button onClick={toggleMobileMenu} className="md:hidden">
            <Menu className="w-6 h-6 text-slate-600 hover:text-orange-600 transition cursor-pointer p-1 rounded hover:bg-orange-50" />
          </button>
        </div>
      </div>

      {/* Mobile Menu - Slides from Bottom */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={toggleMobileMenu}
          ></div>

          {/* Menu Panel */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transform transition-transform duration-300 ease-out">
            <div className="px-6 py-8 space-y-6 max-h-96 overflow-y-auto">
              {/* Handle */}
              <div className="flex justify-center">
                <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h4>
                <ul className="space-y-3">
                  <li><Link to="/shop" onClick={toggleMobileMenu} className="block text-gray-700 hover:text-orange-600 transition-colors py-2">Shop All</Link></li>
                  <li><Link to="/shop?category=laptop" onClick={toggleMobileMenu} className="block text-gray-700 hover:text-orange-600 transition-colors py-2">Laptops</Link></li>
                  <li><Link to="/shop?category=mobile" onClick={toggleMobileMenu} className="block text-gray-700 hover:text-orange-600 transition-colors py-2">Mobiles</Link></li>
                  <li><Link to="/shop?category=accessories" onClick={toggleMobileMenu} className="block text-gray-700 hover:text-orange-600 transition-colors py-2">Accessories</Link></li>
                  <li><Link to="/about" onClick={toggleMobileMenu} className="block text-gray-700 hover:text-orange-600 transition-colors py-2">About Us</Link></li>
                </ul>
              </div>

              {/* Customer Service */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer Service</h4>
                <ul className="space-y-3">
                  <li><Link to="/contact" onClick={toggleMobileMenu} className="block text-gray-700 hover:text-orange-600 transition-colors py-2">Contact Us</Link></li>
                  <li><Link to="/shipping-info" onClick={toggleMobileMenu} className="block text-gray-700 hover:text-orange-600 transition-colors py-2">Shipping Info</Link></li>
                  <li><a href="#" onClick={toggleMobileMenu} className="block text-gray-700 hover:text-orange-600 transition-colors py-2">Returns & Exchanges</a></li>
                  <li><a href="#" onClick={toggleMobileMenu} className="block text-gray-700 hover:text-orange-600 transition-colors py-2">Warranty</a></li>
                  <li><a href="#" onClick={toggleMobileMenu} className="block text-gray-700 hover:text-orange-600 transition-colors py-2">FAQ</a></li>
                </ul>
              </div>

              {/* Close Button */}
              <button
                onClick={toggleMobileMenu}
                className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <X className="w-4 h-4" />
                Close Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
