import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowLeft, HeartHandshake, Star } from 'lucide-react';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = async (product) => {
    await addToCart(product);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-amazon-orange">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900 font-medium">My Wishlist</span>
          </nav>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Heart className="w-8 h-8 text-red-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <span className="ml-4 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
              {wishlist.length} item{wishlist.length !== 1 ? 's' : ''}
            </span>
          </div>
          <Link
            to="/shop"
            className="text-amazon-orange hover:text-orange-600 font-medium flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Continue Shopping
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <HeartHandshake className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">Save items you love for later. Start shopping and add items to your wishlist!</p>
            <Link
              to="/shop"
              className="inline-flex items-center px-8 py-3 bg-amazon-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="relative">
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={product.image || '/placeholder.jpg'}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/300?text=No+Image";
                      }}
                    />
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors group"
                    title="Remove from wishlist"
                  >
                    <Heart className="w-4 h-4 text-red-500 fill-current group-hover:text-red-600" />
                  </button>
                </div>

                <div className="p-4">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-amazon-orange transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mb-2">{product.brand}</p>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">(4.5)</span>
                  </div>

                  {/* Usage Categories */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {product.usageCategory && product.usageCategory.slice(0, 2).map((category) => (
                      <span
                        key={category}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {category}
                      </span>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-amazon-orange">
                      ₹{product.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      M.R.P.: <span className="line-through">₹{(product.price * 1.2).toLocaleString()}</span>
                      <span className="text-green-600 ml-2">(17% off)</span>
                    </p>
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.stock > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm ${
                        product.stock > 0
                          ? 'bg-amazon-orange text-white hover:bg-orange-600'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>

                    <Link
                      to={`/product/${product._id}`}
                      className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center block text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Wishlist Stats */}
        {wishlist.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Wishlist Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-amazon-orange mb-2">{wishlist.length}</div>
                <div className="text-sm text-gray-600">Items in Wishlist</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {wishlist.filter(item => item.stock > 0).length}
                </div>
                <div className="text-sm text-gray-600">Available in Stock</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  ₹{wishlist.reduce((total, item) => total + item.price, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Value</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
