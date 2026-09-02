// src/routes/sessionRoutes.js
// Routes untuk manajemen sesi chat & analisis

const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/authMiddleware');

// Akhiri sesi dan buat ringkasan (bisa user login atau anonim)
router.post('/end', optionalAuthMiddleware, sessionController.endSession);

// Riwayat sesi user login
router.get('/history', authMiddleware, sessionController.getHistory);

// Detail 1 sesi beserta pesan
router.get('/:id', authMiddleware, sessionController.getSession);

// Ringkasan 1 sesi
router.get('/:id/summary', authMiddleware, sessionController.getSessionSummary);

module.exports = router;
