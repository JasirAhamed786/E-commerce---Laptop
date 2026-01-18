import React from 'react';
import { Link } from 'react-router-dom';

const CookiePolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="mb-8">
            <Link to="/" className="text-orange-600 hover:text-orange-700 font-medium mb-4 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
            <p className="text-gray-600">Last updated: December 2024</p>
          </div>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Are Cookies</h2>
              <p className="text-gray-700 mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you visit our website.
                They allow us to remember your preferences, analyze website traffic, and provide personalized content.
                Cookies help us improve your browsing experience and provide relevant information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Cookies</h2>
              <p className="text-gray-700 mb-4">We use cookies for the following purposes:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li><strong>Essential Cookies:</strong> Required for the website to function properly, such as remembering your login status and shopping cart contents.</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website by collecting anonymous information.</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences and settings to enhance your experience.</li>
                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and track the effectiveness of our marketing campaigns.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Types of Cookies We Use</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Cookie Type</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Purpose</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Session Cookies</td>
                      <td className="border border-gray-300 px-4 py-2">Maintain your session while browsing</td>
                      <td className="border border-gray-300 px-4 py-2">Until you close your browser</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">Persistent Cookies</td>
                      <td className="border border-gray-300 px-4 py-2">Remember your preferences</td>
                      <td className="border border-gray-300 px-4 py-2">Up to 2 years</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Third-party Cookies</td>
                      <td className="border border-gray-300 px-4 py-2">Analytics and advertising</td>
                      <td className="border border-gray-300 px-4 py-2">Varies by provider</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Managing Cookies</h2>
              <p className="text-gray-700 mb-4">
                You can control and manage cookies in various ways. Most web browsers allow you to control cookies through
                their settings preferences. However, disabling cookies may affect the functionality of our website.
              </p>
              <p className="text-gray-700 mb-4">To manage cookies:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Access your browser's cookie settings</li>
                <li>Delete existing cookies</li>
                <li>Block cookies from specific websites</li>
                <li>Block all cookies</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Please note that if you choose to block all cookies, you may not be able to access certain parts of our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Cookies</h2>
              <p className="text-gray-700 mb-4">
                Some cookies on our website are set by third-party services that appear on our pages. We have no control
                over these cookies, and they are subject to the respective third party's privacy policy. These include:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Google Analytics (for website analytics)</li>
                <li>Social media plugins (for sharing functionality)</li>
                <li>Payment processors (for secure transactions)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Updates to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other
                operational, legal, or regulatory reasons. We will notify you of any material changes by posting the
                updated policy on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">Email: privacy@dormdeals.com</p>
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

export default CookiePolicyPage;
