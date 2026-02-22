const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');

// @desc    Get All Pending Lab Tests
// @route   GET /api/lab/pending
// @access  Lab Tech / Admin
exports.getPendingLabs = async (req, res) => {
    try {
        // Find prescriptions where at least one test is 'Pending'
        const pendingRxs = await Prescription.find({
            "labTests.status": "Pending"
        })
        .populate('patientId', 'name uhid age gender') // Need patient details
        .populate('doctor', 'name')
        .sort({ date: 1 }); // Oldest first (FIFO) for Lab

        res.status(200).json({ success: true, count: pendingRxs.length, data: pendingRxs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Update Test Result
// @route   PUT /api/lab/update/:prescriptionId
// @access  Lab Tech
exports.updateLabResult = async (req, res) => {
    try {
        const { testId, result } = req.body; // testId is the _id of the specific item inside labTests array

        const prescription = await Prescription.findById(req.params.prescriptionId);
        if (!prescription) return res.status(404).json({ message: "Prescription not found" });

        // Find the specific test within the array
        const testItem = prescription.labTests.id(testId);
        
        if (!testItem) {
            return res.status(404).json({ message: "Test ID not found in this prescription" });
        }

        // Update values
        testItem.result = result;
        testItem.status = 'Completed';

        await prescription.save();

        res.status(200).json({ success: true, message: "Result Saved", data: prescription });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};