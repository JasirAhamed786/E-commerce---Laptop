import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Star, Filter, Grid, List, SlidersHorizontal, ShoppingCart, Heart, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ShopPage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({
    ram: '',
    brand: '',
    priceRange: '',
    usage: searchParams.get('usage') || ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, filters, sortBy, searchTerm]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://192.168.176.185:5000/api/products');
      const data = await response.json();
      // Debugging log to see if image links exist
      if (data.length > 0) console.log('First Product Image:', data[0].image); 
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply filters
    if (filters.ram) {
      filtered = filtered.filter(product => product.specs.ram === filters.ram);
    }
    if (filters.brand) {
      filtered = filtered.filter(product => product.brand.toLowerCase().includes(filters.brand.toLowerCase()));
    }
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(product => product.price >= min && product.price <= max);
    }
    if (filters.usage) {
      filtered = filtered.filter(product => product.usageCategory.includes(filters.usage));
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        // Assuming all products have same rating for now
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      ram: '',
      brand: '',
      priceRange: '',
      usage: ''
    });
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amazon-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  const ramOptions = ['8GB', '16GB', '32GB', '64GB'];
  const brandOptions = ['Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'MSI'];
  const priceRanges = [
    { label: 'Under ₹50,000', value: '0-50000' },
    { label: '₹50,000 - ₹80,000', value: '50000-80000' },
    { label: '₹80,000 - ₹1,20,000', value: '80000-120000' },
    { label: 'Over ₹1,20,000', value: '120000-999999' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-amazon-blue">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900 font-medium">Shop</span>
            {filters.usage && (
              <>
                <span className="mx-2">›</span>
                <span className="text-gray-900 font-medium">{filters.usage} Laptops</span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center">
                  <SlidersHorizontal className="w-5 h-5 mr-2" />
                  Filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-amazon-blue hover:underline"
                >
                  Clear All
                </button>
              </div>

              {/* Usage Category */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Usage Category</h4>
                <div className="space-y-2">
                  {['Gaming', 'Coding', 'Office', 'Student'].map((usage) => (
                    <label key={usage} className="flex items-center">
                      <input
                        type="radio"
                        name="usage"
                        value={usage}
                        checked={filters.usage === usage}
                        onChange={(e) => handleFilterChange('usage', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">{usage}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* RAM Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">RAM</h4>
                <div className="space-y-2">
                  {ramOptions.map((ram) => (
                    <label key={ram} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.ram === ram}
                        onChange={(e) => handleFilterChange('ram', filters.ram === ram ? '' : ram)}
                        className="mr-2"
                      />
                      <span className="text-sm">{ram}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Brand</h4>
                <div className="space-y-2">
                  {brandOptions.map((brand) => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.brand === brand}
                        onChange={(e) => handleFilterChange('brand', filters.brand === brand ? '' : brand)}
                        className="mr-2"
                      />
                      <span className="text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label key={range.value} className="flex items-center">
                      <input
                        type="radio"
                        name="priceRange"
                        value={range.value}
                        checked={filters.priceRange === range.value}
                        onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {filters.usage ? `${filters.usage} Laptops` : 'All Laptops'}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {filteredProducts.length} products found
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Search */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border border-gray-300 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amazon-blue focus:border-transparent w-80"
                    />
                  </div>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amazon-blue"
                  >
                    <option value="relevance">Sort by: Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                    <option value="newest">Newest First</option>
                  </select>

                  {/* View Mode */}
                  <div className="flex border border-gray-300 rounded">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-amazon-blue text-white' : 'text-gray-600'}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-amazon-blue text-white' : 'text-gray-600'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mobile Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center px-3 py-2 border border-gray-300 rounded text-sm"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            <div className={`${
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-4'
            }`}>
              {filteredProducts.map((product) => (
                <div key={product._id} className="card bg-white p-4 hover:shadow-lg transition-shadow border border-gray-100 rounded-xl">
                  <Link to={`/product/${product._id}`}>
                    {/* --- THE FIX IS HERE --- */}
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/300?text=No+Image";
                      }}
                      className={`w-full object-cover rounded-lg mb-4 ${
                        viewMode === 'grid' ? 'h-48' : 'h-32'
                      }`}
                    />
                    {/* ----------------------- */}

                    <div className={viewMode === 'list' ? 'flex gap-6' : ''}>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{product.brand}</p>

                        {/* Rating */}
                        <div className="flex items-center mb-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 ml-2">(4.5)</span>
                        </div>

                        {/* Usage Categories */}
                        <div className="flex flex-wrap gap-1 mb-3">
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
                        <p className="text-2xl font-bold text-amazon-orange mb-3">
                          ₹{product.price.toLocaleString()}
                        </p>

                        {/* Key Specs */}
                        {product.specs && (
                            <div className="text-sm text-gray-600 space-y-1">
                            <p>RAM: {product.specs.ram}</p>
                            <p>Storage: {product.specs.storage}</p>
                            </div>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      Add to Cart
                    </button>
                    <button className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                      <Heart size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* No Products Found */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">No products found matching your criteria.</p>
                <button
                  onClick={clearFilters}
                  className="bg-amazon-blue text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;