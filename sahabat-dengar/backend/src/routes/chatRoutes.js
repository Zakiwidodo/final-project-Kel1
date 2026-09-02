// src/routes/chatRoutes.js
// Routes untuk percakapan AI (Chat)

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { optionalAuthMiddleware } = require('../middleware/authMiddleware');
const { tokenLimiter } = require('../middleware/tokenLimiter');

// Mulai sesi anonim
router.post('/anonymous/start', chatController.startAnonymous);

// Kirim pesan (mendukung user login maupun anonim)
router.post('/message', optionalAuthMiddleware, tokenLimiter, chatController.sendMessage);

module.exports = router;
