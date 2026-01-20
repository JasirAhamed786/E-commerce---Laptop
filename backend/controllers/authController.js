const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        address: user.address,
        preferences: user.preferences,
        profilePicture: user.profilePicture,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        address: user.address,
        preferences: user.preferences,
        profilePicture: user.profilePicture,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
      if (req.body.dateOfBirth !== undefined && req.body.dateOfBirth !== '') {
        user.dateOfBirth = new Date(req.body.dateOfBirth);
      } else if (req.body.dateOfBirth === '') {
        user.dateOfBirth = undefined;
      }
      user.gender = req.body.gender || user.gender;
      if (req.body.address) {
        user.address = user.address || {};
        user.address.street = req.body.address.street !== undefined && req.body.address.street !== '' ? req.body.address.street : (req.body.address.street === '' ? undefined : user.address.street);
        user.address.city = req.body.address.city !== undefined && req.body.address.city !== '' ? req.body.address.city : (req.body.address.city === '' ? undefined : user.address.city);
        user.address.state = req.body.address.state !== undefined && req.body.address.state !== '' ? req.body.address.state : (req.body.address.state === '' ? undefined : user.address.state);
        user.address.zipCode = req.body.address.zipCode !== undefined && req.body.address.zipCode !== '' ? req.body.address.zipCode : (req.body.address.zipCode === '' ? undefined : user.address.zipCode);
        user.address.country = req.body.address.country !== undefined && req.body.address.country !== '' ? req.body.address.country : (req.body.address.country === '' ? undefined : user.address.country);
      }
      if (req.body.preferences) {
        user.preferences = user.preferences || {};
        user.preferences.newsletter = req.body.preferences.newsletter !== undefined ? req.body.preferences.newsletter : user.preferences.newsletter;
        user.preferences.notifications = req.body.preferences.notifications !== undefined ? req.body.preferences.notifications : user.preferences.notifications;
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        dateOfBirth: updatedUser.dateOfBirth,
        gender: updatedUser.gender,
        address: updatedUser.address,
        preferences: updatedUser.preferences,
        profilePicture: updatedUser.profilePicture,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
