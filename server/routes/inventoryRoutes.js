const express = require('express');
const { getInventory, addStock, deleteStock } = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// GET: Allowed for everyone relevant
router.get('/', protect, authorize('pharmacist', 'doctor', 'admin', 'developer'), getInventory);

// POST: Add Stock (Pharmacist, Admin, Developer)
router.post('/', protect, authorize('pharmacist', 'admin', 'developer'), addStock);

// DELETE: Remove Stock (Pharmacist, Admin, Developer)
// This was missing previously, causing the error
router.delete('/:id', protect, authorize('pharmacist', 'admin', 'developer'), deleteStock);

module.exports = router;