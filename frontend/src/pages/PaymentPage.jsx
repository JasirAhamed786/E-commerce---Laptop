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
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { cartItems, totalPrice, clearCart, shippingAddress } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Validation functions
  const validateField = (name, value) => {
    switch (name) {
      case 'bank':
        if (paymentMethod === 'upi' && !value.trim()) return 'Please select a bank';
        return '';
      case 'upiId':
        if (paymentMethod === 'upi') {
          if (!value.trim()) return 'UPI ID is required';
          if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(value.trim())) return 'Please enter a valid UPI ID (e.g., user@upi)';
        }
        return '';
      case 'pin':
        if (paymentMethod === 'upi') {
          if (!value.trim()) return 'PIN is required';
          if (!/^\d{6}$/.test(value.trim())) return 'PIN must be exactly 6 digits';
        }
        return '';
      case 'cardNumber':
        if (paymentMethod === 'card') {
          if (!value.trim()) return 'Card number is required';
          const cleanNumber = value.replace(/\s/g, '');
          if (!/^\d{13,19}$/.test(cleanNumber)) return 'Please enter a valid card number (13-19 digits)';
          if (!luhnCheck(cleanNumber)) return 'Please enter a valid card number';
        }
        return '';
      case 'expiryDate':
        if (paymentMethod === 'card') {
          if (!value.trim()) return 'Expiry date is required';
          if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value.trim())) return 'Please enter a valid expiry date (MM/YY)';
          const [month, year] = value.split('/');
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear() % 100;
          const currentMonth = currentDate.getMonth() + 1;
          const expYear = parseInt(year);
          const expMonth = parseInt(month);
          if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
            return 'Card has expired';
          }
        }
        return '';
      case 'cvv':
        if (paymentMethod === 'card') {
          if (!value.trim()) return 'CVV is required';
          if (!/^\d{3,4}$/.test(value.trim())) return 'CVV must be 3 or 4 digits';
        }
        return '';
      case 'cardName':
        if (paymentMethod === 'card') {
          if (!value.trim()) return 'Cardholder name is required';
          if (value.trim().length < 2) return 'Cardholder name must be at least 2 characters';
          if (!/^[a-zA-Z\s]+$/.test(value.trim())) return 'Cardholder name should only contain letters';
        }
        return '';
      default:
        return '';
    }
  };

  // Luhn algorithm for card number validation
  const luhnCheck = (cardNumber) => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i));
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  const handleFieldChange = (name, value) => {
    switch (name) {
      case 'bank':
        setBank(value);
        break;
      case 'upiId':
        setUpiId(value);
        break;
      case 'pin':
        setPin(value);
        break;
      case 'cardNumber':
        // Format card number with spaces
        const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
        setCardNumber(formatted);
        break;
      case 'expiryDate':
        // Format expiry date
        let formattedExpiry = value.replace(/\D/g, '');
        if (formattedExpiry.length >= 2) {
          formattedExpiry = formattedExpiry.slice(0, 2) + '/' + formattedExpiry.slice(2, 4);
        }
        setExpiryDate(formattedExpiry);
        break;
      case 'cvv':
        setCvv(value.replace(/\D/g, ''));
        break;
      case 'cardName':
        setCardName(value);
        break;
    }

    // Validate field on change
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));

    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleFieldBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    let value;
    switch (name) {
      case 'bank': value = bank; break;
      case 'upiId': value = upiId; break;
      case 'pin': value = pin; break;
      case 'cardNumber': value = cardNumber; break;
      case 'expiryDate': value = expiryDate; break;
      case 'cvv': value = cvv; break;
      case 'cardName': value = cardName; break;
      default: value = '';
    }
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all relevant fields as touched
    const fieldsToValidate = paymentMethod === 'upi'
      ? ['bank', 'upiId', 'pin']
      : ['cardNumber', 'expiryDate', 'cvv', 'cardName'];

    const newTouched = {};
    fieldsToValidate.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(prev => ({ ...prev, ...newTouched }));

    // Validate all fields
    const newErrors = {};
    fieldsToValidate.forEach(field => {
      let value;
      switch (field) {
        case 'bank': value = bank; break;
        case 'upiId': value = upiId; break;
        case 'pin': value = pin; break;
        case 'cardNumber': value = cardNumber; break;
        case 'expiryDate': value = expiryDate; break;
        case 'cvv': value = cvv; break;
        case 'cardName': value = cardName; break;
      }
      newErrors[field] = validateField(field, value);
    });

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== '');

    if (hasErrors) {
      return;
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

        const response = await fetch('/api/orders', {
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
          {/* Checkout Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <span className="ml-2 text-sm font-medium text-gray-600">Cart</span>
              </div>
              <div className="w-16 h-px bg-amazon-orange"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <span className="ml-2 text-sm font-medium text-gray-600">Shipping</span>
              </div>
              <div className="w-16 h-px bg-amazon-orange"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-amazon-orange text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <span className="ml-2 text-sm font-medium text-amazon-orange">Payment</span>
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
                        onChange={(e) => handleFieldChange('bank', e.target.value)}
                        onBlur={() => handleFieldBlur('bank')}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amazon-orange focus:border-transparent ${touched.bank && errors.bank ? 'border-red-500' : 'border-gray-300'}`}
                        required
                      >
                        <option value="">Choose a bank</option>
                        <option value="SBI">State Bank of India (SBI)</option>
                        <option value="HDFC">HDFC Bank</option>
                        <option value="ICICI">ICICI Bank</option>
                        <option value="Axis">Axis Bank</option>
                        <option value="PNB">Punjab National Bank</option>
                      </select>
                      {touched.bank && errors.bank && (
                        <p className="mt-1 text-sm text-red-600">{errors.bank}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        UPI ID
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => handleFieldChange('upiId', e.target.value)}
                        onBlur={() => handleFieldBlur('upiId')}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amazon-orange focus:border-transparent ${touched.upiId && errors.upiId ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="user@upi"
                        required
                      />
                      {touched.upiId && errors.upiId && (
                        <p className="mt-1 text-sm text-red-600">{errors.upiId}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        6-Digit PIN
                      </label>
                      <input
                        type="password"
                        value={pin}
                        onChange={(e) => handleFieldChange('pin', e.target.value)}
                        onBlur={() => handleFieldBlur('pin')}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amazon-orange focus:border-transparent ${touched.pin && errors.pin ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="123456"
                        maxLength="6"
                        required
                      />
                      {touched.pin && errors.pin && (
                        <p className="mt-1 text-sm text-red-600">{errors.pin}</p>
                      )}
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
