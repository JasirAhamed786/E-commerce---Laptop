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
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
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

  // Validation functions
  const validateField = (name, value) => {
    switch (name) {
      case 'address':
        if (!value.trim()) return 'Street address is required';
        if (value.trim().length < 10) return 'Please enter a complete address';
        return '';
      case 'city':
        if (!value.trim()) return 'City is required';
        if (value.trim().length < 2) return 'City name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return 'City name should only contain letters';
        return '';
      case 'postalCode':
        if (!value.trim()) return 'Postal code is required';
        if (country === 'India') {
          if (!/^[1-9][0-9]{5}$/.test(value.trim())) return 'Please enter a valid 6-digit Indian postal code';
        } else {
          if (!/^[0-9]{5,10}$/.test(value.trim())) return 'Please enter a valid postal code';
        }
        return '';
      default:
        return '';
    }
  };

  const handleFieldChange = (name, value) => {
    switch (name) {
      case 'address':
        setAddress(value);
        break;
      case 'city':
        setCity(value);
        break;
      case 'postalCode':
        setPostalCode(value);
        break;
      case 'country':
        setCountry(value);
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
      case 'address': value = address; break;
      case 'city': value = city; break;
      case 'postalCode': value = postalCode; break;
      default: value = '';
    }
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      address: true,
      city: true,
      postalCode: true,
    });

    // Validate all fields
    const newErrors = {
      address: validateField('address', address),
      city: validateField('city', city),
      postalCode: validateField('postalCode', postalCode),
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== '');

    if (!hasErrors) {
      saveShippingAddress({ address, city, postalCode, country });
      navigate('/payment');
    }
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
                <div className="w-8 h-8 bg-amazon-orange text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <span className="ml-2 text-sm font-medium text-amazon-orange">Shipping</span>
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
                    onChange={(e) => handleFieldChange('address', e.target.value)}
                    onBlur={() => handleFieldBlur('address')}
                    disabled={useProfileAddress}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amazon-orange focus:border-transparent transition-colors ${
                      useProfileAddress ? 'bg-gray-50 cursor-not-allowed' : ''
                    } ${touched.address && errors.address ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="123 Main Street, Apartment 4B"
                    required
                  />
                  {touched.address && errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => handleFieldChange('city', e.target.value)}
                    onBlur={() => handleFieldBlur('city')}
                    disabled={useProfileAddress}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amazon-blue focus:border-transparent transition-colors ${
                      useProfileAddress ? 'bg-gray-50 cursor-not-allowed' : ''
                    } ${touched.city && errors.city ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Mumbai"
                    required
                  />
                  {touched.city && errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => handleFieldChange('postalCode', e.target.value)}
                    onBlur={() => handleFieldBlur('postalCode')}
                    disabled={useProfileAddress}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amazon-orange focus:border-transparent transition-colors ${
                      useProfileAddress ? 'bg-gray-50 cursor-not-allowed' : ''
                    } ${touched.postalCode && errors.postalCode ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="400001"
                    required
                  />
                  {touched.postalCode && errors.postalCode && (
                    <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
                  )}
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
