const ServiceRequest = require('../models/ServiceRequest');
const Guest = require('../models/Guest');
const Feedback = require('../models/Feedback');
const asyncHandler = require('../middleware/async');

// @desc    Create new guest
// @route   POST /api/v1/public/guests/register
// @access  Public
exports.createGuest = asyncHandler(async (req, res, next) => {
    console.log('[DEBUG] Attempting to register a new guest...');
    const guest = await Guest.create(req.body);
    console.log(`[DEBUG] Successfully created guest with ID: ${guest._id}`);
    res.status(201).json({ success: true, data: guest });
});

// @desc    Create new service request
// @route   POST /api/v1/public/servicerequests
// @access  Public
exports.createServiceRequest = asyncHandler(async (req, res, next) => {
    const { roomNumber, request, category } = req.body;
    console.log(`[DEBUG] Service request received for room: ${roomNumber}`);
    
    const guest = await Guest.findOne({ roomNumber: roomNumber });

    if (!guest) {
        console.log(`[DEBUG] Guest not found for service request in room: ${roomNumber}`);
        return res.status(404).json({ success: false, error: 'Guest not found for the provided room number' });
    }

    const serviceRequest = await ServiceRequest.create({
        guest: guest._id,
        request: request || category,
        status: 'pending',
        category: category
    });
    console.log(`[DEBUG] Successfully created service request ID: ${serviceRequest._id}`);
    res.status(201).json({ success: true, data: serviceRequest });
});

// @desc    Get guest by room number
// @route   GET /api/v1/public/guests/room/:roomNumber
// @access  Public
exports.getGuestByRoom = asyncHandler(async (req, res, next) => {
    console.log(`[DEBUG] Searching for guest in room: ${req.params.roomNumber}`);
    const guest = await Guest.findOne({ roomNumber: req.params.roomNumber });
    
    if (!guest) {
        console.log(`[DEBUG] Guest not found for room: ${req.params.roomNumber}. Sending 404.`);
        return res.status(404).json({ success: false, error: 'Checked-in guest not found for this room' });
    }
    
    console.log(`[DEBUG] Found guest for room ${req.params.roomNumber}. Guest ID: ${guest._id}. Sending response.`);
    res.status(200).json({ success: true, data: guest });
});

const allRooms = ["101", "102", "103", "104", "201", "202", "203", "204"];

// @desc    Get available rooms
// @route   GET /api/v1/public/rooms/available
// @access  Public
exports.getAvailableRooms = asyncHandler(async (req, res, next) => {
    const guests = await Guest.find({ status: 'checked_in' });
    const occupiedRooms = guests.map(guest => guest.roomNumber);
    const availableRooms = allRooms.filter(room => !occupiedRooms.includes(room));
    res.status(200).json({ success: true, data: availableRooms });
});

// @desc    Checkout guest (public - no auth required)
// @route   PUT /api/v1/public/guests/checkout/:roomNumber
// @access  Public
exports.checkoutGuest = asyncHandler(async (req, res, next) => {
    const { roomNumber } = req.params;
    console.log(`[DEBUG] Public checkout attempt for room: ${roomNumber}`);
    
    // Find guest by room number
    const guest = await Guest.findOne({ roomNumber: roomNumber, status: 'checked_in' });
    
    if (!guest) {
        console.log(`[DEBUG] No checked-in guest found for room: ${roomNumber}`);
        return res.status(404).json({ success: false, error: 'No checked-in guest found for this room' });
    }
    
    // Update guest status to checked out
    guest.status = 'checked_out';
    guest.checkOutDate = new Date();
    await guest.save();
    
    console.log(`[DEBUG] Successfully checked out guest from room: ${roomNumber}`);
    res.status(200).json({ 
        success: true, 
        message: 'Guest checked out successfully',
        data: { roomNumber: guest.roomNumber, checkOutDate: guest.checkOutDate }
    });
});

// @desc    Submit guest feedback (public - no auth required)
// @route   POST /api/v1/public/feedback
// @access  Public
exports.submitFeedback = asyncHandler(async (req, res, next) => {
    const { roomNumber, rating, feedback } = req.body;
    console.log(`[DEBUG] Feedback submission for room: ${roomNumber}, rating: ${rating}`);
    
    if (!roomNumber || !rating) {
        return res.status(400).json({ 
            success: false, 
            error: 'Room number and rating are required' 
        });
    }
    
    try {
        // Create a feedback record in the database
        const feedbackRecord = await Feedback.create({
            roomNumber,
            rating: parseInt(rating),
            feedback: feedback || 'No feedback provided',
            submittedAt: new Date()
        });
        
        console.log(`[DEBUG] Feedback saved to database for room ${roomNumber}:`, feedbackRecord);
        
        res.status(201).json({ 
            success: true, 
            message: 'Feedback submitted successfully',
            data: feedbackRecord
        });
        
    } catch (error) {
        console.error('[ERROR] Failed to process feedback:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to submit feedback' 
        });
    }
});

// @desc    Get all feedback (for admin dashboard)
// @route   GET /api/v1/public/feedback
// @access  Public (for now, could be restricted later)
exports.getFeedback = asyncHandler(async (req, res, next) => {
    console.log('[DEBUG] Fetching all feedback for admin dashboard');
    
    try {
        const feedback = await Feedback.find().sort({ submittedAt: -1 });
        
        console.log(`[DEBUG] Found ${feedback.length} feedback records`);
        
        res.status(200).json({ 
            success: true, 
            count: feedback.length,
            data: feedback
        });
        
    } catch (error) {
        console.error('[ERROR] Failed to fetch feedback:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch feedback' 
        });
    }
});
