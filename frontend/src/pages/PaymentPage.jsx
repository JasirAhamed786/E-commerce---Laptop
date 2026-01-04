import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const PaymentPage = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate bank processing for 2 seconds
    setTimeout(async () => {
      try {
        const orderItems = cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item._id,
        }));

        const response = await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            orderItems,
            shippingAddress: {
              address: '123 Main St',
              city: 'Anytown',
              postalCode: '12345',
            },
            totalPrice: totalPrice + 10,
          }),
        });

        if (response.ok) {
          clearCart();
          navigate('/success');
        } else {
          alert('Payment failed');
        }
      } catch (error) {
        alert('Error processing payment');
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-3xl font-bold mb-8 text-center">Payment</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Card Number</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="1234 5678 9012 3456"
            required
          />
        </div>
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="block text-gray-700 mb-2">Expiry</label>
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="MM/YY"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 mb-2">CVV</label>
            <input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="123"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;
