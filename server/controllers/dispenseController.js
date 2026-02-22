const Inventory = require('../models/Inventory');
const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient'); // Needed for search

// @desc    Get Pending Prescriptions for a Patient
// @route   GET /api/dispense/search?query=...
exports.searchPendingPrescriptions = async (req, res) => {
    try {
        const { query } = req.query; // Name, Phone, or UHID
        
        // 🛡️ FIX: Immediate rejection if query is empty
        if (!query || query.trim().length === 0) {
            return res.status(400).json({ success: false, message: "Please enter a valid Name, Phone, or UHID." });
        }

        // 1. Find the Patient first
        const patient = await Patient.findOne({
            $or: [
                { uhid: query },
                { phone: query },
                { name: { $regex: query, $options: 'i' } }
            ]
        });

        if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });

        // 2. Find Prescriptions that are NOT dispensed yet
        const prescriptions = await Prescription.find({ 
            patientId: patient._id,
            isDispensed: false 
        })
        .populate('doctor', 'name')
        .sort({ date: -1 }); // Oldest first? Usually newest first, but for pending list maybe FIFO.

        res.status(200).json({ success: true, patient, data: prescriptions });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Dispense Medicines (FEFO Logic)
// @route   POST /api/dispense
exports.dispenseMedicines = async (req, res) => {
    try {
        const { prescriptionId, medicines } = req.body; // medicines = array of { name, quantityNeeded }
        
        // 1. Validate Stock Availability First (Dry Run)
        for (const item of medicines) {
            const medName = item.name.toUpperCase();
            
            // Find total available stock (ignoring expired)
            const batches = await Inventory.find({ 
                name: medName, 
                quantity: { $gt: 0 },
                expiryDate: { $gt: new Date() } // Not Expired
            });
            
            const totalStock = batches.reduce((acc, batch) => acc + batch.quantity, 0);
            
            // Note: We are just estimating quantity needed based on duration roughly, 
            // or just assuming Pharmacist gives 1 unit per line item for simplicity,
            // OR frontend sends calculated quantity. Let's assume frontend sends quantity.
            
            if (totalStock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${medName}. Available: ${totalStock}` });
            }
        }

        // 2. Perform Deduction (FEFO)
        for (const item of medicines) {
            let qtyNeeded = parseInt(item.quantity);
            const medName = item.name.toUpperCase();

            // Fetch batches sorted by Expiry Date ASC (Soonest First)
            const batches = await Inventory.find({ 
                name: medName, 
                quantity: { $gt: 0 },
                expiryDate: { $gt: new Date() }
            }).sort({ expiryDate: 1 });

            for (const batch of batches) {
                if (qtyNeeded <= 0) break;

                if (batch.quantity >= qtyNeeded) {
                    // Batch has enough
                    batch.quantity -= qtyNeeded;
                    qtyNeeded = 0;
                    await batch.save();
                } else {
                    // Drain this batch, move to next
                    qtyNeeded -= batch.quantity;
                    batch.quantity = 0;
                    await batch.save();
                }
            }
        }

        // 3. Mark Prescription as Dispensed
        await Prescription.findByIdAndUpdate(prescriptionId, { isDispensed: true });

        res.status(200).json({ success: true, message: "✅ Medicines Dispensed Successfully!" });

    } catch (error) {
        console.error("Dispense Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};