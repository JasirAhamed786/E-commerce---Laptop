import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="mb-8">
            <Link to="/" className="text-orange-600 hover:text-orange-700 font-medium mb-4 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-gray-600">Last updated: December 2024</p>
          </div>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using DormDeals Student Marketplace ("the Service"), you accept and agree to be bound by
                the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
              <p className="text-gray-700 mb-4">
                Permission is granted to temporarily access the materials (information or software) on DormDeals website
                for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title,
                and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
                <li>attempt to decompile or reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
              <p className="text-gray-700 mb-4">
                When you create an account with us, you must provide information that is accurate, complete, and current
                at all times. You are responsible for safeguarding the password and for all activities that occur under
                your account. You agree not to disclose your password to any third party.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Products and Pricing</h2>
              <p className="text-gray-700 mb-4">
                All products are subject to availability. We reserve the right to discontinue any product or change
                pricing at any time without notice. Prices are subject to change without notice. We strive to display
                accurate price information, but errors may occur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Orders and Payment</h2>
              <p className="text-gray-700 mb-4">
                All orders are subject to acceptance and availability. Payment must be received in full before order
                processing begins. We accept major credit cards and other payment methods as indicated on our website.
                You represent and warrant that you have the legal right to use any card(s) or other payment method(s)
                utilized in connection with any purchase.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Shipping and Delivery</h2>
              <p className="text-gray-700 mb-4">
                We will make reasonable efforts to deliver products within the estimated timeframe indicated at checkout.
                However, delivery dates are estimates only and we are not liable for delays caused by factors beyond our control.
                Risk of loss passes to the buyer upon delivery to the carrier.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Returns and Refunds</h2>
              <p className="text-gray-700 mb-4">
                Items may be returned within 30 days of purchase for a full refund, provided they are in original condition
                and packaging. Return shipping costs may apply. Refunds will be processed within 5-7 business days after
                receipt of returned items. For more details, please see our <Link to="/returns-exchanges" className="text-orange-600 hover:text-orange-700">Returns & Exchanges</Link> policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                In no event shall DormDeals or its suppliers be liable for any damages (including, without limitation,
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability
                to use the materials on our website, even if DormDeals or our authorized representative has been notified
                orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These terms and conditions are governed by and construed in accordance with the laws of [Your Jurisdiction],
                and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">Email: legal@dormdeals.com</p>
                <p className="text-gray-700">Phone: 1-800-DORM-DEALS</p>
                <p className="text-gray-700">Address: 123 Campus Drive, College Town, ST 12345</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
