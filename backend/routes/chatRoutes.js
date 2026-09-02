// backend/routes/chatRoutes.js
// Routing untuk percakapan dengan AI (mode login maupun anonim)

const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chatController');
const { optionalAuthMiddleware } = require('../middleware/authMiddleware');
const { tokenLimiter } = require('../middleware/tokenLimiter');

// Mulai sesi anonim, server balikin anon_session_token
router.post('/anonymous/start', chatController.startAnonymous);

// Kirim pesan ke AI. optionalAuthMiddleware = boleh login, boleh anonim.
// tokenLimiter dipasang sebelum controller supaya kuota dicek duluan.
router.post('/message', optionalAuthMiddleware, tokenLimiter, chatController.sendMessage);

module.exports = router;
