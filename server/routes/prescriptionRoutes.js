const express = require('express');
const { createPrescription, getPrescriptions } = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('doctor', 'developer'), createPrescription);
router.get('/:patientId', protect, authorize('doctor', 'admin', 'developer'), getPrescriptions);

module.exports = router;