import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, ShoppingBag, Heart, X } from 'lucide-react';

const CartPage = () => {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, totalPrice } = useCart();
  const { addToWishlist } = useWishlist();
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const shippingCost = totalPrice > 499 ? 0 : 100;
  const taxAmount = totalPrice * 0.18;
  const finalTotal = totalPrice + shippingCost + taxAmount;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-amazon-orange">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900 font-medium">Shopping Cart</span>
          </nav>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {/* Checkout Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-amazon-orange text-white rounded-full flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-amazon-orange">Cart</span>
            </div>
            <div className="w-16 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-gray-600">Shipping</span>
            </div>
            <div className="w-16 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-gray-600">Payment</span>
            </div>
            <div className="w-16 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">
                4
              </div>
              <span className="ml-2 text-sm font-medium text-gray-600">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <ShoppingCart className="w-8 h-8 text-amazon-orange mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
          <Link
            to="/shop"
            className="text-amazon-orange hover:text-orange-600 font-medium flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link
              to="/shop"
              className="inline-flex items-center px-8 py-3 bg-amazon-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image || '/placeholder.jpg'}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.brand}</p>
                      <p className="text-xl font-bold text-amazon-orange">₹{item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => decreaseQuantity(item._id)}
                          className="p-2 hover:bg-gray-50 transition-colors"
                          disabled={item.qty <= 1}
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="px-4 py-2 text-center min-w-[3rem]">{item.qty}</span>
                        <button
                          onClick={() => increaseQuantity(item._id)}
                          className="p-2 hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      {/* Remove Button */}
                      <button
                        onClick={() => {
                          setItemToRemove(item);
                          setShowRemoveModal(true);
                        }}
                        className="flex items-center text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                  {/* Item Total */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Subtotal ({item.qty} item{item.qty > 1 ? 's' : ''})</span>
                      <span className="font-semibold text-gray-900">₹{(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</span>
                    <span className="text-gray-900">₹{totalPrice.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className={shippingCost === 0 ? 'text-green-600' : 'text-gray-900'}>
                      {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (GST 18%)</span>
                    <span className="text-gray-900">₹{taxAmount.toFixed(0)}</span>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-amazon-orange">₹{finalTotal.toFixed(0)}</span>
                    </div>
                  </div>
                </div>

                {totalPrice < 499 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-6">
                    <p className="text-sm text-orange-800">
                      Add ₹{(499 - totalPrice).toLocaleString()} more for FREE delivery!
                    </p>
                  </div>
                )}

                <Link
                  to="/shipping"
                  className="w-full bg-amazon-orange text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors font-medium text-center block"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  to="/shop"
                  className="w-full mt-3 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center block"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Remove Item Modal */}
        {showRemoveModal && itemToRemove && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Remove Item</h3>
                  <button
                    onClick={() => {
                      setShowRemoveModal(false);
                      setItemToRemove(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={itemToRemove.image || '/placeholder.jpg'}
                    alt={itemToRemove.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{itemToRemove.name}</h4>
                    <p className="text-sm text-gray-600">{itemToRemove.brand}</p>
                    <p className="text-sm font-semibold text-amazon-orange">₹{itemToRemove.price.toLocaleString()}</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">
                  What would you like to do with this item?
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      addToWishlist(itemToRemove);
                      removeFromCart(itemToRemove._id);
                      setShowRemoveModal(false);
                      setItemToRemove(null);
                    }}
                    className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Heart className="w-4 h-4" />
                    Move to Wishlist
                  </button>
                  <button
                    onClick={() => {
                      removeFromCart(itemToRemove._id);
                      setShowRemoveModal(false);
                      setItemToRemove(null);
                    }}
                    className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove Only
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
