const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDB = require('./config/db');
const Product = require('./models/productModel'); // Make sure this path is correct for your setup

dotenv.config();

const brands = ['Dell', 'HP', 'Apple', 'Samsung', 'Lenovo', 'Asus', 'Sony', 'Microsoft'];
const categories = ['Laptop', 'Mobile', 'Headphone', 'Watch'];
const namePrefixes = ['Pro Gaming', 'Slim Ultrabook', 'Business', 'Student', 'Premium', 'Budget', 'Flagship', 'Compact'];
const nameSuffixes = ['X', 'Y', 'Z', 'Pro', 'Ultra', 'Max', 'Air', 'Book', 'Pad', 'Watch'];

const getImageUrl = (category) => {
  const imageUrls = {
    'Laptop': [
      'https://via.placeholder.com/500x300/4a90e2/ffffff?text=Laptop',
      'https://via.placeholder.com/500x300/50e3c2/ffffff?text=Laptop',
      'https://via.placeholder.com/500x300/f5a623/ffffff?text=Laptop',
      'https://via.placeholder.com/500x300/d0021b/ffffff?text=Laptop',
      'https://via.placeholder.com/500x300/9013fe/ffffff?text=Laptop',
      'https://via.placeholder.com/500x300/7ed321/ffffff?text=Laptop',
      'https://via.placeholder.com/500x300/b8e986/ffffff?text=Laptop',
      'https://via.placeholder.com/500x300/417505/ffffff?text=Laptop'
    ],
    'Mobile': [
      'https://via.placeholder.com/500x300/e74c3c/ffffff?text=Mobile',
      'https://via.placeholder.com/500x300/9b59b6/ffffff?text=Mobile',
      'https://via.placeholder.com/500x300/1abc9c/ffffff?text=Mobile',
      'https://via.placeholder.com/500x300/34495e/ffffff?text=Mobile',
      'https://via.placeholder.com/500x300/16a085/ffffff?text=Mobile',
      'https://via.placeholder.com/500x300/27ae60/ffffff?text=Mobile',
      'https://via.placeholder.com/500x300/2980b9/ffffff?text=Mobile',
      'https://via.placeholder.com/500x300/8e44ad/ffffff?text=Mobile'
    ],
    'Headphone': [
      'https://via.placeholder.com/500x300/e67e22/ffffff?text=Headphone',
      'https://via.placeholder.com/500x300/f39c12/ffffff?text=Headphone',
      'https://via.placeholder.com/500x300/d35400/ffffff?text=Headphone',
      'https://via.placeholder.com/500x300/c0392b/ffffff?text=Headphone',
      'https://via.placeholder.com/500x300/e74c3c/ffffff?text=Headphone',
      'https://via.placeholder.com/500x300/9b59b6/ffffff?text=Headphone',
      'https://via.placeholder.com/500x300/1abc9c/ffffff?text=Headphone',
      'https://via.placeholder.com/500x300/34495e/ffffff?text=Headphone'
    ],
    'Watch': [
      'https://via.placeholder.com/500x300/16a085/ffffff?text=Smartwatch',
      'https://via.placeholder.com/500x300/27ae60/ffffff?text=Smartwatch',
      'https://via.placeholder.com/500x300/2980b9/ffffff?text=Smartwatch',
      'https://via.placeholder.com/500x300/8e44ad/ffffff?text=Smartwatch',
      'https://via.placeholder.com/500x300/e67e22/ffffff?text=Smartwatch',
      'https://via.placeholder.com/500x300/f39c12/ffffff?text=Smartwatch',
      'https://via.placeholder.com/500x300/d35400/ffffff?text=Smartwatch',
      'https://via.placeholder.com/500x300/c0392b/ffffff?text=Smartwatch'
    ]
  };
  const categoryImages = imageUrls[category] || imageUrls['Watch'];
  return categoryImages[Math.floor(Math.random() * categoryImages.length)];
};

const getDescription = (name, category, brand) => {
  const descriptions = {
    'Laptop': `${brand} ${name} is a powerful ${category.toLowerCase()} designed for productivity and performance. Featuring advanced specifications and sleek design, it's perfect for work, gaming, or everyday use.`,
    'Mobile': `Experience the latest in mobile technology with the ${brand} ${name}. This smartphone offers cutting-edge features, stunning camera capabilities, and seamless performance.`,
    'Headphone': `Immerse yourself in high-quality audio with the ${brand} ${name}. These headphones deliver exceptional sound quality and comfort for music lovers and professionals.`,
    'Watch': `Stay connected and track your fitness with the ${brand} ${name}. This smartwatch offers health monitoring, notifications, and style.`,
  };
  return descriptions[category] || `${brand} ${name} is a high-quality ${category.toLowerCase()} with excellent features and performance.`;
};

const getUsageCategories = (category) => {
  const usageMap = {
    'Laptop': ['Gaming', 'Coding', 'Office', 'Student'],
    'Mobile': ['Gaming', 'Student'],
    'Headphone': ['Gaming', 'Coding', 'Student'],
    'Watch': ['Student', 'Office'],
  };
  return usageMap[category] || ['Student'];
};

const generateProducts = () => {
  const products = [];
  for (let i = 1; i <= 100; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const prefix = namePrefixes[Math.floor(Math.random() * namePrefixes.length)];
    const suffix = nameSuffixes[Math.floor(Math.random() * nameSuffixes.length)];
    const name = `${brand} ${prefix} ${category} ${suffix}`;
    const price = Math.floor(Math.random() * 150000) + 5000;

    products.push({
      name,
      price,
      brand,
      category,
      image: getImageUrl(category),
      rating: (Math.random() * 2 + 3).toFixed(1),
      numReviews: Math.floor(Math.random() * 100),
      countInStock: Math.floor(Math.random() * 50),
      specs: {
        ram: category === 'Laptop' ? `${(Math.floor(Math.random() * 3) + 1) * 8}GB` : 'N/A',
        storage: category === 'Laptop' ? `${(Math.floor(Math.random() * 4) + 1) * 256}GB SSD` : 'N/A',
        processor: category === 'Laptop' ? ['Intel i5', 'Intel i7', 'Ryzen 5', 'Ryzen 7'][Math.floor(Math.random() * 4)] : 'N/A',
        screenSize: category === 'Laptop' ? 15.6 : 0,
        // --- ADDED THESE TO FIX VALIDATION ERROR ---
        graphicsCard: category === 'Laptop' ? 'Integrated Graphics' : 'N/A', 
        battery: '5000mAh' 
        // ------------------------------------------
      },
      usageCategory: getUsageCategories(category),
      description: getDescription(name, category, brand),
      stock: Math.floor(Math.random() * 50) + 10,
    });
  }
  return products;
};

const seedProducts = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database...'.cyan);

    // Clear existing products
    await Product.deleteMany();
    console.log('Existing products cleared...'.yellow);

    // Generate and insert new products
    const products = generateProducts();
    await Product.insertMany(products);

    console.log('✅ 100 products seeded successfully!'.green.bold);
    console.log('Seeding completed. Exiting...'.cyan);
    process.exit();
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`.red.bold);
    process.exit(1);
  }
};

// Run the seeder
if (require.main === module) {
  seedProducts();
}

module.exports = seedProducts;