const mongoose = require('mongoose');

const ServiceRequestSchema = new mongoose.Schema({
    guest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guest',
        required: true,
    },
    assignedTo: {
        type: String, // Changed to String to support "waiter" or "housekeeping"
        enum: ['waiter', 'housekeeping'],
    },
    request: {
        type: String,
        required: [true, 'Please add a service request'],
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema);