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
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500',
      'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500',
      'https://images.unsplash.com/photo-1587614295999-6c1f4c4b98ea?w=500',
      'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=500',
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500'
    ],
    'Mobile': [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500',
      'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500',
      'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=500',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500'
    ],
    'Headphone': [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500',
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500',
      'https://images.unsplash.com/photo-1599669454699-248893623440?w=500'
    ],
    'Watch': [
     'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
      'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=500',
      'https://images.unsplash.com/photo-1561154464-7a27d24a4421?w=500',
      'https://images.unsplash.com/photo-1584006682522-dc17d6c0d9ac?w=500',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
      'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=500',
      'https://images.unsplash.com/photo-1561154464-7a27d24a4421?w=500'
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