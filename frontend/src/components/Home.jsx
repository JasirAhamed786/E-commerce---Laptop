import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Laptop, Shirt, BookOpen, Armchair, Headphones, Gift } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Strip */}
      <div className="bg-white border-b border-gray-200 py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-8 overflow-x-auto">
            <CategoryItem icon={Laptop} label="Laptops" />
            <CategoryItem icon={Smartphone} label="Mobiles" />
            <CategoryItem icon={Headphones} label="Audio" />
            <CategoryItem icon={BookOpen} label="Books" />
            <CategoryItem icon={Shirt} label="Fashion" />
            <CategoryItem icon={Armchair} label="Furniture" />
            <CategoryItem icon={Gift} label="Gifts" />
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-black to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-white">
              Welcome to Campus Store
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100 leading-relaxed">
              Discover premium products for your academic journey. Quality gadgets, fashion, and essentials at unbeatable prices.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Shop Now →
            </Link>
          </div>
        </div>
      </div>

      {/* Best Deals */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Best Deals</h2>
              <p className="text-gray-600 mt-2">Limited time offers on premium products</p>
            </div>
            <Link
              to="/shop"
              className="text-orange-600 hover:text-orange-700 font-semibold text-sm md:text-base flex items-center transition-colors"
            >
              View All <span className="ml-1">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <ProductCard
              image="https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=300"
              name="Dell XPS 13"
              price="₹45,000"
              originalPrice="₹65,000"
              discount="30%"
            />
            <ProductCard
              image="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300"
              name="Nothing Phone 1"
              price="₹18,000"
              originalPrice="₹25,000"
              discount="28%"
            />
            <ProductCard
              image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300"
              name="Sony WH-1000XM4"
              price="₹12,000"
              originalPrice="₹18,000"
              discount="33%"
            />
            <ProductCard
              image="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300"
              name="Lenovo Tab P11"
              price="₹15,500"
              originalPrice="₹22,000"
              discount="30%"
            />
            <ProductCard
              image="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300"              name="Apple Watch SE"
              price="₹14,999"
              originalPrice="₹20,000"
              discount="25%"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CategoryCard
              title="Electronics"
              subtitle="Latest gadgets & accessories"
              image="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400"
            />
            <CategoryCard
              title="Fashion"
              subtitle="Trendy clothes & accessories"
              image="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400"
            />
            <CategoryCard
              title="Home & Living"
              subtitle="Everything for your home"
              image="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryItem = ({ icon: Icon, label }) => (
  <Link
    to={`/shop?category=${label.toLowerCase()}`}
    className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
  >
    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-orange-50 transition-colors">
      <Icon className="w-6 h-6 text-gray-600 group-hover:text-orange-600 transition-colors" />
    </div>
    <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors">
      {label}
    </span>
  </Link>
);

const ProductCard = ({ image, name, price, originalPrice, discount }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
    <div className="relative mb-4">
      <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      {discount && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          {discount} OFF
        </span>
      )}
    </div>
    <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">{name}</h3>
    <div className="flex items-center gap-2 mb-2">
      <span className="text-lg font-bold text-orange-600">{price}</span>
      {originalPrice && (
        <span className="text-sm text-gray-500 line-through">{originalPrice}</span>
      )}
    </div>
    <div className="flex items-center justify-between text-xs">
      <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
        In Stock
      </span>
      <span className="text-gray-500 font-medium">⭐ 4.5</span>
    </div>
  </div>
);

const CategoryCard = ({ title, subtitle, image }) => (
  <Link
    to="/shop"
    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 block text-center group"
  >
    <div className="w-20 h-20 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-orange-50 transition-colors">
      <img
        src={image}
        alt={title}
        className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-200"
      />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
      {title}
    </h3>
    <p className="text-gray-600 text-sm">{subtitle}</p>
  </Link>
);

export default Home;
