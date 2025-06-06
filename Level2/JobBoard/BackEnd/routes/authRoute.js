const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.post('/profile', authController.updateProfile);
router.get('/profile', authController.getProfile);
router.post('/signup', authController.signup);
router.post('/login', authController.login);

module.exports = router;