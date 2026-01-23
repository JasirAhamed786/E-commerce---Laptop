const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const resetAdminPassword = async () => {
  try {
    const adminEmail = 'jasir@example.com'; // Replace with your actual admin email

    const user = await User.findOne({ email: adminEmail });

    if (!user) {
      console.log('Admin user not found');
      process.exit(1);
    }

    user.password = '123456'; // This will be hashed by the pre('save') middleware
    await user.save();

    console.log('Admin password reset to 123456');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

resetAdminPassword();
