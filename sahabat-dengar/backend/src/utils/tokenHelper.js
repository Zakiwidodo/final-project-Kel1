// src/utils/tokenHelper.js
// Helper functions untuk token management

const { v4: uuidv4 } = require('uuid');

/**
 * Generate unique anonymous session token
 */
function generateAnonToken() {
  return `anon_${uuidv4()}`;
}

/**
 * Validate bahwa token balance cukup
 */
function hasTokens(balance) {
  return balance !== null && balance !== undefined && balance > 0;
}

module.exports = { generateAnonToken, hasTokens };
