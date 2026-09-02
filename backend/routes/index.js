// backend/routes/index.js
// Centralized Route Exports

const authRoutes = require('./authRoutes');
const chatRoutes = require('./chatRoutes');
const sessionRoutes = require('./sessionRoutes');
const adminRoutes = require('./adminRoutes');
const healthRoutes = require('./health.routes');

module.exports = {
  authRoutes,
  chatRoutes,
  sessionRoutes,
  adminRoutes,
  healthRoutes,
};
