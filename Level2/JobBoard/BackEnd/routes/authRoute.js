const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/profile', authController.updateProfile);

module.exports = router;