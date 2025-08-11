const mongoose = require('mongoose');

const GuestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
    },
    phone: {
        type: String,
    },
    roomNumber: {
        type: String,
        required: [true, 'Please add a room number'],
        unique: true,
    },
    status: {
        type: String,
        enum: ['checked_in', 'checked_out', 'reserved'],
        default: 'reserved'
    },
    checkInDate: {
        type: Date,
        default: Date.now,
    },
    checkOutDate: {
        type: Date,
    },
    serviceRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ServiceRequest',
        },
    ],
});

module.exports = mongoose.model('Guest', GuestSchema);