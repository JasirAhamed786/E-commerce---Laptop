const Notification = require('../models/notificationModel');
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// @desc    Get all notifications for admin
// @route   GET /api/notifications/admin
// @access  Private/Admin
const getAdminNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private/Admin
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (notification && notification.recipient.toString() === req.user._id.toString()) {
      notification.isRead = true;
      await notification.save();
      res.json(notification);
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private/Admin
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get unread count
// @route   GET /api/notifications/unread-count
// @access  Private/Admin
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create notification for new order
// @route   POST /api/notifications/order
// @access  Private
const createOrderNotification = async (orderId) => {
  try {
    const order = await Order.findById(orderId).populate('user', 'name');
    if (!order) return;

    // Find all admin users
    const admins = await User.find({ isAdmin: true });

    for (const admin of admins) {
      await Notification.create({
        title: 'New Order Received',
        message: `Order #${order._id.toString().slice(-8)} from ${order.user.name}`,
        type: 'order',
        recipient: admin._id,
        data: { orderId: order._id }
      });
    }
  } catch (error) {
    console.error('Error creating order notification:', error);
  }
};

// @desc    Create notification for low stock
// @route   POST /api/notifications/stock
// @access  Private
const createStockNotification = async (productId) => {
  try {
    const product = await Product.findById(productId);
    if (!product) return;

    // Find all admin users
    const admins = await User.find({ isAdmin: true });

    for (const admin of admins) {
      await Notification.create({
        title: 'Low Stock Alert',
        message: `${product.name} - Only ${product.countInStock} left`,
        type: 'stock',
        recipient: admin._id,
        data: { productId: product._id }
      });
    }
  } catch (error) {
    console.error('Error creating stock notification:', error);
  }
};

// @desc    Create system notification
// @route   POST /api/notifications/system
// @access  Private/Admin
const createSystemNotification = async (req, res) => {
  try {
    const { title, message, recipient } = req.body;

    const notification = await Notification.create({
      title,
      message,
      type: 'system',
      recipient: recipient || req.user._id,
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  createOrderNotification,
  createStockNotification,
  createSystemNotification,
};
