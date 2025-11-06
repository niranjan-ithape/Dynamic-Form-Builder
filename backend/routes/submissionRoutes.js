const express = require('express');
const { getFormById, submitForm } = require('../controller/submissionController');
const { authMiddleware } = require('../auth/authMiddleware');

const router = express.Router();

// Public routes — no token required
router.get('/forms/:id',authMiddleware, getFormById);
router.post('/forms/:id/submit',authMiddleware, submitForm);

module.exports = router;
