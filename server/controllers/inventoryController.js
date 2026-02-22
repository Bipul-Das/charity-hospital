const Inventory = require('../models/Inventory');

// @desc    Get All Inventory
// @route   GET /api/inventory
exports.getInventory = async (req, res) => {
    try {
        // Sort by Name first, then Expiry Date
        const items = await Inventory.find().sort({ name: 1, expiryDate: 1 });
        res.status(200).json({ success: true, count: items.length, data: items });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Add New Stock
// @route   POST /api/inventory
exports.addStock = async (req, res) => {
    try {
        // Validation handles Trim/Uppercase automatically via Model
        const newItem = await Inventory.create(req.body);
        res.status(201).json({ success: true, data: newItem });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Delete Stock Item
// @route   DELETE /api/inventory/:id
exports.deleteStock = async (req, res) => {
    try {
        const item = await Inventory.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }

        await item.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};