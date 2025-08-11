const ServiceRequest = require('../models/ServiceRequest');
const Guest = require('../models/Guest');
const asyncHandler = require('../middleware/async');

// @desc    Get all service requests
// @route   GET /api/v1/servicerequests
// @access  Private
exports.getServiceRequests = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.guestId) {
        query = ServiceRequest.find({ guest: req.params.guestId });
    } else {
        query = ServiceRequest.find().populate([
            { path: 'guest', select: 'name roomNumber' }
        ]);
    }

    const serviceRequests = await query;

    res.status(200).json({
        success: true,
        count: serviceRequests.length,
        data: serviceRequests,
    });
});

// @desc    Get single service request
// @route   GET /api/v1/servicerequests/:id
// @access  Private
exports.getServiceRequest = asyncHandler(async (req, res, next) => {
    const serviceRequest = await ServiceRequest.findById(req.params.id).populate([
        { path: 'guest', select: 'name roomNumber' }
    ]);

    if (!serviceRequest) {
        return res.status(404).json({ success: false, error: 'Service request not found' });
    }

    res.status(200).json({ success: true, data: serviceRequest });
});

// @desc    Create new service request
// @route   POST /api/v1/guests/:guestId/servicerequests
// @access  Private
exports.createServiceRequest = asyncHandler(async (req, res, next) => {
    req.body.guest = req.params.guestId;

    const guest = await Guest.findById(req.params.guestId);
    if (!guest) {
        return res.status(404).json({ success: false, error: 'Guest not found' });
    }

    const serviceRequest = await ServiceRequest.create(req.body);

    res.status(201).json({ success: true, data: serviceRequest });
});

// @desc    Update service request
// @route   PUT /api/v1/servicerequests/:id
// @access  Private
exports.updateServiceRequest = asyncHandler(async (req, res, next) => {
    let serviceRequest = await ServiceRequest.findById(req.params.id);

    if (!serviceRequest) {
        return res.status(404).json({ success: false, error: 'Service request not found' });
    }

    serviceRequest = await ServiceRequest.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: serviceRequest });
});

// @desc    Delete service request
// @route   DELETE /api/v1/servicerequests/:id
// @access  Private
exports.deleteServiceRequest = asyncHandler(async (req, res, next) => {
    const serviceRequest = await ServiceRequest.findById(req.params.id);

    if (!serviceRequest) {
        return res.status(404).json({ success: false, error: 'Service request not found' });
    }

    await serviceRequest.deleteOne();

    res.status(200).json({ success: true, data: {} });
});

// @desc    Assign service request to user
// @route   PUT /api/v1/servicerequests/:id/assign
// @access  Private
exports.assignServiceRequest = asyncHandler(async (req, res, next) => {
    const { assignedTo } = req.body;
    
    if (!assignedTo) {
        return res.status(400).json({ success: false, error: 'assignedTo field is required' });
    }

    const serviceRequest = await ServiceRequest.findByIdAndUpdate(
        req.params.id,
        { assignedTo, status: 'in-progress' },
        { new: true, runValidators: true }
    );

    if (!serviceRequest) {
        return res.status(404).json({ success: false, error: 'Service request not found' });
    }

    res.status(200).json({ success: true, data: serviceRequest });
});

// @desc    Mark service request as completed
// @route   PUT /api/v1/servicerequests/:id/complete
// @access  Private
exports.completeServiceRequest = asyncHandler(async (req, res, next) => {
    const serviceRequest = await ServiceRequest.findByIdAndUpdate(
        req.params.id,
        { status: 'completed' },
        { new: true, runValidators: true }
    ).populate([
        { path: 'guest', select: 'name roomNumber' }
    ]);

    if (!serviceRequest) {
        return res.status(404).json({ success: false, error: 'Service request not found' });
    }

    res.status(200).json({ success: true, data: serviceRequest });
});
