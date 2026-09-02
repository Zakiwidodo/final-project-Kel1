// src/config/initDb.js
// Script otomatis: buat database 'sahabat_dengar' jika belum ada, lalu buat semua tabel

const fs = require('fs');
const path = require('path');
const { Client, Pool } = require('pg');
const env = require('./env');

async function initDatabase() {
  console.log('🔄 Menghubungkan ke PostgreSQL...');

  // 1. Koneksi awal ke default database 'postgres' untuk membuat database 'sahabat_dengar'
  const defaultClient = new Client({
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: 'postgres',
    user: env.DB_USER,
    password: env.DB_PASSWORD,
  });

  try {
    await defaultClient.connect();
    console.log('✅ Terhubung ke server PostgreSQL');

    // Cek apakah database sahabat_dengar sudah ada
    const checkDb = await defaultClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [env.DB_NAME]
    );

    if (checkDb.rows.length === 0) {
      console.log(`📦 Database "${env.DB_NAME}" belum ada, membuat database baru...`);
      await defaultClient.query(`CREATE DATABASE "${env.DB_NAME}"`);
      console.log(`✅ Database "${env.DB_NAME}" berhasil dibuat!`);
    } else {
      console.log(`ℹ️ Database "${env.DB_NAME}" sudah ada.`);
    }
  } catch (err) {
    console.error('❌ Gagal memeriksa/membuat database di PostgreSQL:', err.message);
    await defaultClient.end().catch(() => {});
    process.exit(1);
  } finally {
    await defaultClient.end().catch(() => {});
  }

  // 2. Koneksi langsung ke database 'sahabat_dengar' untuk mengeksekusi tabel skema
  const targetPool = new Pool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
  });

  try {
    console.log(`🔄 Membaca skema tabel dan membuat struktur database...`);
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await targetPool.query(schemaSql);
    console.log('✅ Berhasil! Semua tabel (users, sessions, messages, session_summaries) siap digunakan.');
    await targetPool.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Gagal menjalankan skema tabel:', err.message);
    await targetPool.end().catch(() => {});
    process.exit(1);
  }
}

initDatabase();
