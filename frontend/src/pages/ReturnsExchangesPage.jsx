import React from 'react';

const ReturnsExchangesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Returns & Exchanges</h1>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto">
            Hassle-free returns and exchanges for your peace of mind
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Return Policy</h2>
            <p className="text-gray-700 mb-6">
              At Campus Store, we want you to be completely satisfied with your purchase. If you're not happy with your product,
              you can return it within 30 days of delivery for a full refund or exchange.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Eligibility for Returns</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-8">
              <li>Items must be returned within 30 days of delivery</li>
              <li>Products must be in original condition and packaging</li>
              <li>All accessories, manuals, and documentation must be included</li>
              <li>Items must not show signs of wear, damage, or misuse</li>
              <li>Custom or personalized items are not eligible for return</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Initiate a Return</h2>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 1: Contact Us</h3>
                <p className="text-gray-700">
                  Reach out to our customer service team via email or phone to start the return process.
                  Provide your order number and reason for return.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 2: Receive Return Label</h3>
                <p className="text-gray-700">
                  We'll provide you with a prepaid return shipping label and instructions for packaging.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 3: Ship the Item</h3>
                <p className="text-gray-700">
                  Pack the item securely and ship it back using the provided label within 7 days.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 4: Refund Processing</h3>
                <p className="text-gray-700">
                  Once received and inspected, we'll process your refund within 3-5 business days.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Exchange Policy</h2>
            <p className="text-gray-700 mb-6">
              If you wish to exchange your item for a different product, the same eligibility criteria apply.
              Exchanges are processed as a return followed by a new order. Shipping costs for exchanges may apply
              if the new item is more expensive.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Refund Methods</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-8">
              <li>Original payment method: 3-5 business days</li>
              <li>Store credit: Instant processing</li>
              <li>Gift cards: Instant processing</li>
            </ul>

            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg">
              <h3 className="text-xl font-semibold text-orange-800 mb-2">Need Help?</h3>
              <p className="text-orange-700 mb-4">
                Our customer service team is here to assist you with any questions about returns or exchanges.
              </p>
              <div className="text-orange-700">
                <p><strong>Email:</strong> returns@campusstore.com</p>
                <p><strong>Phone:</strong> 1-800-CAMPUS (1-800-226-787)</p>
                <p><strong>Hours:</strong> Monday-Friday, 9 AM - 6 PM EST</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsExchangesPage;
