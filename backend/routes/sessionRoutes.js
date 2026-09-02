// backend/routes/sessionRoutes.js
// Routing untuk manajemen sesi curhat dan hasil analisisnya

const express = require('express');
const router = express.Router();

const sessionController = require('../controllers/sessionController');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/authMiddleware');

// Akhiri sesi lalu generate ringkasan (user login maupun anonim)
router.post('/end', optionalAuthMiddleware, sessionController.endSession);

// Daftar riwayat sesi milik user yang login
router.get('/history', authMiddleware, sessionController.getHistory);

// Detail satu sesi beserta seluruh pesannya
router.get('/:id', authMiddleware, sessionController.getSession);

// Ringkasan hasil analisis satu sesi
router.get('/:id/summary', authMiddleware, sessionController.getSessionSummary);

module.exports = router;
