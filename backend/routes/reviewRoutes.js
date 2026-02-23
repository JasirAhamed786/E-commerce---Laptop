const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  createReview,
  deleteReview,
  getAllReviews,
  getAverageRating,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/products/:productId/reviews', getProductReviews);
router.get('/products/:productId/reviews/average', getAverageRating);

// Protected routes
router.post('/products/:productId/reviews', protect, createReview);
router.delete('/reviews/:id', protect, deleteReview);

// Admin routes
router.get('/', protect, getAllReviews);

module.exports = router;
