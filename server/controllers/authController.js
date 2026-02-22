const User = require('../models/User');

// @desc    Login User
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Smart Format: Ensure email is lowercase before checking DB
        const cleanEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: cleanEmail }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = user.getSignedJwtToken();
        res.status(200).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Register New Staff (Admin/Dev Only)
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Security Check: Who is creating this account?
        // If an Admin tries to create a 'developer', BLOCK IT.
        if (role === 'developer' && req.user.role !== 'developer') {
            return res.status(403).json({ 
                success: false, 
                message: "Security Alert: Only Developers can create Developer accounts." 
            });
        }

        // 2. Create User (Model will handle Trim/Capitalization/Lowercase)
        const user = await User.create({
            name, 
            email, 
            password, 
            role 
        });

        res.status(201).json({ 
            success: true, 
            message: `Staff Registered: ${user.name} (${user.role})`, 
            data: user 
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};