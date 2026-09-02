// src/utils/responseHelper.js
// Standarisasi format response API

/**
 * Success response
 */
function success(res, data = null, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

/**
 * Error response
 */
function error(res, message = 'Internal Server Error', statusCode = 500, details = null) {
  const response = {
    success: false,
    message,
  };
  if (details && process.env.NODE_ENV === 'development') {
    response.details = details;
  }
  return res.status(statusCode).json(response);
}

/**
 * Validation error response
 */
function validationError(res, errors) {
  return res.status(400).json({
    success: false,
    message: 'Validation error',
    errors,
  });
}

module.exports = { success, error, validationError };
