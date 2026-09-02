// src/config/env.js
// Validasi environment variables saat startup

const dotenv = require('dotenv');
const path = require('path');

// Load .env dari root backend
dotenv.config({ path: path.join(__dirname, '../../.env') });

const requiredVars = [
  'PORT',
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'LLM_API_KEY',
  'LLM_BASE_URL',
  'LLM_MODEL',
  'ANON_TOKEN_LIMIT',
];

const missing = requiredVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`❌ Missing environment variables:\n  ${missing.join('\n  ')}`);
  console.error('💡 Pastikan file .env sudah dibuat berdasarkan .env.example');
  process.exit(1);
}

module.exports = {
  PORT: parseInt(process.env.PORT, 10) || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  DB_HOST: process.env.DB_HOST,
  DB_PORT: parseInt(process.env.DB_PORT, 10) || 5432,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,

  // Auth
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // LLM
  LLM_API_KEY: process.env.LLM_API_KEY,
  LLM_BASE_URL: process.env.LLM_BASE_URL,
  LLM_MODEL: process.env.LLM_MODEL,

  // Token
  ANON_TOKEN_LIMIT: parseInt(process.env.ANON_TOKEN_LIMIT, 10) || 15,
};
