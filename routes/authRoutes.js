const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');

router.get('/leaderboard', auth.getLeaderboardPage);
router.get('/login', auth.getLoginPage);
router.post('/login', auth.postLogin);
router.get('/register', auth.getRegisterPage);
router.post('/register', auth.postRegister);
router.get('/logout', auth.logout);
router.get('/auth/status', auth.authStatus);

module.exports = router;
