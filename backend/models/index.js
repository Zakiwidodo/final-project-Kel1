// backend/models/index.js
// Centralized Model Exports

const userModel = require('./userModel');
const sessionModel = require('./sessionModel');
const messageModel = require('./messageModel');
const summaryModel = require('./summaryModel');

module.exports = {
  userModel,
  sessionModel,
  messageModel,
  summaryModel,
};
