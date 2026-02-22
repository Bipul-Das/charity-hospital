const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    uhid: { type: String, unique: true }, // Auto-generated ID
    name: { 
        type: String, 
        required: [true, "Patient Name is required"],
        trim: true,
        set: (name) => name.replace(/\b\w/g, c => c.toUpperCase()) // 🧹 Auto-Capitalize "john" -> "John"
    },
    age: { 
        type: Number, 
        required: [true, "Age is required"] 
    },
    gender: { 
        type: String, 
        enum: ['Male', 'Female', 'Other'], 
        required: true 
    },
    phone: { 
        type: String, 
        required: [true, "Phone number is required"], 
        unique: true,
        trim: true // 🧹 Removes spaces " 123 " -> "123"
    },
    address: {
        type: String,
        trim: true,
        set: (addr) => addr ? addr.replace(/\b\w/g, c => c.toUpperCase()) : '' // 🧹 "123 main st" -> "123 Main St"
    },
    financialStatus: { 
        type: String, 
        enum: ['Stable', 'Poor', 'Destitute'], 
        default: 'Stable' 
    },
    status: { 
        type: String, 
        enum: ['Waiting', 'Visited'], 
        default: 'Waiting' 
    },
    // 🧪 Lab Results Storage
    labResults: [
        {
            testName: String,
            resultUrl: String,
            date: { type: Date, default: Date.now },
            notes: { type: String, trim: true }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);