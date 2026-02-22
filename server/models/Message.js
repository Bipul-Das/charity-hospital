const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false } // Admin can mark as read later
});

module.exports = mongoose.model('Message', MessageSchema);