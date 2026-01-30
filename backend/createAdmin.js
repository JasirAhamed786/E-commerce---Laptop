const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const createAdminUser = async () => {
  try {
    const adminEmail = 'jasir@gmail.com';
    const adminPassword = '111111';
    const adminName = 'JAS';

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Email:', existingAdmin.email);
      console.log('Name:', existingAdmin.name);
      console.log('Is Admin:', existingAdmin.isAdmin);
      process.exit(0);
    }

    // Create new admin user
    const adminUser = new User({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      isAdmin: true,
    });

    await adminUser.save();

    console.log('Admin user created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('Name:', adminName);
    console.log('Is Admin: true');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();
