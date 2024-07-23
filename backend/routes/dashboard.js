const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const salesController = require('../controllers/salesController');
const reportsController = require('../controllers/reportsController');

router.get('/users/count', dashboardController.getTotalUsers);
router.get('/users/active-count', dashboardController.getActiveUsers);
router.get('/sales/total', salesController.getTotalSales);
router.get('/sales/monthly', salesController.getMonthlySales);
router.get('/sales/recent', salesController.getRecentSales);
router.get('/activities/recent', dashboardController.getRecentActivities);
router.get('/reports', reportsController.generateReport);

module.exports = router;
