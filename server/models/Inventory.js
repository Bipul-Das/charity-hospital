const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true,
        uppercase: true // 🧹 Always CAPS: "PARACETAMOL"
    },
    category: { 
        type: String, 
        required: true,
        enum: ['Tablet', 'Syrup', 'Injection', 'Drops', 'Ointment', 'Consumable'],
        default: 'Tablet'
    },
    batchNumber: { 
        type: String, 
        required: true, 
        trim: true,
        uppercase: true // 🧹 Batch "abc" -> "ABC"
    },
    expiryDate: { type: Date, required: true },
    quantity: { 
        type: Number, 
        required: true, 
        min: [0, 'Quantity cannot be less than 0'] 
    },
    pricePerUnit: { type: Number, required: true, default: 0 } // For "Zero-Billing" logic
}, { timestamps: true });

module.exports = mongoose.model('Inventory', InventorySchema);