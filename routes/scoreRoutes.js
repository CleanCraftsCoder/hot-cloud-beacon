const express = require('express');
const router = express.Router();
const {
  saveScore,
  getLeaderboard
} = require('../controllers/scoreController');

router.post('/', saveScore);
router.get('/leaderboard', getLeaderboard);

module.exports = router;