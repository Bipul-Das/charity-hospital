// const mongoose = require('mongoose');

// const PrescriptionSchema = new mongoose.Schema({
//     patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
//     doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
//     // Vitals
//     vitals: {
//         bp: { type: String, trim: true }, 
//         pulse: { type: String, trim: true }, 
//         weight: { type: String, trim: true }, 
//         temp: { type: String, trim: true }, 
//         spo2: { type: String, trim: true } 
//     },

//     // Clinical
//     chiefComplaint: { type: String, trim: true },
//     diagnosis: { type: String, required: true, trim: true },
    
//     // Medicines
//     medicines: [{
//         name: { type: String, required: true, uppercase: true }, 
//         dosage: { type: String, required: true }, 
//         duration: { type: String, required: true }, 
//         instruction: { type: String, trim: true } 
//     }],

//     // 🧪 Lab Tests (UPDATED)
//     labTests: [{
//         name: { type: String, trim: true },
//         notes: { type: String, trim: true },
//         discount: { type: Number, default: 0 } // New: % Discount
//     }],

//     notes: { type: String, trim: true }, 
//     followUpDate: { type: Date }, 
//     date: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Prescription', PrescriptionSchema);

const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // Vitals
    vitals: {
        bp: { type: String, trim: true }, 
        pulse: { type: String, trim: true }, 
        weight: { type: String, trim: true }, 
        temp: { type: String, trim: true }, 
        spo2: { type: String, trim: true } 
    },

    // Clinical
    chiefComplaint: { type: String, trim: true },
    diagnosis: { type: String, required: true, trim: true },
    
    // Medicines
    medicines: [{
        name: { type: String, required: true, uppercase: true }, 
        dosage: { type: String, required: true }, 
        duration: { type: String, required: true }, 
        instruction: { type: String, trim: true } 
    }],

    // 🧪 Lab Tests (UPDATED)
    labTests: [{
        name: { type: String, trim: true },
        notes: { type: String, trim: true }, // Doctor's note
        discount: { type: Number, default: 0 },
        
        // New Fields for Lab Tech:
        result: { type: String, default: '' }, // e.g., "140 mg/dL"
        status: { 
            type: String, 
            enum: ['Pending', 'Completed'], 
            default: 'Pending' 
        }
    }],

    // 💊 NEW: Dispense Status
    isDispensed: { type: Boolean, default: false },

    notes: { type: String, trim: true }, 
    followUpDate: { type: Date }, 
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);