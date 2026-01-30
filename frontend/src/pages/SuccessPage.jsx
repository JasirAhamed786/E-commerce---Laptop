import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SuccessPage = () => {
  const [showTrackButton, setShowTrackButton] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 🔊 Play Online Success Sound
    // Using a "Cash Register" / "Success" chime from a reliable CDN
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
    
    audio.volume = 0.5; // Set volume to 50% so it's not too loud
    
    // Play sound but handle browser autoplay restrictions
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("Audio played successfully");
        })
        .catch(error => {
          console.log("Audio playback failed (usually due to browser autoplay policy):", error);
        });
    }

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
    <div className="min-h-screen bg-gray-50">
      {/* Checkout Progress */}
      <div className="pt-8 pb-4">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-gray-600">Cart</span>
            </div>
            <div className="w-16 h-px bg-orange-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-gray-600">Shipping</span>
            </div>
            <div className="w-16 h-px bg-orange-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-gray-600">Payment</span>
            </div>
            <div className="w-16 h-px bg-orange-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                4
              </div>
              <span className="ml-2 text-sm font-medium text-orange-600">Confirmation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
    </div>
  );
};

export default SuccessPage;