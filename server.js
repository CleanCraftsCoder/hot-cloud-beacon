const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const session = require('express-session');
// auth controller routes moved to routes/authRoutes.js
const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// session config — set SESSION_SECRET in .env for production
app.use(session({
  secret: process.env.SESSION_SECRET || 'change-this-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use('/api/scores', require('./routes/scoreRoutes'));
// auth routes (login/register/logout/status, leaderboard page)
app.use('/', require('./routes/authRoutes'));
// Protect index.html and root: prevent static from serving the game to unauthenticated users
app.use((req, res, next) => {
  const p = req.path;
  // block requests to the root or explicitly to index.html when not authenticated
  if ((p === '/' || p.endsWith('/index.html') || p === '/index.html')) {
    if (!req.session || !req.session.authenticated) return res.redirect('/login');
  }
  next();
});

// Serve static assets (CSS/JS/images). index.html will only be served by static if the request passed the auth check above.
app.use(express.static(path.join(__dirname, '../client')));

// Fallback for other non-API routes: if not authenticated redirect to login, otherwise serve index.html
app.use((req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ message: 'API route not found' });
  if (!req.session || !req.session.authenticated) return res.redirect('/login');
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});