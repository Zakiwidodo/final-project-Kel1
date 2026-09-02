// src/models/messageModel.js
// Database operations untuk tabel messages

const db = require('../config/db');

const messageModel = {
  /**
   * Simpan pesan baru (user atau assistant)
   */
  async createMessage(sessionId, role, content) {
    const result = await db.query(
      `INSERT INTO messages (session_id, role, content) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [sessionId, role, content]
    );
    return result.rows[0];
  },

  /**
   * Get semua pesan dalam satu session
   */
  async findBySessionId(sessionId) {
    const result = await db.query(
      'SELECT * FROM messages WHERE session_id = $1 ORDER BY created_at ASC',
      [sessionId]
    );
    return result.rows;
  },

  /**
   * Get pesan terbaru (untuk context window LLM)
   * Default: 20 pesan terakhir
   */
  async getRecentMessages(sessionId, limit = 20) {
    const result = await db.query(
      `SELECT role, content FROM messages 
       WHERE session_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [sessionId, limit]
    );
    // Reverse agar urutan chronological
    return result.rows.reverse();
  },
};

module.exports = messageModel;
