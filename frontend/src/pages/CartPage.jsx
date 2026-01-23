import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, removeFromCart, totalPrice } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-xl mb-4">Your cart is empty</p>
          <Link to="/shop" className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center border-b py-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover mr-4" />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">₹{item.price.toLocaleString()}</p>
                  <p className="text-sm">Qty: {item.qty}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="bg-gray-100 p-6 rounded">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping:</span>
              <span>₹100</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total:</span>
              <span>₹{(totalPrice + 100).toLocaleString()}</span>
            </div>
            <Link
              to="/shipping"
              className="block bg-orange-500 text-white text-center px-6 py-2 rounded mt-4 hover:bg-orange-600"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
