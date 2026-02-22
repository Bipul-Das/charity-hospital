const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Protect Middleware (Verifies Token)
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id);
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'User not found' });
            }
            next();
        } catch (error) {
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

// 2. Authorize Middleware (The Permission Engine)
exports.authorize = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        const method = req.method; // GET, POST, PUT, DELETE

        // ⚡ GOD MODE: Developer bypasses ALL checks
        if (userRole === 'developer') {
            return next();
        }

        // 🛡️ AUDITOR MODE: Admin is View-Only
        if (userRole === 'admin') {
            // Admin can always VIEW (GET)
            if (method === 'GET') {
                return next();
            }
            // Admin CANNOT Edit/Delete (unless specifically allowed in route, which is rare)
            // Exception: Creating Staff (POST to /register) is handled by specific route logic, 
            // but for clinical data, we block it here.
            if (!allowedRoles.includes('admin')) {
                 return res.status(403).json({ 
                    success: false, 
                    message: "🔒 Admin is View-Only. Action Blocked." 
                });
            }
        }

        // 👮 STANDARD ROLE SILOS
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ 
                success: false, 
                message: `Access Denied: Role '${userRole}' is not authorized.` 
            });
        }
        
        next();
    };
};