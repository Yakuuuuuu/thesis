const express = require('express');
const { createServiceRequest, createGuest, getGuestByRoom, getAvailableRooms, checkoutGuest, submitFeedback, getFeedback } = require('../controllers/public');
const { getGuests } = require('../controllers/guests');

const router = express.Router();

router.get('/guests', getGuests);
router.get('/rooms/available', getAvailableRooms);
router.post('/servicerequests', createServiceRequest);
router.post('/guests/register', createGuest);
router.get('/guests/room/:roomNumber', getGuestByRoom);
router.put('/guests/checkout/:roomNumber', checkoutGuest);
router.post('/feedback', submitFeedback);
router.get('/feedback', getFeedback);

module.exports = router;
