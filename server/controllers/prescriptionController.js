const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');

// @desc    Create Prescription
// @route   POST /api/prescriptions
exports.createPrescription = async (req, res) => {
    try {
        const { patientId, chiefComplaint, diagnosis, medicines, vitals, labTests, notes, followUpDate } = req.body;

        const prescription = await Prescription.create({
            patientId,
            doctor: req.user.id,
            vitals, chiefComplaint, diagnosis, medicines, labTests, notes, followUpDate
        });

        // Auto-mark patient as visited
        await Patient.findByIdAndUpdate(patientId, { status: 'Visited' });

        res.status(201).json({ success: true, message: "Saved!", data: prescription });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get History (Sorted Newest First)
// @route   GET /api/prescriptions/:patientId
exports.getPrescriptions = async (req, res) => {
    try {
        const records = await Prescription.find({ patientId: req.params.patientId })
            .populate('doctor', 'name email')
            .sort({ date: -1 });
        res.status(200).json({ success: true, count: records.length, data: records });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};