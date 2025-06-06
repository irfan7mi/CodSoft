const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.post('/profile', authController.updateProfile);
router.get('/signup', authController.signup);
router.post('/logout', authController.logout);

module.exports = router;