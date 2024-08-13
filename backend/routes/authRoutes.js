const express = require('express');
const { register, login, logout, checkSession } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/check-session', checkSession);
router.post('/logout', logout);

module.exports = router;
