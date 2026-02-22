const express = require('express');
const { getStats, getAllUsers, deleteUser, updateUser } = require('../controllers/adminController'); // Import updateUser
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/stats', protect, authorize('admin'), getStats);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

// 🆕 NEW ROUTE: Update/Reset Credentials
router.put('/users/:id', protect, authorize('admin'), updateUser);

module.exports = router;