import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [animationData, setAnimationData] = useState(null);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, we'll just show success
      setIsSubscribed(true);
      setEmail('');
    } catch (err) {
      setError('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // --- UPDATED ANIMATION: "Tech & Laptop Shopping" ---
    // This animation depicts digital devices and tech, perfect for a laptop store.
    const animationUrl = "https://assets2.lottiefiles.com/packages/lf20_w51pcehl.json"; 
    
    // Alternative Option (Man working on Laptop): 
    // "https://assets8.lottiefiles.com/packages/lf20_49rdyysj.json"

    fetch(animationUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch animation");
        return res.json();
      })
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Animation failed to load:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-gray-900 via-slate-800 to-black py-20 relative overflow-hidden">

        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-500/5 skew-x-12 transform origin-top-right"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col-reverse lg:flex-row gap-12 items-center justify-between">
            
            {/* Left: Text Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white tracking-tight">
                Upgrade Your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                  Tech Arsenal
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Power your studies with high-performance laptops. The exclusive tech marketplace for students.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/shop"
                  className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-1"
                >
                  Shop Laptops
                </Link>
                <Link
                  to="/shop?category=mobile"
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold text-lg transition-all backdrop-blur-sm"
                >
                  View Mobiles
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 text-sm text-gray-400 font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Official Warranty
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Student Discounts
                </div>
              </div>
            </div>

            {/* Right: Tech Lottie Animation */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-orange-500/10 blur-3xl rounded-full"></div>
              
              <div className="w-full max-w-lg relative z-10">
                {animationData ? (
                  <Lottie
                    animationData={animationData}
                    loop={true}
                    autoplay={true}
                    className="w-full h-auto drop-shadow-2xl"
                  />
                ) : (
                  // Elegant Loading Skeleton
                  <div className="aspect-square w-full max-w-md bg-white/5 rounded-3xl animate-pulse flex flex-col items-center justify-center border border-white/10">
                     <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                     <span className="text-gray-400 font-medium">Loading Tech...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Categories & Products Sections */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Trending Laptops</h2>
              <p className="text-gray-500 mt-1">High performance machines for coding & gaming</p>
            </div>
            <Link to="/shop" className="text-orange-600 font-semibold hover:underline">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
             {/* Static Preview Cards */}
            <ProductCard
              image="https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=300"
              name="Dell XPS 15"
              price="₹1,45,000"
              originalPrice="₹1,85,000"
              discount="22%"
            />
            <ProductCard
              image="https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300"
              name="MacBook Air M2"
              price="₹1,14,900"
              originalPrice="₹1,29,900"
              discount="12%"
            />
             <ProductCard
              image="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300"
              name="Lenovo Legion 5"
              price="₹89,990"
              originalPrice="₹1,15,000"
              discount="22%"
            />
             <ProductCard
              image="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300"
              name="HP Omen 16"
              price="₹1,05,000"
              originalPrice="₹1,35,000"
              discount="22%"
            />
            <ProductCard
              image="https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=300"
              name="ASUS ROG Strix"
              price="₹1,25,000"
              originalPrice="₹1,55,000"
              discount="19%"
            />

            <ProductCard
              image="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300"
              name="MSI Creator Z16"
              price="₹1,85,000"
              originalPrice="₹2,15,000"
              discount="14%"
            />
            <ProductCard
              image="https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=300"
              name="Samsung Galaxy Book"
              price="₹75,000"
              originalPrice="₹95,000"
              discount="21%"
            />
            <ProductCard
              image="https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300"
              name="MacBook Pro M3"
              price="₹1,99,000"
              originalPrice="₹2,29,000"
              discount="13%"
            />
            <ProductCard
              image="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300"
              name="HP Pavilion"
              price="₹65,000"
              originalPrice="₹85,000"
              discount="24%"
            />
            <ProductCard
              image="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300"
              name="Lenovo ThinkPad"
              price="₹85,000"
              originalPrice="₹1,05,000"
              discount="19%"
            />
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-orange-500">Campus Store</h3>
              <p className="text-gray-300 leading-relaxed">
                Your trusted destination for premium tech products. Empowering students with the latest gadgets and accessories.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.749.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.012.017z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.253 14.894 3.762 13.743 3.762 12.446s.49-2.448 1.364-3.323c.875-.875 2.026-1.365 3.323-1.365s2.448.49 3.323 1.365c.875.875 1.365 2.026 1.365 3.323s-.49 2.448-1.365 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718 0c-.905 0-1.741-.234-2.477-.702.645-.905 1.041-2.007 1.041-3.231s-.396-2.326-1.041-3.231c.736-.468 1.572-.702 2.477-.702s1.741.234 2.477.702c-.645.905-1.041 2.007-1.041 3.231s.396 2.326 1.041 3.231c-.736.468-1.572.702-2.477.702z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/shop" className="text-gray-300 hover:text-orange-500 transition-colors">Shop All</Link></li>
                <li><Link to="/shop?category=laptop" className="text-gray-300 hover:text-orange-500 transition-colors">Laptops</Link></li>
                <li><Link to="/shop?category=mobile" className="text-gray-300 hover:text-orange-500 transition-colors">Mobiles</Link></li>
                <li><Link to="/shop?category=accessories" className="text-gray-300 hover:text-orange-500 transition-colors">Accessories</Link></li>
                <li><Link to="/about" className="text-gray-300 hover:text-orange-500 transition-colors">About Us</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Customer Service</h4>
              <ul className="space-y-2">
                <li><Link to="/contact" className="text-gray-300 hover:text-orange-500 transition-colors">Contact Us</Link></li>
                <li><Link to="/shipping-info" className="text-gray-300 hover:text-orange-500 transition-colors">Shipping Info</Link></li>
                <li><Link to="/returns-exchanges" className="text-gray-300 hover:text-orange-500 transition-colors">Returns & Exchanges</Link></li>
                <li><Link to="/warranty" className="text-gray-300 hover:text-orange-500 transition-colors">Warranty</Link></li>
                <li><Link to="/faq" className="text-gray-300 hover:text-orange-500 transition-colors">FAQ</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Stay Updated</h4>
              <p className="text-gray-300 text-sm">Get the latest deals and tech updates</p>

              {isSubscribed ? (
                <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-400 font-medium">Successfully subscribed!</span>
                  </div>
                  <p className="text-green-300 text-sm mt-1">Thank you for subscribing. You'll receive our latest updates soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="flex">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-500 disabled:cursor-not-allowed text-white rounded-r-lg transition-colors flex items-center justify-center min-w-[100px]"
                    >
                      {isLoading ? (
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        'Subscribe'
                      )}
                    </button>
                  </div>

                  {error && (
                    <p className="text-red-400 text-sm flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{error}</span>
                    </p>
                  )}

                  <p className="text-xs text-gray-400">
                    By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 Campus Store. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

// Internal ProductCard Component
const ProductCard = ({ image, name, price, originalPrice, discount }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105 transform">
    <div className="relative mb-6">
      <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden shadow-sm">
        <img
          src={image}
          alt={name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      {discount && (
        <span className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
          {discount} OFF
        </span>
      )}
    </div>
    <h3 className="text-base font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight">{name}</h3>
    <div className="flex items-center gap-3 mb-3">
      <span className="text-xl font-bold text-orange-600">{price}</span>
      {originalPrice && (
        <span className="text-base text-gray-500 line-through">{originalPrice}</span>
      )}
    </div>
    <div className="flex items-center justify-between">
      <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full font-semibold text-sm shadow-sm">
        In Stock
      </span>
      <span className="text-gray-500 font-semibold text-sm flex items-center">
        <span className="mr-1">⭐</span> 4.5
      </span>
    </div>
  </div>
);
