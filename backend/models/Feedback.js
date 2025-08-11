const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: [true, 'Please add a room number'],
    },
    rating: {
        type: Number,
        required: [true, 'Please add a rating'],
        min: 1,
        max: 5,
    },
    feedback: {
        type: String,
        required: false,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
    guestName: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model('Feedback', FeedbackSchema); 