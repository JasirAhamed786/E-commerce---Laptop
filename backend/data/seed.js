const mongoose = require('mongoose');
const Product = require('../models/productModel');

const brands = ['Dell', 'HP', 'Lenovo', 'Asus', 'Apple', 'Acer', 'Samsung', 'Sony', 'Microsoft', 'Google'];
const categories = ['Laptop', 'Mobile', 'Headphone', 'Tablet', 'Smartwatch', 'Gaming Console'];
const suffixes = ['X1', 'Y2', 'Z3', 'Pro', 'Ultra', 'Max', 'Air', 'Book', 'Pad', 'Watch'];

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
    'Tablet': [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
      'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=500',
      'https://images.unsplash.com/photo-1561154464-7a27d24a4421?w=500',
      'https://images.unsplash.com/photo-1584006682522-dc17d6c0d9ac?w=500',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
      'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=500',
      'https://images.unsplash.com/photo-1561154464-7a27d24a4421?w=500'
    ],
    'Smartwatch': [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500',
      'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500',
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500',
      'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500',
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500'
    ],
    'Gaming Console': [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500',
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500',
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500',
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500',
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500',
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500',
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500'
    ]
  };
  const categoryImages = imageUrls[category] || imageUrls['Smartwatch'];
  return categoryImages[Math.floor(Math.random() * categoryImages.length)];
};

const getDescription = (name, category, brand) => {
  const descriptions = {
    'Laptop': `${brand} ${name} is a powerful ${category.toLowerCase()} designed for productivity and performance. Featuring advanced specifications and sleek design, it's perfect for work, gaming, or everyday use.`,
    'Mobile': `Experience the latest in mobile technology with the ${brand} ${name}. This smartphone offers cutting-edge features, stunning camera capabilities, and seamless performance.`,
    'Headphone': `Immerse yourself in high-quality audio with the ${brand} ${name}. These headphones deliver exceptional sound quality and comfort for music lovers and professionals.`,
    'Tablet': `The ${brand} ${name} combines portability with power. Perfect for work, entertainment, and creativity on the go.`,
    'Smartwatch': `Stay connected and track your fitness with the ${brand} ${name}. This smartwatch offers health monitoring, notifications, and style.`,
    'Gaming Console': `Elevate your gaming experience with the ${brand} ${name}. Featuring powerful hardware and immersive gameplay for gamers of all levels.`
  };
  return descriptions[category] || `${brand} ${name} is a high-quality ${category.toLowerCase()} with excellent features and performance.`;
};

const getUsageCategories = (category) => {
  const usageMap = {
    'Laptop': ['Gaming', 'Coding', 'Office', 'Student'],
    'Mobile': ['Gaming', 'Student'],
    'Headphone': ['Gaming', 'Coding', 'Student'],
    'Tablet': ['Student', 'Office'],
    'Smartwatch': ['Student', 'Office'],
    'Gaming Console': ['Gaming']
  };
  return usageMap[category] || ['Student'];
};

const getSpecs = (category) => {
  const baseSpecs = {
    processor: category === 'Laptop' ? 'Intel Core i5' : category === 'Mobile' ? 'Snapdragon 8 Gen 2' : 'Various',
    ram: `${(Math.floor(Math.random() * 4) + 1) * 4}GB`,
    storage: `${(Math.floor(Math.random() * 4) + 1) * 128}GB SSD`,
    screenSize: category === 'Laptop' ? '15.6 inches' : category === 'Mobile' ? '6.5 inches' : category === 'Tablet' ? '10.5 inches' : 'N/A',
    battery: category === 'Laptop' ? '8 hours' : category === 'Mobile' ? '4500mAh' : category === 'Tablet' ? '8000mAh' : 'N/A',
    graphicsCard: category === 'Laptop' ? 'NVIDIA GTX 1650' : 'Integrated'
  };
  return baseSpecs;
};

const generateProducts = () => {
  const products = [];
  for (let i = 1; i <= 100; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const name = `${brand} ${category} ${suffix}`;
    const price = Math.floor(Math.random() * 100000) + 10000; // Random price between 10k and 110k

    products.push({
      name,
      price,
      brand,
      category,
      imageURL: getImageUrl(category),
      description: getDescription(name, category, brand),
      stock: Math.floor(Math.random() * 50) + 10, // Random stock between 10-60
      specs: getSpecs(category),
      usageCategory: getUsageCategories(category)
    });
  }
  return products;
};

const products = generateProducts();

const seedProducts = async () => {
  try {
    await Product.deleteMany(); // Clear existing products
    await Product.insertMany(products);
    console.log('100 products seeded successfully');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

module.exports = seedProducts;
