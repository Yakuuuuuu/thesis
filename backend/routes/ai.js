const express = require('express');
const { getChatResponse } = require('../controllers/ai');

const router = express.Router();

router.post('/chat', getChatResponse);

module.exports = router;
