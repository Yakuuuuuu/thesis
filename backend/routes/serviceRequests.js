const express = require('express');
const {
    getServiceRequests,
    getServiceRequest,
    createServiceRequest,
    updateServiceRequest,
    deleteServiceRequest,
    assignServiceRequest,
    completeServiceRequest,
} = require('../controllers/serviceRequests');

const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(protect, authorize('admin', 'staff'), getServiceRequests)
    .post(protect, authorize('admin', 'staff'), createServiceRequest);

router
    .route('/:id')
    .get(protect, authorize('admin', 'staff'), getServiceRequest)
    .put(protect, authorize('admin', 'staff'), updateServiceRequest)
    .delete(protect, authorize('admin'), deleteServiceRequest);

router.put('/:id/assign', protect, authorize('admin', 'staff'), assignServiceRequest);
router.put('/:id/complete', protect, authorize('admin', 'staff'), completeServiceRequest);

module.exports = router;
