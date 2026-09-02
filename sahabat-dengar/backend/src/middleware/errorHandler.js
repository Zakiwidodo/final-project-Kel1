// src/middleware/errorHandler.js
// Global error handler middleware

const responseHelper = require('../utils/responseHelper');

function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err.message);

  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return responseHelper.error(res, 'Token tidak valid', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return responseHelper.error(res, 'Token sudah expired, silakan login ulang', 401);
  }

  // PostgreSQL unique violation
  if (err.code === '23505') {
    return responseHelper.error(res, 'Data sudah ada (duplicate)', 409);
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    return responseHelper.error(res, 'Referensi data tidak ditemukan', 400);
  }

  // Default
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return responseHelper.error(res, message, statusCode, err.stack);
}

module.exports = errorHandler;
