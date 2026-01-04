const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require('../controllers/authController');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private routes (would need auth middleware)
// router.get('/profile', protect, getUserProfile);

module.exports = router;
