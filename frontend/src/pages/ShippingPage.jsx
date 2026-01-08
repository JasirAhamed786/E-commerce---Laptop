import React from 'react';

const ShippingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Shipping Information</h1>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto">
            Fast, reliable delivery to get your tech in your hands quickly
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Shipping Options</h2>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Express Shipping</h3>
                    <p className="text-orange-600 font-bold">₹299</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">1-2 business days delivery</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Order tracking included</li>
                  <li>• Signature required</li>
                  <li>• Free for orders over ₹10,000</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Standard Shipping</h3>
                    <p className="text-blue-600 font-bold">₹149</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">3-5 business days delivery</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Order tracking included</li>
                  <li>• No signature required</li>
                  <li>• Free for orders over ₹5,000</li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Shipping Details</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Processing Time</h3>
                <p className="text-gray-700">
                  Orders are typically processed within 1-2 business days. During peak seasons or holidays,
                  processing may take up to 3 business days. You will receive an email confirmation with
                  tracking information once your order ships.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Delivery Areas</h3>
                <p className="text-gray-700 mb-4">
                  We currently ship to all major cities and towns across India. Remote areas may experience
                  slightly longer delivery times.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Major Cities (1-2 days):</h4>
                  <p className="text-gray-600">Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">International Shipping</h3>
                <p className="text-gray-700">
                  Currently, we only ship within India. International shipping options will be available soon.
                  Stay tuned for updates!
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Shipping Costs</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Orders under ₹1,000: ₹149 standard shipping</li>
                  <li>• Orders ₹1,000-₹5,000: ₹99 standard shipping</li>
                  <li>• Orders over ₹5,000: Free standard shipping</li>
                  <li>• Express shipping: ₹299 (free over ₹10,000)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Order Tracking</h3>
                <p className="text-gray-700">
                  Once your order ships, you'll receive a tracking number via email and SMS. You can also
                  track your order status in your account dashboard under "My Orders".
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Delivery Issues</h3>
                <p className="text-gray-700">
                  If you experience any issues with delivery, please contact our customer support team
                  immediately. We're here to help resolve any problems and ensure you receive your order.
                </p>
              </div>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg mt-8">
              <h3 className="text-xl font-semibold text-orange-800 mb-2">Need Help?</h3>
              <p className="text-orange-700 mb-4">
                Have questions about shipping? Our customer support team is available to assist you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/contact"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-200 text-center"
                >
                  Contact Support
                </a>
                <a
                  href="tel:+915551234567"
                  className="bg-white border border-orange-600 text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-orange-50 transition duration-200 text-center"
                >
                  Call Us: +91 555-123-4567
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
