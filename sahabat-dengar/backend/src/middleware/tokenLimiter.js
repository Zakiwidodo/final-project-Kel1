// src/middleware/tokenLimiter.js
// Middleware untuk cek & kurangi token (anonim dan login)

const db = require('../config/db');
const env = require('../config/env');
const responseHelper = require('../utils/responseHelper');

// In-memory store untuk token anonim (per session)
const anonTokenStore = new Map();

/**
 * Token limiter middleware
 * - Anonim: cek dari in-memory store berdasarkan anon_session_token
 * - Login: cek token_balance dari DB
 */
async function tokenLimiter(req, res, next) {
  try {
    // Jika user login (sudah di-attach authMiddleware sebelumnya, tapi optional)
    if (req.user) {
      // Cek token_balance di DB
      const result = await db.query('SELECT token_balance FROM users WHERE id = $1', [req.user.id]);

      if (result.rows.length === 0) {
        return responseHelper.error(res, 'User tidak ditemukan.', 404);
      }

      const balance = result.rows[0].token_balance;
      if (balance <= 0) {
        return responseHelper.error(res, 'Token habis. Silakan upgrade atau topup.', 403);
      }

      // Kurangi token
      await db.query('UPDATE users SET token_balance = token_balance - 1 WHERE id = $1', [req.user.id]);

      // Attach sisa token ke request
      req.tokenRemaining = balance - 1;
      return next();
    }

    // Jika anonim — cek header x-anon-token
    const anonToken = req.headers['x-anon-token'] || req.body.anon_session_token;

    if (!anonToken) {
      return responseHelper.error(res, 'Session token diperlukan.', 400);
    }

    // Init counter jika belum ada
    if (!anonTokenStore.has(anonToken)) {
      anonTokenStore.set(anonToken, env.ANON_TOKEN_LIMIT);
    }

    const remaining = anonTokenStore.get(anonToken);

    if (remaining <= 0) {
      return responseHelper.error(
        res,
        'Token anonim habis. Silakan login untuk melanjutkan.',
        403
      );
    }

    // Kurangi token
    anonTokenStore.set(anonToken, remaining - 1);
    req.tokenRemaining = remaining - 1;
    req.anonToken = anonToken;

    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Get remaining tokens for an anonymous session
 */
function getAnonTokens(anonToken) {
  return anonTokenStore.get(anonToken) ?? env.ANON_TOKEN_LIMIT;
}

module.exports = { tokenLimiter, getAnonTokens, anonTokenStore };
