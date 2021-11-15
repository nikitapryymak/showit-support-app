const express =  require('express');
const router = express.Router();
const { postToChannel } = require('../controllers/slackControllers.js');
const { isAuth } = require('../middleware/isAuth.js');

// -------- /slack
router.post('/', isAuth, postToChannel);

module.exports = router;