const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.post('/profile', authController.updateProfile);
router.post('/signup', authController.signup);
router.post('/logout', authController.login);

module.exports = router;