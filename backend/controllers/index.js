// backend/controllers/index.js
// Centralized Controller Exports

const authController = require('./authController');
const chatController = require('./chatController');
const sessionController = require('./sessionController');
const adminController = require('./adminController');
const healthController = require('./health.controller');

module.exports = {
  authController,
  chatController,
  sessionController,
  adminController,
  healthController,
};
