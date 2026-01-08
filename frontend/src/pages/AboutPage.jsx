import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Campus Store</h1>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto">
            Empowering students with premium tech products and exceptional service
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-700 mb-6">
              Campus Store was founded with a simple mission: to provide students with access to high-quality
              technology products at competitive prices. We understand the challenges students face in balancing
              academics, extracurricular activities, and personal life, and we believe that the right tools can
              make a significant difference.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Premium Laptops</h3>
                <p className="text-gray-700">
                  From coding to gaming, our curated selection of laptops ensures you have the power
                  and performance needed for any task.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Mobile Devices</h3>
                <p className="text-gray-700">
                  Stay connected with the latest smartphones and tablets designed for modern students.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Accessories</h3>
                <p className="text-gray-700">
                  Complete your setup with essential accessories like cases, chargers, and peripherals.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Student Discounts</h3>
                <p className="text-gray-700">
                  Exclusive pricing and special offers available to verified students.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Commitment</h2>
            <p className="text-gray-700 mb-6">
              We are committed to providing exceptional customer service, fast shipping, and comprehensive
              warranty coverage. Every product comes with official manufacturer warranty and our own
              satisfaction guarantee.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Us?</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-8">
              <li>Curated selection of premium tech products</li>
              <li>Competitive student pricing</li>
              <li>Official warranty on all products</li>
              <li>Fast and reliable shipping</li>
              <li>Expert customer support</li>
              <li>Easy returns and exchanges</li>
            </ul>

            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg">
              <h3 className="text-xl font-semibold text-orange-800 mb-2">Student-Focused</h3>
              <p className="text-orange-700">
                Campus Store is more than just a retailer – we're your technology partner in education.
                Join thousands of students who trust us for their tech needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
