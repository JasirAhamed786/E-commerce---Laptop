import React, { useState } from 'react';

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I place an order?",
      answer: "To place an order, browse our products, add items to your cart, and proceed to checkout. You'll need to create an account or log in, provide shipping information, and complete payment. Orders are processed within 1-2 business days."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, UPI, net banking, and digital wallets like Paytm, Google Pay, and PhonePe. All payments are processed securely through encrypted channels."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days within India. Express shipping (1-2 days) is available for select locations. International shipping takes 7-14 days depending on the destination. You'll receive tracking information once your order ships."
    },
    {
      question: "Do you offer student discounts?",
      answer: "Yes! We offer exclusive student discounts on all products. To access student pricing, you'll need to verify your student status during account registration or at checkout. Valid student ID or university email is required for verification."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive an email with tracking information and a link to track your package. You can also check your order status by logging into your account and viewing your order history."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Products must be in original condition and packaging. Some items like custom-configured laptops or opened software may not be eligible for return. Contact our customer service team to initiate a return."
    },
    {
      question: "Do products come with warranty?",
      answer: "Yes, all products come with manufacturer warranty. Laptops and computers typically have 1-3 year warranties, while accessories have 6-12 month coverage. We also provide additional Campus Store support beyond manufacturer warranties."
    },
    {
      question: "Can I exchange my product?",
      answer: "Exchanges are available within 30 days of purchase for the same or different products. If exchanging for a more expensive item, you'll need to pay the price difference. Contact our customer service team to arrange an exchange."
    },
    {
      question: "Are the products genuine and authentic?",
      answer: "Absolutely! We only sell 100% genuine products directly from authorized distributors. All items come with original manufacturer packaging, documentation, and warranty cards. We provide authenticity certificates for high-value items."
    },
    {
      question: "Do you provide technical support?",
      answer: "Yes, we offer comprehensive technical support for all products. Our team of experts can help with setup, troubleshooting, software installation, and optimization. Premium support plans are available for extended assistance."
    },
    {
      question: "Can I cancel my order?",
      answer: "Orders can be cancelled within 24 hours of placement if they haven't been processed yet. Contact our customer service team immediately. Once an order is processed or shipped, cancellation may not be possible, but you can return it instead."
    },
    {
      question: "Do you offer bulk or institutional discounts?",
      answer: "Yes, we provide special pricing for bulk orders and educational institutions. Contact our sales team at sales@campusstore.com or call 1-800-CAMPUS for customized quotes and institutional pricing."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto">
            Find answers to common questions about our products, services, and policies
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {faqs.map((faq, index) => (
              <div key={index} className="p-6">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center text-left focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset rounded-lg p-2 hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <span className="text-orange-600 text-xl flex-shrink-0">
                    {openIndex === index ? '−' : '+'}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="mt-4 text-gray-700 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg">
          <h3 className="text-xl font-semibold text-orange-800 mb-2">Still have questions?</h3>
          <p className="text-orange-700 mb-4">
            Can't find the answer you're looking for? Our customer service team is here to help!
          </p>
          <div className="text-orange-700 space-y-1">
            <p><strong>Email:</strong> support@campusstore.com</p>
            <p><strong>Phone:</strong> 1-800-CAMPUS (1-800-226-787)</p>
            <p><strong>Hours:</strong> Monday-Friday, 9 AM - 6 PM EST</p>
            <p><strong>Live Chat:</strong> Available on our website during business hours</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
