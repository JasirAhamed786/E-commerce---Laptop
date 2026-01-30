const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // <--- 1. Import CORS (Critical!)
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');

dotenv.config();
console.log('JWT_SECRET loaded:', process.env.JWT_SECRET ? 'Yes' : 'No');
connectDB();

const app = express();

// --- 2. Enable CORS (Must be before routes) ---
app.use(cors()); 
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/uploads', express.static('uploads'));

// --- 3. Set Port to 5000 to match your Frontend code ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
