const express = require('express');
const { registerPatient, getPatients, updatePatient, deletePatient, revisitPatient } = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public/Protected Routes
router.route('/')
    .post(protect, authorize('reception', 'developer'), registerPatient)
    .get(protect, authorize('reception', 'doctor', 'admin', 'developer'), getPatients);

router.route('/:id')
    .put(protect, authorize('reception', 'developer'), updatePatient)
    .delete(protect, authorize('reception', 'developer'), deletePatient);

// 🆕 NEW Re-Visit Route
router.put('/:id/revisit', protect, authorize('reception', 'developer'), revisitPatient);

module.exports = router;