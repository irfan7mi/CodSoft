const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.post('/profile', authController.updateProfile);

module.exports = router;