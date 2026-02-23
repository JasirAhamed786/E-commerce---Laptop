import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Heart, Share2, Truck, Shield, RefreshCw, Award } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductDetails = () => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Scroll to top only when product data is loaded
  useEffect(() => {
    if (product) {
      window.scrollTo(0, 0);
    }
  }, [product]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) {
        throw new Error('Product not found');
      }
      const data = await response.json();
      setProduct(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amazon-orange mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">Error: {error}</div>
          <Link
            to="/shop"
            className="btn-primary inline-block"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const images = [product.image || '/placeholder.jpg']; // Add more images if available

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-amazon-orange">Home</Link>
            <span className="mx-2">›</span>
            <Link to="/shop" className="hover:text-amazon-orange">Shop</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            {images.length > 1 && (
              <div className="flex space-x-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-amazon-orange' : 'border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{product.brand}</p>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4.5) • 1,234 reviews</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <p className="text-4xl font-bold text-amazon-orange">
                  ₹{product.price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  M.R.P.: <span className="line-through">₹{(product.price * 1.2).toLocaleString()}</span>
                  <span className="text-green-600 ml-2">(17% off)</span>
                </p>
                <p className="text-sm text-gray-600">Inclusive of all taxes</p>
              </div>
            </div>

            {/* Usage Categories */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Best for</h3>
              <div className="flex flex-wrap gap-2">
                {product.usageCategory.map((category) => (
                  <span
                    key={category}
                    className="bg-amazon-orange bg-opacity-10 text-amazon-orange px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.stock > 0
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.stock > 0 ? '✓ In Stock' : '✗ Out of Stock'}
              </span>
              {product.stock > 0 && (
                <span className="text-sm text-gray-600">
                  Only {product.stock} left in stock
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amazon-orange"
                >
                  {[...Array(Math.min(10, product.stock))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => addToCart({ ...product, qty: quantity })}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                  product.stock > 0
                    ? 'btn-primary'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    if (isInWishlist(product._id)) {
                      removeFromWishlist(product._id);
                    } else {
                      addToWishlist(product);
                    }
                  }}
                  className={`btn-secondary flex items-center justify-center ${
                    isInWishlist(product._id) ? 'bg-red-100 text-red-600 hover:bg-red-200' : ''
                  }`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                  {isInWishlist(product._id) ? 'In Wishlist' : 'Wishlist'}
                </button>
                <button
                  onClick={async () => {
                    const shareData = {
                      title: product.name,
                      text: `Check out this ${product.brand} ${product.name} for ₹${product.price.toLocaleString()}`,
                      url: window.location.href
                    };

                    if (navigator.share) {
                      try {
                        await navigator.share(shareData);
                      } catch (error) {
                        console.log('Error sharing:', error);
                      }
                    } else {
                      // Fallback to clipboard
                      try {
                        await navigator.clipboard.writeText(window.location.href);
                        alert('Product link copied to clipboard!');
                      } catch (error) {
                        console.log('Error copying to clipboard:', error);
                        alert('Unable to share. Please copy the URL manually.');
                      }
                    }
                  }}
                  className="btn-secondary flex items-center justify-center"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Truck className="w-5 h-5 text-amazon-orange mr-2" />
                <span className="font-medium">Free Delivery</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Get free delivery on orders over ₹499. Standard delivery in 3-5 business days.
              </p>
              <div className="flex items-center text-sm text-gray-600">
                <RefreshCw className="w-4 h-4 mr-1" />
                30-day return policy
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6">Technical Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border-b pb-4">
              <h4 className="font-semibold text-amazon-orange mb-2">Processor</h4>
              <p className="text-gray-700">{product.specs.processor}</p>
            </div>
            <div className="border-b pb-4">
              <h4 className="font-semibold text-amazon-orange mb-2">RAM</h4>
              <p className="text-gray-700">{product.specs.ram}</p>
            </div>
            <div className="border-b pb-4">
              <h4 className="font-semibold text-amazon-orange mb-2">Storage</h4>
              <p className="text-gray-700">{product.specs.storage}</p>
            </div>
            <div className="border-b pb-4">
              <h4 className="font-semibold text-amazon-orange mb-2">Screen Size</h4>
              <p className="text-gray-700">{product.specs.screenSize}</p>
            </div>
            <div className="border-b pb-4">
              <h4 className="font-semibold text-amazon-orange mb-2">Battery</h4>
              <p className="text-gray-700">{product.specs.battery}</p>
            </div>
            <div className="border-b pb-4">
              <h4 className="font-semibold text-amazon-orange mb-2">Graphics Card</h4>
              <p className="text-gray-700">{product.specs.graphicsCard}</p>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="space-y-6">
            {/* Sample Reviews */}
            <div className="border-b pb-6">
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="font-medium">Great laptop for gaming!</span>
              </div>
              <p className="text-gray-600 text-sm mb-2">By John Doe on December 15, 2023</p>
              <p className="text-gray-700">
                Excellent performance and build quality. Perfect for gaming and daily use.
                Highly recommended!
              </p>
            </div>

            <div className="border-b pb-6">
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                  <Star className="w-4 h-4 text-gray-300" />
                </div>
                <span className="font-medium">Good value for money</span>
              </div>
              <p className="text-gray-600 text-sm mb-2">By Jane Smith on December 10, 2023</p>
              <p className="text-gray-700">
                Solid performance for coding and development work. Battery life could be better,
                but overall satisfied with the purchase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
