import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Store, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();

  const handleLogout = () => {
    logout();
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.qty, 0);

  return (
    <nav className="bg-white text-slate-800 sticky top-0 z-50 shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">

        {/* 1. Logo (Orange Accent) */}
        <Link to="/" className="flex items-center gap-2 leading-none group">
          <img src="/Lap logo 2.png" alt="DormDeals Logo" className="h-8 w-8" />
          <div className="flex flex-col">
            <span className="text-xl font-bold italic text-orange-600 tracking-tighter group-hover:text-orange-700 transition">DormDeals</span>
            <span className="text-[10px] text-slate-500 font-medium">Student Marketplace</span>
          </div>
        </Link>

        {/* 2. Search Bar (Light Grey Background) */}
        <div className="flex-1 max-w-2xl hidden md:block relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search for laptops, books, gadgets..."
            className="w-full bg-gray-100 border border-transparent text-slate-800 text-sm rounded-lg py-2.5 pl-10 pr-4 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-slate-400"
          />
        </div>

        {/* 3. Right Icons (Dark Grey with Orange Hover) */}
        <div className="flex items-center gap-4 font-medium text-sm text-slate-600">

          {/* User Authentication Section */}
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-slate-700">
                <User className="w-5 h-5" />
                <span className="hidden lg:block font-medium">{user.name}</span>
              </div>
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

          <Menu className="w-6 h-6 md:hidden text-slate-600 hover:text-orange-600 transition cursor-pointer p-1 rounded hover:bg-orange-50" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
