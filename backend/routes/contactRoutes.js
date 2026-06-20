const express = require('express');
const router = express.Router();

const { createContact, getAdminContacts } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(createContact);
router.route('/admin').get(protect, admin, getAdminContacts);

module.exports = router;

