// src/controllers/adminController.js
// Controller untuk dashboard admin

const userModel = require('../models/userModel');
const sessionModel = require('../models/sessionModel');
const messageModel = require('../models/messageModel');
const summaryModel = require('../models/summaryModel');
const responseHelper = require('../utils/responseHelper');

const adminController = {
  /**
   * Get semua data pengguna (tanpa password_hash)
   * GET /api/admin/users
   */
  async getAllUsers(req, res, next) {
    try {
      const users = await userModel.findAll();
      return responseHelper.success(res, { users }, 'Daftar pengguna berhasil diambil');
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get semua sesi pengguna beserta status & pesan count
   * GET /api/admin/sessions
   */
  async getAllSessions(req, res, next) {
    try {
      const sessions = await sessionModel.findAll();
      return responseHelper.success(res, { sessions }, 'Daftar sesi berhasil diambil');
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get detail 1 sesi lengkap (metadata, riwayat pesan, analisis gejala)
   * GET /api/admin/session/:id
   */
  async getSessionDetail(req, res, next) {
    try {
      const { id } = req.params;

      const session = await sessionModel.findById(id);
      if (!session) {
        return responseHelper.error(res, 'Sesi tidak ditemukan', 404);
      }

      const messages = await messageModel.findBySessionId(id);
      const summary = await summaryModel.findBySessionId(id);

      return responseHelper.success(
        res,
        {
          session,
          messages,
          summary,
        },
        'Detail sesi admin berhasil diambil'
      );
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get semua ringkasan & analisis gejala
   * GET /api/admin/summaries
   */
  async getAllSummaries(req, res, next) {
    try {
      const summaries = await summaryModel.findAll();
      return responseHelper.success(res, { summaries }, 'Semua ringkasan analisis berhasil diambil');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = adminController;
