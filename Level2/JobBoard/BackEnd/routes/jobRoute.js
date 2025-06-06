const express = require('express');
const router = express.Router();
const jobController = require('../controller/jobController');
const authMiddleware = require('../middleware/auth');

router.post('/post', jobController.postJob);
router.get('/list', jobController.listJob);
router.get('/view/:jobId', jobController.viewJob);
router.put('/update/:id', jobController.updateJob);
router.delete('/delete/:id', jobController.deleteJob);

module.exports = router;