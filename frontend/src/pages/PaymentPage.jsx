import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [bank, setBank] = useState('');
  const [upiId, setUpiId] = useState('');
  const [pin, setPin] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [loading, setLoading] = useState(false);
  const { cartItems, totalPrice, clearCart, shippingAddress } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation based on payment method
    if (paymentMethod === 'upi') {
      if (!upiId || pin.length !== 6) {
        alert('Please fill all UPI payment details');
        return;
      }
    } else if (paymentMethod === 'card') {
      if (!cardNumber || !expiryDate || !cvv || !cardName) {
        alert('Please fill all card payment details');
        return;
      }
      if (cvv.length !== 3) {
        alert('CVV must be 3 digits');
        return;
      }
    }

    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode) {
      alert('Shipping address is incomplete. Please go back and fill it.');
      navigate('/shipping');
      return;
    }

    setLoading(true);

    // Simulate payment processing for 3 seconds
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
            paymentMethod,
          }),
        });

        if (response.ok) {
          clearCart();
          navigate('/success');
        } else {
          const errorData = await response.json();
          alert(`Payment failed: ${errorData.message || 'Unknown error'}`);
        }
      } catch (error) {
        alert('Error processing payment');
      } finally {
        setLoading(false);
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-4 h-4 mr-1">💳</span>
              Step 3 of 4
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Cart</span>
              <span className="text-sm font-medium text-gray-700">Shipping</span>
              <span className="text-sm font-medium text-gray-700">Payment</span>
              <span className="text-sm font-medium text-gray-700">Confirmation</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-amazon-orange h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Form */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-amazon-orange focus:ring-amazon-orange border-gray-300"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-900">UPI Payment</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-amazon-orange focus:ring-amazon-orange border-gray-300"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-900">Credit/Debit Card</span>
                  </label>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {paymentMethod === 'upi' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Bank
                      </label>
                      <select
                        value={bank}
                        onChange={(e) => setBank(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amazon-orange focus:border-transparent"
                        required
                      >
                        <option value="">Choose a bank</option>
                        <option value="SBI">State Bank of India (SBI)</option>
                        <option value="HDFC">HDFC Bank</option>
                        <option value="ICICI">ICICI Bank</option>
                        <option value="Axis">Axis Bank</option>
                        <option value="PNB">Punjab National Bank</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        UPI ID
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amazon-orange focus:border-transparent"
                        placeholder="user@upi"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        6-Digit PIN
                      </label>
                      <input
                        type="password"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amazon-orange focus:border-transparent"
                        placeholder="123456"
                        maxLength="6"
                        required
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amazon-orange focus:border-transparent"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amazon-orange focus:border-transparent"
                          placeholder="MM/YY"
                          maxLength="5"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="password"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amazon-orange focus:border-transparent"
                          placeholder="123"
                          maxLength="3"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amazon-orange focus:border-transparent"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => navigate('/shipping')}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Back to Shipping
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-amazon-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing Payment...' : `Pay ₹${totalPrice.toLocaleString()}`}
                  </button>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h4>
                        <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">₹{(item.price * item.qty).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">₹{(totalPrice * 0.18).toFixed(0)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-amazon-orange">₹{(totalPrice + totalPrice * 0.18).toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
                <div className="text-sm text-gray-600">
                  <p>{shippingAddress.address}</p>
                  <p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
                  <p>{shippingAddress.country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
