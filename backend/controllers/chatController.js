// src/controllers/chatController.js
// Chat controller untuk pengguna login dan anonim

const sessionModel = require('../models/sessionModel');
const messageModel = require('../models/messageModel');
const llmService = require('../services/llmService');
const analysisService = require('../services/analysisService');
const { generateAnonToken } = require('../utils/tokenHelper');
const { getAnonTokens } = require('../middleware/tokenLimiter');
const responseHelper = require('../utils/responseHelper');
const env = require('../config/env');

const chatController = {
  /**
   * Mulai sesi anonim
   * POST /api/chat/anonymous/start
   */
  async startAnonymous(req, res, next) {
    try {
      const anonToken = generateAnonToken();

      // Buat metadata session di DB (pesan anonim tetap TIDAK disimpan ke DB sesuai Rule 3)
      let session;
      try {
        session = await sessionModel.createAnonymousSession(anonToken);
      } catch (dbErr) {
        // Fallback jika DB offline atau error
        session = { id: anonToken, is_anonymous: true };
      }

      return responseHelper.success(
        res,
        {
          session_id: session.id,
          anon_session_token: anonToken,
          token_remaining: env.ANON_TOKEN_LIMIT,
        },
        'Sesi anonim berhasil dibuat'
      );
    } catch (err) {
      next(err);
    }
  },
};

module.exports = chatController;
