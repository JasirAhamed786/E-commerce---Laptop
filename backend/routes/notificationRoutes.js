const express = require('express');
const router = express.Router();
const {
  getAdminNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  createSystemNotification,
} = require('../controllers/notificationController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/admin').get(protect, admin, getAdminNotifications);
router.route('/unread-count').get(protect, admin, getUnreadCount);
router.route('/:id/read').put(protect, admin, markAsRead);
router.route('/read-all').put(protect, admin, markAllAsRead);
router.route('/system').post(protect, admin, createSystemNotification);

module.exports = router;
