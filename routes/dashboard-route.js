const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboard-controller');
const { eAdmin } = require('../helpers/eAdmin');
const { eDevAdmin } = require('../helpers/eAdmin');

//DASHBOARDS 
router.get('/', eAdmin || eDevAdmin, controller.getDashboard);
router.get('/mobile', eAdmin || eDevAdmin, controller.getDashboardMobile);

module.exports = router;
