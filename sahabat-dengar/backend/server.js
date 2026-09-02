// server.js
// Entry point backend Express untuk Sahabat Dengar

const express = require('express');
const cors = require('cors');
const path = require('path');
const env = require('./src/config/env');
const errorHandler = require('./src/middleware/errorHandler');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const chatRoutes = require('./src/routes/chatRoutes');
const sessionRoutes = require('./src/routes/sessionRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();

// ==========================================
// MIDDLEWARES
// ==========================================
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-anon-token'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// ==========================================
// HEALTH CHECK
// ==========================================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'Sahabat Dengar API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// ==========================================
// API ROUTES
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/admin', adminRoutes);

// Fallback middleware untuk SPA / Frontend navigation
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: `API Route ${req.originalUrl} tidak ditemukan`,
    });
  }
  // Serve frontend landing page jika bukan API
  res.sendFile(path.join(frontendPath, 'public/index.html'));
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================
app.use(errorHandler);

// ==========================================
// SERVER START
// ==========================================
const server = app.listen(env.PORT, () => {
  console.log(`
  🌿 ==========================================
  🧠 Sahabat Dengar Backend Server Running
  📡 Port: http://localhost:${env.PORT}
  🛠️ Environment: ${env.NODE_ENV}
  🏥 Health: http://localhost:${env.PORT}/api/health
  🌿 ==========================================
  `);
});

module.exports = { app, server };
