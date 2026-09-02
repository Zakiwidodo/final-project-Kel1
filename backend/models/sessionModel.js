// src/models/sessionModel.js
// Database operations untuk tabel sessions

const db = require('../config/db');

const sessionModel = {
  /**
   * Buat session baru (login user)
   */
  async createSession(userId) {
    const result = await db.query(
      `INSERT INTO sessions (user_id, is_anonymous) 
       VALUES ($1, FALSE) 
       RETURNING *`,
      [userId]
    );
    return result.rows[0];
  },

  /**
   * Buat session anonim
   */
  async createAnonymousSession(anonSessionToken) {
    const result = await db.query(
      `INSERT INTO sessions (is_anonymous, anon_session_token) 
       VALUES (TRUE, $1) 
       RETURNING *`,
      [anonSessionToken]
    );
    return result.rows[0];
  },

  /**
   * Cari session berdasarkan ID
   */
  async findById(sessionId) {
    const result = await db.query(
      'SELECT * FROM sessions WHERE id = $1',
      [sessionId]
    );
    return result.rows[0] || null;
  },

  /**
   * Cari session berdasarkan anon_session_token
   */
  async findByAnonToken(anonToken) {
    const result = await db.query(
      'SELECT * FROM sessions WHERE anon_session_token = $1 AND is_active = TRUE',
      [anonToken]
    );
    return result.rows[0] || null;
  },

  /**
   * Akhiri session
   */
  async endSession(sessionId) {
    const result = await db.query(
      `UPDATE sessions 
       SET ended_at = NOW(), is_active = FALSE 
       WHERE id = $1 
       RETURNING *`,
      [sessionId]
    );
    return result.rows[0] || null;
  },

  /**
   * Get semua sessions milik user
   */
  async findByUserId(userId) {
    const result = await db.query(
      `SELECT s.*, 
              (SELECT COUNT(*) FROM messages WHERE session_id = s.id) as message_count,
              ss.mood_summary, ss.risk_level
       FROM sessions s
       LEFT JOIN session_summaries ss ON ss.session_id = s.id
       WHERE s.user_id = $1 
       ORDER BY s.started_at DESC`,
      [userId]
    );
    return result.rows;
  },

  /**
   * Get semua sessions (untuk admin)
   */
  async findAll() {
    const result = await db.query(
      `SELECT s.*, 
              u.email as user_email,
              (SELECT COUNT(*) FROM messages WHERE session_id = s.id) as message_count,
              ss.risk_level
       FROM sessions s
       LEFT JOIN users u ON u.id = s.user_id
       LEFT JOIN session_summaries ss ON ss.session_id = s.id
       ORDER BY s.started_at DESC`
    );
    return result.rows;
  },
};

module.exports = sessionModel;
