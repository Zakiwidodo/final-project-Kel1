// Auth middleware logic
// src/middleware/authMiddleware.js
// JWT verification middleware

const jwt = require('jsonwebtoken');
const env = require('../config/env');
const responseHelper = require('../utils/responseHelper');

/**
 * Verifikasi JWT dari header Authorization: Bearer <token>
 * Attach req.user = decoded payload
 */
function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return responseHelper.error(res, 'Token tidak ditemukan. Silakan login terlebih dahulu.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);

    req.user = decoded; // { id, email, is_admin }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return responseHelper.error(res, 'Token sudah expired, silakan login ulang.', 401);
    }
    if (err.name === 'JsonWebTokenError') {
      return responseHelper.error(res, 'Token tidak valid.', 401);
    }
    next(err);
  }
}

/**
 * Optional Auth Middleware:
 * Jika ada header Authorization, verifikasi dan attach req.user.
 * Jika tidak ada, tetap lanjutkan tanpa error.
 */
function optionalAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    // Token invalid diabaikan, lanjutkan sebagai guest/anonim
    console.warn('Optional auth token invalid:', err.message);
  }
  next();
}

/**
 * Middleware khusus admin — harus dipasang SETELAH authMiddleware
 */
function adminMiddleware(req, res, next) {
  if (!req.user || !req.user.is_admin) {
    return responseHelper.error(res, 'Akses ditolak. Hanya admin yang bisa mengakses.', 403);
  }
  next();
}

module.exports = { authMiddleware, optionalAuthMiddleware, adminMiddleware };
