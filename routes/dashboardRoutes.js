const express =  require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboardControllers.js');
const { isAuth } = require('../middleware/isAuth.js');

// -------- /dashboard
router.get('/', isAuth, getDashboard);

module.exports = router;