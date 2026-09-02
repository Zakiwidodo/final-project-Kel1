// src/models/userModel.js
// Database operations untuk tabel users

const db = require('../config/db');

const userModel = {
  /**
   * Buat user baru
   */
  async createUser(email, passwordHash) {
    const result = await db.query(
      `INSERT INTO users (email, password_hash) 
       VALUES ($1, $2) 
       RETURNING id, email, is_admin, token_balance, created_at`,
      [email, passwordHash]
    );
    return result.rows[0];
  },

  /**
   * Cari user berdasarkan email
   */
  async findByEmail(email) {
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  },

  /**
   * Cari user berdasarkan ID
   */
  async findById(id) {
    const result = await db.query(
      'SELECT id, email, is_admin, token_balance, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  /**
   * Update token balance
   */
  async updateTokenBalance(userId, newBalance) {
    const result = await db.query(
      'UPDATE users SET token_balance = $1 WHERE id = $2 RETURNING id, token_balance',
      [newBalance, userId]
    );
    return result.rows[0] || null;
  },

  /**
   * Get semua users (untuk admin) — tanpa password_hash
   */
  async findAll() {
    const result = await db.query(
      'SELECT id, email, is_admin, token_balance, created_at FROM users ORDER BY created_at DESC'
    );
    return result.rows;
  },
};

module.exports = userModel;
