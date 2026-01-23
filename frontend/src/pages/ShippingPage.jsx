import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { MapPin, Truck, Shield, Check } from 'lucide-react';

const ShippingPage = () => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [useProfileAddress, setUseProfileAddress] = useState(false);
  const { saveShippingAddress } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (useProfileAddress && user?.address) {
      setAddress(user.address.street || '');
      setCity(user.address.city || '');
      setPostalCode(user.address.zipCode || '');
      setCountry(user.address.country || 'India');
    } else if (!useProfileAddress) {
      setAddress('');
      setCity('');
      setPostalCode('');
      setCountry('India');
    }
  }, [useProfileAddress, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    saveShippingAddress({ address, city, postalCode, country });
    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Shipping Address</h1>
            <div className="flex items-center text-sm text-gray-600">
              <Truck className="w-4 h-4 mr-1" />
              Step 2 of 4
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Cart</span>
              <span className="text-sm font-medium text-gray-700">Shipping</span>
              <span className="text-sm font-medium text-gray-700">Payment</span>
              <span className="text-sm font-medium text-gray-700">Confirmation</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-amazon-orange h-2 rounded-full" style={{ width: '50%' }}></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-6">
              <MapPin className="w-6 h-6 text-amazon-orange mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Delivery Address</h2>
            </div>

            {/* Use Profile Address Option */}
            {user?.address && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useProfileAddress}
                    onChange={(e) => setUseProfileAddress(e.target.checked)}
                    className="h-4 w-4 text-amazon-orange focus:ring-amazon-orange border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    Use my profile address
                  </span>
                </label>
                <p className="ml-7 mt-1 text-sm text-gray-600">
                  {user.address.street}, {user.address.city}, {user.address.state} {user.address.zipCode}, {user.address.country}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={useProfileAddress}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amazon-orange focus:border-transparent transition-colors ${
                      useProfileAddress ? 'bg-gray-50 cursor-not-allowed' : ''
                    }`}
                    placeholder="123 Main Street, Apartment 4B"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={useProfileAddress}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amazon-blue focus:border-transparent transition-colors ${
                      useProfileAddress ? 'bg-gray-50 cursor-not-allowed' : ''
                    }`}
                    placeholder="Mumbai"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    disabled={useProfileAddress}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amazon-orange focus:border-transparent transition-colors ${
                      useProfileAddress ? 'bg-gray-50 cursor-not-allowed' : ''
                    }`}
                    placeholder="400001"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    disabled={useProfileAddress}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amazon-orange focus:border-transparent transition-colors ${
                      useProfileAddress ? 'bg-gray-50 cursor-not-allowed' : ''
                    }`}
                    required
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Truck className="w-5 h-5 text-amazon-orange mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Standard Delivery</h4>
                    <p className="text-sm text-gray-600">
                      Free delivery on orders over ₹499. Estimated delivery: 3-5 business days.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-orange-50 transition-colors font-medium"
                >
                  Back to Cart
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-amazon-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  Continue to Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
