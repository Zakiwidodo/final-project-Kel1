// src/models/summaryModel.js
// Database operations untuk tabel session_summaries

const db = require('../config/db');

const summaryModel = {
  /**
   * Simpan ringkasan sesi
   */
  async createSummary(sessionId, { moodSummary, symptoms, riskLevel, recommendation, rawAnalysis }) {
    const result = await db.query(
      `INSERT INTO session_summaries 
       (session_id, mood_summary, symptoms, risk_level, recommendation, raw_analysis) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [
        sessionId,
        moodSummary,
        JSON.stringify(symptoms),
        riskLevel,
        recommendation,
        JSON.stringify(rawAnalysis),
      ]
    );
    return result.rows[0];
  },

  /**
   * Get summary berdasarkan session_id
   */
  async findBySessionId(sessionId) {
    const result = await db.query(
      'SELECT * FROM session_summaries WHERE session_id = $1',
      [sessionId]
    );
    return result.rows[0] || null;
  },

  /**
   * Get semua summaries (untuk admin)
   */
  async findAll() {
    const result = await db.query(
      `SELECT ss.*, 
              s.user_id, s.started_at, s.ended_at,
              u.email as user_email
       FROM session_summaries ss
       JOIN sessions s ON s.id = ss.session_id
       LEFT JOIN users u ON u.id = s.user_id
       ORDER BY ss.created_at DESC`
    );
    return result.rows;
  },
};

module.exports = summaryModel;
