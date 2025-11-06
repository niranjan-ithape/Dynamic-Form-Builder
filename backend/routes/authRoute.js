const express = require('express');
const { registerController, loginController } = require('../controller/authController');

const router = express.Router();

// Register
router.post('/signup', registerController);

// Login
router.post('/signin', loginController);

module.exports = router;
