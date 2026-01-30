const User = require('../models/userModel');
const Product = require('../models/productModel');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    if (user) {
      res.json(user.cart);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add product to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, qty = 1 } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if product is already in cart
    const existingItem = user.cart.find(item => item.product.toString() === productId);

    if (existingItem) {
      // Update quantity
      existingItem.qty += qty;
    } else {
      // Add new item
      user.cart.push({ product: productId, qty });
    }

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('cart.product');
    res.status(201).json(updatedUser.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const productId = req.params.id;
    const { qty } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the cart item
    const cartItem = user.cart.find(item => item.product.toString() === productId);

    if (!cartItem) {
      return res.status(404).json({ message: 'Product not in cart' });
    }

    if (qty <= 0) {
      // Remove item if quantity is 0 or less
      user.cart = user.cart.filter(item => item.product.toString() !== productId);
    } else {
      cartItem.qty = qty;
    }

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('cart.product');
    res.json(updatedUser.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove product from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const productId = req.params.id;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if product is in cart
    const itemIndex = user.cart.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Product not in cart' });
    }

    user.cart.splice(itemIndex, 1);
    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('cart.product');
    res.json(updatedUser.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.cart = [];
    await user.save();

    res.json([]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
