const express = require('express');
const router = express.Router();
const applicationController = require('../controller/applnController');
const authMiddleware = require('../middleware/auth');

router.get('/list', authMiddleware, applicationController.listApplications);

module.exports = router;