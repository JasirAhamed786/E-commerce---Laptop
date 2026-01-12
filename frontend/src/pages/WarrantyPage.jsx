import React from 'react';

const WarrantyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Warranty Information</h1>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto">
            Comprehensive warranty coverage for your peace of mind
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Warranty Commitment</h2>
            <p className="text-gray-700 mb-6">
              At Campus Store, we stand behind every product we sell. All items come with manufacturer warranty
              coverage, and we provide additional support to ensure your satisfaction.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Manufacturer Warranty Coverage</h2>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Laptops & Computers</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• 1-3 year manufacturer warranty</li>
                  <li>• Hardware defects coverage</li>
                  <li>• Technical support included</li>
                  <li>• Parts and labor covered</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Mobile Devices</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• 1-2 year manufacturer warranty</li>
                  <li>• Screen and hardware protection</li>
                  <li>• Battery performance guarantee</li>
                  <li>• Software support included</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Accessories</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• 6-12 month warranty coverage</li>
                  <li>• Manufacturing defects</li>
                  <li>• Compatibility issues</li>
                  <li>• Performance guarantees</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Extended Protection</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Optional extended warranty</li>
                  <li>• Accidental damage coverage</li>
                  <li>• Theft and loss protection</li>
                  <li>• Priority support access</li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">What is Covered</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-8">
              <li>Manufacturing defects and hardware failures</li>
              <li>Normal wear and tear (within specified periods)</li>
              <li>Software issues related to hardware</li>
              <li>Compatibility problems with standard configurations</li>
              <li>Power supply and charging issues</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">What is Not Covered</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-8">
              <li>Physical damage from accidents, drops, or misuse</li>
              <li>Liquid damage or water exposure</li>
              <li>Unauthorized modifications or repairs</li>
              <li>Normal battery degradation over time</li>
              <li>Cosmetic damage that doesn't affect functionality</li>
              <li>Software issues not related to hardware defects</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">How to File a Warranty Claim</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <ol className="list-decimal list-inside text-gray-700 space-y-3">
                <li>Contact our customer service team with your order details</li>
                <li>Provide proof of purchase and describe the issue</li>
                <li>We'll guide you through the manufacturer's warranty process</li>
                <li>Ship the item to the designated service center (if required)</li>
                <li>Receive repair, replacement, or refund based on warranty terms</li>
              </ol>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg">
              <h3 className="text-xl font-semibold text-orange-800 mb-2">Campus Store Support</h3>
              <p className="text-orange-700 mb-4">
                Beyond manufacturer warranties, we provide additional support and assistance for all our customers.
              </p>
              <div className="text-orange-700">
                <p><strong>Email:</strong> warranty@campusstore.com</p>
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

export default WarrantyPage;
