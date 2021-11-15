const express = require('express');
const router = express.Router();
const { getLogin, postLogin, googleRedirect, getLogout } = require('../controllers/authControllers.js');

// -------- /auth
router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/google', googleRedirect);
router.get('/logout', getLogout);

module.exports = router;
