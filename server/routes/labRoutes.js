const express = require('express');
const { getPendingLabs, updateLabResult } = require('../controllers/labController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Get Pending Worklist
router.get('/pending', protect, authorize('lab', 'admin', 'developer'), getPendingLabs);

// Submit Result
router.put('/update/:prescriptionId', protect, authorize('lab', 'developer'), updateLabResult);

module.exports = router;