const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.getLeaderboardPage = (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/leaderboard.html'));
};

exports.getLoginPage = (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/login.html'));
};

exports.postLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, message: 'Missing credentials' });
  try {
    const user = await User.findOne({ username });
    if (user) {
      const match = bcrypt.compareSync(password, user.passwordHash);
      if (match) {
        req.session.authenticated = true;
        req.session.user = username;
        return res.json({ success: true });
      }
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const allowedUser = process.env.AUTH_USER || 'admin';
    const allowedPass = process.env.AUTH_PASS || 'password';
    if (username === allowedUser && password === allowedPass) {
      req.session.authenticated = true;
      req.session.user = username;
      return res.json({ success: true });
    }

    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getRegisterPage = (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/register.html'));
};

exports.postRegister = async (req, res) => {
  let { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, message: 'Missing fields' });
  username = String(username).trim();
  if (username.length === 0) return res.status(400).json({ success: false, message: 'Invalid username' });
  try {
    const escapeRegExp = s => s.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
    const regex = new RegExp('^' + escapeRegExp(username) + '$', 'i');
    const existing = await User.findOne({ username: { $regex: regex } });
    if (existing) return res.status(409).json({ success: false, message: 'Username taken' });
    const hash = bcrypt.hashSync(password, 10);
    const u = new User({ username, passwordHash: hash });
    await u.save();
    return res.json({ success: true });
  } catch (err) {
    console.error('Register error', err);
    if (err && err.code === 11000) return res.status(409).json({ success: false, message: 'Username taken' });
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};

exports.authStatus = (req, res) => {
  res.json({ authenticated: !!(req.session && req.session.authenticated), user: req.session ? req.session.user : null });
};
