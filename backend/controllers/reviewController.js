const Review = require('../models/reviewModel');
const Product = require('../models/productModel');

// @desc    Get reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a review
// @route   POST /api/products/:productId/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.productId;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Check if user has purchased this product
    const Order = require('../models/orderModel');
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      'orderItems.product': productId,
      status: { $in: ['Delivered'] },
      isPaid: true,
    });

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      comment,
      isVerifiedPurchase: !!hasPurchased,
    });

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name');

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();
    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews (admin)
// @route   GET /api/reviews
// @access  Private/Admin
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('product', 'name')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get average rating for a product
// @route   GET /api/products/:productId/reviews/average
// @access  Public
const getAverageRating = async (req, res) => {
  try {
    const result = await Review.aggregate([
      { $match: { product: req.params.productId } },
      {
        $group: {
          _id: '$product',
          averageRating: { $avg: '$rating' },
          numReviews: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return res.json({ averageRating: 0, numReviews: 0 });
    }

    res.json({
      averageRating: Math.round(result[0].averageRating * 10) / 10,
      numReviews: result[0].numReviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProductReviews,
  createReview,
  deleteReview,
  getAllReviews,
  getAverageRating,
};
