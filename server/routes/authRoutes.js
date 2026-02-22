const express = require('express');
const { login, register } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', login);

// Only 'admin' or 'developer' can register new staff.
// (Middleware automatically grants 'developer' access)
router.post('/register', protect, authorize('admin'), register);

module.exports = router;