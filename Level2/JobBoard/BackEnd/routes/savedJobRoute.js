const express = require('express');
const router = express.Router();
const savedJobController = require('../controller/savedJobController');
const authMiddleware = require('../middleware/auth');

router.get('/list', authMiddleware, savedJobController.listSavedJobs);
router.delete('/remove/:jobId', authMiddleware, savedJobController.removeSavedJob);

module.exports = router;