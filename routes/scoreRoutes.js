const express = require('express');
const router = express.Router();
const {
  saveScore,
  getLeaderboard
} = require('../controllers/scoreController');

// protect saveScore so only authenticated users can post scores
function ensureAuth(req, res, next){
  if (req.session && req.session.authenticated) return next();
  return res.status(401).json({ message: 'Authentication required to save score' });
}

router.post('/', ensureAuth, saveScore);
router.get('/leaderboard', getLeaderboard);

module.exports = router;