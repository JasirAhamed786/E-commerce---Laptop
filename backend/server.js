const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // <--- 1. Import CORS (Critical!)
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();
connectDB();

const app = express();

// --- 2. Enable CORS (Must be before routes) ---
app.use(cors()); 
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// --- 3. Set Port to 5000 to match your Frontend code ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));