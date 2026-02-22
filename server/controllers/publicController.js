const Patient = require('../models/Patient');
const User = require('../models/User');
const Inventory = require('../models/Inventory');
const Message = require('../models/Message');

// ... keep getPublicStats ...

// @desc    Submit Contact Form
// @route   POST /api/public/contact
exports.submitMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        await Message.create({ name, email, message });
        res.status(201).json({ success: true, message: "Message Sent Successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get Public Impact Stats
// @route   GET /api/public/stats
// @access  Public (No Token Required)
exports.getPublicStats = async (req, res) => {
    try {
        // 1. Total Patients Treated
        const patientCount = await Patient.countDocuments();

        // 2. Active Doctors
        const doctorCount = await User.countDocuments({ role: 'doctor' });

        // 3. Free Medicine Value (Sum of Price * Quantity of all stock)
        // Note: In a real scenario, you might calculate "Value Dispensed", 
        // but for now, "Inventory Value Available" is a good proxy for capacity.
        const inventory = await Inventory.find();
        const totalValue = inventory.reduce((acc, item) => acc + (item.quantity * item.pricePerUnit), 0);

        // 4. Pending Lab Tests (Just to show activity)
        // If you want to show "Labs Performed", you'd count Prescription.labTests where status = 'Completed'
        // For now, let's keep it simple.

        res.status(200).json({
            success: true,
            data: {
                patients: patientCount,
                doctors: doctorCount,
                value: totalValue,
                camps: 3 // Static for now, or fetch from a future Events model
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};