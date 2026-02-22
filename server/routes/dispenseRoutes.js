const express = require('express');
const { dispenseMedicines, searchPendingPrescriptions } = require('../controllers/dispenseController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/search', protect, authorize('pharmacist', 'admin', 'developer'), searchPendingPrescriptions);
router.post('/', protect, authorize('pharmacist', 'developer'), dispenseMedicines);

module.exports = router;