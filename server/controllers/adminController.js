const User = require('../models/User');
const Patient = require('../models/Patient');
const Prescription = require('../models/Prescription');
const Inventory = require('../models/Inventory');

// @desc    Get Dashboard Stats
// @route   GET /api/admin/stats
exports.getStats = async (req, res) => {
    try {
        const totalPatients = await Patient.countDocuments();
        const totalPrescriptions = await Prescription.countDocuments();
        
        // Count specific staff
        const totalDoctors = await User.countDocuments({ role: 'doctor' });
        const totalStaff = await User.countDocuments();

        // Calculate Inventory Value
        const inventoryItems = await Inventory.find();
        const inventoryValue = inventoryItems.reduce((acc, item) => acc + (item.quantity * item.pricePerUnit), 0);

        res.status(200).json({
            success: true,
            data: {
                totalPatients,
                totalPrescriptions,
                inventoryValue,
                totalDoctors,
                totalStaff
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get All Staff
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Delete User (Fire Staff)
// @route   DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
    try {
        const userToDelete = await User.findById(req.params.id);
        
        if (!userToDelete) {
            return res.status(404).json({ message: "User not found" });
        }

        // 🛡️ Security: Prevent deleting yourself or other Admins/Devs (unless you are Dev)
        if (userToDelete.role === 'developer') {
            return res.status(403).json({ message: "Cannot delete a Developer!" });
        }
        
        if (userToDelete.role === 'admin' && req.user.role !== 'developer') {
            return res.status(403).json({ message: "Admins cannot delete other Admins." });
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "User deleted successfully" });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ... existing imports and functions ...

// @desc    Update User Credentials (Reset Password / Email)
// @route   PUT /api/admin/users/:id
exports.updateUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 🛡️ Security: Prevent modifying Developers unless you are one
        if (user.role === 'developer' && req.user.role !== 'developer') {
            return res.status(403).json({ message: "Cannot modify a Developer account." });
        }

        // Update Email if provided
        if (email) user.email = email.toLowerCase().trim();

        // Update Password if provided (Model middleware will hash it)
        if (password && password.length > 0) {
             user.password = password; 
        }

        await user.save();
        res.status(200).json({ success: true, message: "Credentials Updated Successfully", data: user });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};