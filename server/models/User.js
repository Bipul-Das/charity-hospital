const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Please add a name'],
        trim: true,
        set: (name) => name.replace(/\b\w/g, c => c.toUpperCase())
    },
    email: { 
        type: String, 
        required: [true, 'Please add an email'], 
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: { 
        type: String, 
        required: [true, 'Please add a password'], 
        minlength: 6,
        select: false 
    },
    role: {
        type: String,
        // 🧪 Added 'lab' to the allowed roles
        enum: ['developer', 'admin', 'doctor', 'reception', 'pharmacist', 'lab'],
        default: 'reception'
    },
    createdAt: { type: Date, default: Date.now }
});

// (Keep the existing pre-save and methods logic same as before...)
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);