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

  /**
   * Kirim pesan chat
   * POST /api/chat/message
   * Body: { content, session_id, chat_history? }
   * Headers: Authorization (opsional jika login), x-anon-token (jika anonim)
   */
  async sendMessage(req, res, next) {
    try {
      const { content, session_id } = req.body;

      if (!content || !content.trim()) {
        return responseHelper.validationError(res, {
          content: 'Pesan tidak boleh kosong',
        });
      }

      const trimmedContent = content.trim();

      // ==========================================
      // KASUS 1: USER LOGIN
      // ==========================================
      if (req.user) {
        let activeSessionId = session_id;

        // Jika session_id belum ada atau invalid, buat session baru
        if (!activeSessionId) {
          const newSession = await sessionModel.createSession(req.user.id);
          activeSessionId = newSession.id;
        } else {
          // Validasi session milik user ini
          const sess = await sessionModel.findById(activeSessionId);
          if (!sess || sess.user_id !== req.user.id) {
            const newSession = await sessionModel.createSession(req.user.id);
            activeSessionId = newSession.id;
          }
        }

        // 1. Simpan pesan user ke database
        await messageModel.createMessage(activeSessionId, 'user', trimmedContent);

        // 2. Ambil riwayat chat sebelumnya untuk konteks LLM
        const recentMessages = await messageModel.getRecentMessages(activeSessionId, 20);
        const formattedContext = recentMessages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        // 3. Panggil LLM
        const llmResponse = await llmService.sendMessage(
          formattedContext,
          analysisService.CHATBOT_SYSTEM_PROMPT
        );

        // 4. Simpan pesan asisten ke database
        await messageModel.createMessage(activeSessionId, 'assistant', llmResponse.content);

        return responseHelper.success(
          res,
          {
            reply: llmResponse.content,
            session_id: activeSessionId,
            token_remaining: req.tokenRemaining,
          },
          'Pesan berhasil dikirim'
        );
      }
    } catch (err) {
      next(err);
    }
  },
};

module.exports = chatController;
