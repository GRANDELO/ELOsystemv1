const express = require('express');
const { getLogs } = require('../controllers/wiston');
const { protect, isAdmin } = require('../middlewares/authWiston');

const router = express.Router();

// GET /api/admin/logs - Fetch logs (admin only)
router.get('/logs', protect, isAdmin, getLogs);

module.exports = router;
