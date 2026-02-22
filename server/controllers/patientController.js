const Patient = require('../models/Patient');

// @desc    Register Patient
// @route   POST /api/patients
exports.registerPatient = async (req, res) => {
    try {
        const { name, age, gender, phone, address, financialStatus } = req.body;
        
        // Auto-Generate UHID
        const uhid = "PAT-" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100);

        const patient = await Patient.create({
            name, age, gender, phone, address, financialStatus, uhid, status: 'Waiting'
        });

        res.status(201).json({ success: true, data: patient });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "Phone number already registered. Please Search instead." });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Re-Visit Old Patient (Re-queue)
// @route   PUT /api/patients/:id/revisit
exports.revisitPatient = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        // Reset Status to Waiting
        patient.status = 'Waiting';
        // Force update timestamp to move them to top of list
        // (Mongoose timestamps will update automatically on save)
        await patient.save();

        res.status(200).json({ success: true, message: "Patient Re-queued", data: patient });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get All / Search
// @route   GET /api/patients?search=query
exports.getPatients = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            const isNumber = /^\d+$/.test(search);
            if (isNumber) {
                query = { phone: { $regex: search, $options: 'i' } };
            } else if (search.toUpperCase().startsWith('PAT-')) {
                query = { uhid: { $regex: search, $options: 'i' } };
            } else {
                query = { name: { $regex: search, $options: 'i' } };
            }
        }

        // Sort by UpdatedAt so newly registered/revisited patients appear first
        const patients = await Patient.find(query).sort({ updatedAt: -1 });
        res.status(200).json({ success: true, count: patients.length, data: patients });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Update Details
// @route   PUT /api/patients/:id
exports.updatePatient = async (req, res) => {
    try {
        const updated = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if(!updated) return res.status(404).json({message: "Patient not found"});
        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Delete Patient
// @route   DELETE /api/patients/:id
exports.deletePatient = async (req, res) => {
    try {
        await Patient.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Patient Deleted" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};