const Guest = require('../models/Guest');
const asyncHandler = require('../middleware/async');

// @desc    Get all guests
// @route   GET /api/v1/guests
// @access  Public
exports.getGuests = asyncHandler(async (req, res, next) => {
    const guests = await Guest.find();
    res.status(200).json({ success: true, count: guests.length, data: guests });
});

// @desc    Get single guest
// @route   GET /api/v1/guests/:id
// @access  Private
exports.getGuest = async (req, res, next) => {
    try {
        const guest = await Guest.findById(req.params.id);
        if (!guest) {
            return res.status(404).json({ success: false, error: 'Guest not found' });
        }
        res.status(200).json({ success: true, data: guest });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Create new guest
// @route   POST /api/v1/guests
// @access  Private
exports.createGuest = async (req, res, next) => {
    try {
        const guest = await Guest.create(req.body);
        res.status(201).json({ success: true, data: guest });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update guest
// @route   PUT /api/v1/guests/:id
// @access  Private
exports.updateGuest = async (req, res, next) => {
    try {
        const guest = await Guest.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!guest) {
            return res.status(404).json({ success: false, error: 'Guest not found' });
        }
        res.status(200).json({ success: true, data: guest });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete guest
// @route   DELETE /api/v1/guests/:id
// @access  Private
exports.deleteGuest = async (req, res, next) => {
    try {
        const guest = await Guest.findByIdAndDelete(req.params.id);
        if (!guest) {
            return res.status(404).json({ success: false, error: 'Guest not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Checkout a guest
// @route   PUT /api/v1/guests/checkout/:id
// @access  Private
exports.checkoutGuest = async (req, res, next) => {
    try {
        const guest = await Guest.findById(req.params.id);
        if (!guest) {
            return res.status(404).json({ success: false, error: 'Guest not found' });
        }

        guest.status = 'checked_out';
        guest.checkOutDate = Date.now();
        await guest.save();

        res.status(200).json({ success: true, data: guest });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
