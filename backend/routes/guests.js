const express = require('express');
const {
    getGuests,
    getGuest,
    createGuest,
    updateGuest,
    deleteGuest,
    checkoutGuest,
} = require('../controllers/guests');

const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(protect, authorize('admin', 'staff'), getGuests)
    .post(protect, authorize('admin', 'staff'), createGuest);

router
    .route('/:id')
    .get(protect, authorize('admin', 'staff'), getGuest)
    .put(protect, authorize('admin', 'staff'), updateGuest)
    .delete(protect, authorize('admin'), deleteGuest);

router
    .route('/checkout/:id')
    .put(protect, authorize('admin', 'staff'), checkoutGuest);

module.exports = router;
