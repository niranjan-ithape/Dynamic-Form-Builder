const express = require('express');
const { getFormById, submitForm } = require('../controller/submissionController');

const router = express.Router();

// Public routes — no token required
router.get('/forms/:id', getFormById);
router.post('/forms/:id/submit', submitForm);

module.exports = router;
