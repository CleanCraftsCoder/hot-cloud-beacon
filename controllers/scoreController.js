const Score = require('../models/score');

exports.saveScore = async (req, res) => {
  try {
    const { username, score } = req.body;

    if (!username || score == null)
      return res.status(400).json({ message: "Invalid data" });

    const newScore = await Score.create({ username, score });

    res.status(201).json(newScore);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Score.find()
      .sort({ score: -1 })
      .limit(10);

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};