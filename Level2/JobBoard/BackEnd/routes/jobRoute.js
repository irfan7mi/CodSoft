const express = require('express');
const router = express.Router();
const jobController = require('../controller/jobController');
const authMiddleware = require('../middleware/auth');

router.post('/post', authMiddleware, jobController.postJob);
router.get('/list', authMiddleware, jobController.listJob);
router.get('/view/:id', authMiddleware, jobController.viewJob);
router.put('/update/:id', authMiddleware, jobController.updateJob);
router.delete('/delete/:id', authMiddleware, jobController.deleteJob);

module.exports = router;