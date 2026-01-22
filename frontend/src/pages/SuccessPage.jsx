import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SuccessPage = () => {
  const [showTrackButton, setShowTrackButton] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Play success sound
    const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-3.mp3');
    audio.play();

    // Show track order button after 3 seconds
    const timer = setTimeout(() => {
      setShowTrackButton(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleTrackOrder = () => {
    navigate('/orders');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100"
          >
            <svg className="h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Order Placed Successfully!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>
        <div>
          {showTrackButton ? (
            <button
              onClick={handleTrackOrder}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Track My Order
            </button>
          ) : (
            <Link
              to="/"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Continue Shopping
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
