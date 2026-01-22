import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const PaymentPage = () => {
  const [bank, setBank] = useState('');
  const [upiId, setUpiId] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const { cartItems, totalPrice, clearCart, shippingAddress } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pin.length !== 6) {
      alert('PIN must be exactly 6 digits');
      return;
    }
    setLoading(true);

    // Simulate UPI processing for 2 seconds
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
            shippingAddress,
            totalPrice,
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
      <h1 className="text-3xl font-bold mb-8 text-center">UPI Payment</h1>
      <div className="bg-white p-6 rounded shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <p className="text-gray-700">Total Amount: ₹{totalPrice}</p>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Bank</label>
          <select
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">Choose a bank</option>
            <option value="SBI">State Bank of India (SBI)</option>
            <option value="HDFC">HDFC Bank</option>
            <option value="ICICI">ICICI Bank</option>
            <option value="Axis">Axis Bank</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">UPI ID</label>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="user@upi"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">6-Digit PIN</label>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="123456"
            maxLength="6"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading || pin.length !== 6}
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? 'Processing Payment...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;
