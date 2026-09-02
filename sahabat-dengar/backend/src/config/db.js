// src/config/db.js
// Koneksi PostgreSQL menggunakan pg Pool

const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
});

// Test koneksi saat startup
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected PostgreSQL error:', err.message);
  process.exit(-1);
});

/**
 * Query helper — bisa dipanggil:
 *   const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
 */
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
