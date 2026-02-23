const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, requestCancellation, cancelOrderItem, processRefund, processItemRefund } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/admin').get(protect, admin, getAllOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.route('/:id/cancel').put(protect, requestCancellation);
router.route('/:id/item/:itemId/cancel').put(protect, cancelOrderItem);
router.route('/:id/refund').put(protect, admin, processRefund);
router.route('/:id/item/:itemId/refund').put(protect, admin, processItemRefund);
router.route('/:id').get(protect, getOrderById);

module.exports = router;
