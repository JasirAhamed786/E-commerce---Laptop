const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getCart).post(protect, addToCart).delete(protect, clearCart);
router.route('/:id').put(protect, updateCartItem).delete(protect, removeFromCart);
