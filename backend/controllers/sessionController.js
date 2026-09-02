// src/controllers/sessionController.js
// Controller untuk mengakhiri sesi, melihat riwayat sesi, dan ringkasan sesi

const sessionModel = require('../models/sessionModel');
const messageModel = require('../models/messageModel');
const summaryModel = require('../models/summaryModel');
const analysisService = require('../services/analysisService');
const responseHelper = require('../utils/responseHelper');

const sessionController = {
  /**
   * Akhiri sesi dan buat ringkasan + ekstraksi gejala
   * POST /api/session/end
   * Body: { session_id, chat_history? }
   */
  async endSession(req, res, next) {
    try {
      const { session_id, chat_history } = req.body;

      let messages = [];

      // Jika user login, ambil messages dari database
      if (req.user && session_id) {
        messages = await messageModel.findBySessionId(session_id);
      } else if (Array.isArray(chat_history) && chat_history.length > 0) {
        messages = chat_history;
      }

      if (messages.length === 0) {
        return responseHelper.validationError(res, {
          message: 'Tidak ada riwayat percakapan untuk dianalisis.',
        });
      }

      // 1. Panggil LLM untuk ekstraksi gejala internal (JSON)
      const extractionResult = await analysisService.extractSymptoms(messages);

      // 2. Panggil LLM untuk ringkasan hangat ramah user (Text)
      const userSummary = await analysisService.generateUserSummary(messages);

      // 3. Jika user login, simpan ke database
      if (req.user && session_id) {
        await sessionModel.endSession(session_id);

        await summaryModel.createSummary(session_id, {
          moodSummary: extractionResult.mood_dominan || 'netral',
          symptoms: extractionResult.gejala_terdeteksi || [],
          riskLevel: extractionResult.tingkat_risiko || 'rendah',
          recommendation: extractionResult.rekomendasi_untuk_user || userSummary,
          rawAnalysis: {
            ...extractionResult,
            user_summary_text: userSummary,
          },
        });
      }

      return responseHelper.success(
        res,
        {
          user_summary: userSummary,
          symptoms: extractionResult.gejala_terdeteksi || [],
          risk_level: extractionResult.tingkat_risiko || 'rendah',
          mood_summary: extractionResult.mood_dominan || 'netral',
          recommendation: extractionResult.rekomendasi_untuk_user,
          themes: extractionResult.tema_utama || [],
          condition_summary: extractionResult.ringkasan_kondisi,
        },
        'Sesi berhasil diakhiri dan dianalisis'
      );
    } catch (err) {
      next(err);
    }
  },
};

module.exports = sessionController;
