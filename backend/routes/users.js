const express = require('express');
const router = express.Router();
const { getMe, updateMe } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/me').get(protect, getMe).put(protect, updateMe);

module.exports = router; 