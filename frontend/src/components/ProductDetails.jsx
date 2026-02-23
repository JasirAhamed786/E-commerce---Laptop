import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Heart, Share2, Truck, Shield, RefreshCw, Award, Send, ThumbsUp } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [numReviews, setNumReviews] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
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

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const [reviewsRes, ratingRes] = await Promise.all([
        fetch(`/api/products/${id}/reviews`),
        fetch(`/api/products/${id}/reviews/average`)
      ]);
      
      const reviewsData = await reviewsRes.json();
      const ratingData = await ratingRes.json();
      
      setReviews(reviewsData || []);
      setAverageRating(ratingData.averageRating || 0);
      setNumReviews(ratingData.numReviews || 0);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }
    if (!newReview.comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await fetch(`/api/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newReview),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Review submitted successfully!');
        setShowReviewForm(false);
        setNewReview({ rating: 5, comment: '' });
        fetchReviews();
      } else {
        toast.error(data.message || 'Failed to submit review');
      }
    } catch (error) {
      toast.error('Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'} focus:outline-none`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
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
          <Link to="/shop" className="btn-primary inline-block">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const images = [product.image || '/placeholder.jpg'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-orange-600">Home</Link>
            <span className="mx-2">›</span>
            <Link to="/shop" className="hover:text-orange-600">Shop</Link>
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
                      selectedImage === index ? 'border-orange-600' : 'border-gray-300'
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
                    <Star key={i} className={`w-5 h-5 ${i < Math.round(averageRating) ? 'fill-current' : ''}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({averageRating.toFixed(1)}) • {numReviews} review{numReviews !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <p className="text-4xl font-bold text-orange-600">
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
                    className="bg-orange-600 bg-opacity-10 text-orange-600 px-3 py-1 rounded-full text-sm font-medium"
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
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600"
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
                    ? 'bg-orange-600 hover:bg-orange-700 text-white'
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
                  className={`py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center border ${
                    isInWishlist(product._id) 
                      ? 'bg-red-100 text-red-600 border-red-200 hover:bg-red-200' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
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
                      try {
                        await navigator.clipboard.writeText(window.location.href);
                        alert('Product link copied to clipboard!');
                      } catch (error) {
                        console.log('Error copying to clipboard:', error);
                      }
                    }
                  }}
                  className="py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Truck className="w-5 h-5 text-orange-600 mr-2" />
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
              <h4 className="font-semibold text-orange-600 mb-2">Processor</h4>
              <p className="text-gray-700">{product.specs.processor}</p>
            </div>
            <div className="border-b pb-4">
              <h4 className="font-semibold text-orange-600 mb-2">RAM</h4>
              <p className="text-gray-700">{product.specs.ram}</p>
            </div>
            <div className="border-b pb-4">
              <h4 className="font-semibold text-orange-600 mb-2">Storage</h4>
              <p className="text-gray-700">{product.specs.storage}</p>
            </div>
            <div className="border-b pb-4">
              <h4 className="font-semibold text-orange-600 mb-2">Screen Size</h4>
              <p className="text-gray-700">{product.specs.screenSize}</p>
            </div>
            <div className="border-b pb-4">
              <h4 className="font-semibold text-orange-600 mb-2">Battery</h4>
              <p className="text-gray-700">{product.specs.battery}</p>
            </div>
            <div className="border-b pb-4">
              <h4 className="font-semibold text-orange-600 mb-2">Graphics Card</h4>
              <p className="text-gray-700">{product.specs.graphicsCard}</p>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
            <button
              onClick={() => {
                if (!user) {
                  toast.error('Please login to write a review');
                  return;
                }
                setShowReviewForm(!showReviewForm);
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <Send className="w-4 h-4 mr-2" />
              Write a Review
            </button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    rows="4"
                    placeholder="Share your experience with this product..."
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReviewForm(false);
                      setNewReview({ rating: 5, comment: '' });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews Summary */}
          {numReviews > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-900 mr-2">{averageRating.toFixed(1)}</span>
                <div>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.round(averageRating) ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{numReviews} review{numReviews !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>
          )}

          {/* Reviews List */}
          {reviewsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b pb-6">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-semibold text-orange-600">
                        {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">
                        {review.user?.name || 'Anonymous'}
                      </span>
                      {review.isVerifiedPurchase && (
                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          ✓ Verified Purchase
                        </span>
                      )}
                    </div>
                    <span className="ml-auto text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
