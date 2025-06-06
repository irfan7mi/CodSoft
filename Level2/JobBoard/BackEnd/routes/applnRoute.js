const express = require('express');
const router = express.Router();
const applicationController = require('../controller/applnController');
const authMiddleware = require('../middleware/auth');

router.get('/list/:email', applicationController.listApplications);
router.post('/apply', applicationController.applyJob);

module.exports = router;