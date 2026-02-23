const Order = require('../models/orderModel');
const { createOrderNotification } = require('./notificationController');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    } else {
      const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        totalPrice,
      });

      const createdOrder = await order.save();

      // Create notification for admins
      await createOrderNotification(createdOrder._id);

      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders/admin
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Request order cancellation
// @route   PUT /api/orders/:id/cancel
// @access  Private
const requestCancellation = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if order can be cancelled
    if (order.isCancelled) {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }

    if (order.status === 'Delivered') {
      return res.status(400).json({ message: 'Cannot cancel delivered orders' });
    }

    if (order.status === 'Shipped') {
      return res.status(400).json({ message: 'Cannot cancel shipped orders. Please contact support.' });
    }

    // Update cancellation fields
    order.cancellationReason = reason || 'No reason provided';
    order.cancellationRequestedAt = new Date();
    order.isCancelled = true;
    order.cancelledAt = new Date();
    order.status = 'Cancelled';
    
    // Set refund status to pending if order was paid
    if (order.isPaid) {
      order.refundStatus = 'pending';
      order.refundAmount = order.totalPrice;
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel individual item in order
// @route   PUT /api/orders/:id/item/:itemId/cancel
// @access  Private
const cancelOrderItem = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if order can have items cancelled
    if (order.status === 'Delivered') {
      return res.status(400).json({ message: 'Cannot cancel items in delivered orders' });
    }

    if (order.status === 'Shipped') {
      return res.status(400).json({ message: 'Cannot cancel items in shipped orders. Please contact support.' });
    }

    // Find the item
    const itemIndex = order.orderItems.findIndex(
      item => item._id.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in order' });
    }

    const orderItem = order.orderItems[itemIndex];

    // Check if item is already cancelled
    if (orderItem.isCancelled) {
      return res.status(400).json({ message: 'Item is already cancelled' });
    }

    // Cancel the item
    orderItem.isCancelled = true;
    orderItem.cancellationReason = reason || 'No reason provided';
    orderItem.cancelledAt = new Date();
    orderItem.refundStatus = order.isPaid ? 'pending' : 'none';
    orderItem.refundAmount = orderItem.price * orderItem.qty;

    // Recalculate order totals
    const activeItems = order.orderItems.filter(item => !item.isCancelled);
    const newTotal = activeItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    order.totalPrice = newTotal;

    // Check if all items are cancelled - then cancel the whole order
    const allCancelled = order.orderItems.every(item => item.isCancelled);
    if (allCancelled) {
      order.isCancelled = true;
      order.cancellationReason = 'All items cancelled';
      order.cancellationRequestedAt = new Date();
      order.cancelledAt = new Date();
      order.status = 'Cancelled';
      if (order.isPaid) {
        order.refundStatus = 'pending';
        order.refundAmount = newTotal;
      }
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Process refund
// @route   PUT /api/orders/:id/refund
// @access  Private/Admin
const processRefund = async (req, res) => {
  try {
    const { action, rejectReason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!order.isCancelled) {
      return res.status(400).json({ message: 'Order is not cancelled' });
    }

    if (order.refundStatus === 'processed') {
      return res.status(400).json({ message: 'Refund already processed' });
    }

    if (action === 'reject') {
      order.refundStatus = 'rejected';
      order.refundAmount = 0;
    } else {
      order.refundStatus = 'processed';
      order.refundedAt = new Date();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Process individual item refund
// @route   PUT /api/orders/:id/item/:itemId/refund
// @access  Private/Admin
const processItemRefund = async (req, res) => {
  try {
    const { action, rejectReason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const itemIndex = order.orderItems.findIndex(
      item => item._id.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in order' });
    }

    const orderItem = order.orderItems[itemIndex];

    if (!orderItem.isCancelled) {
      return res.status(400).json({ message: 'Item is not cancelled' });
    }

    if (action === 'reject') {
      orderItem.refundStatus = 'rejected';
      orderItem.refundAmount = 0;
    } else {
      orderItem.refundStatus = 'processed';
    }

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  requestCancellation,
  cancelOrderItem,
  processRefund,
  processItemRefund,
};
