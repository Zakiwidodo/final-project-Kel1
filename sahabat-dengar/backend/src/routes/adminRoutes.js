// src/routes/adminRoutes.js
// Routes khusus Administrator

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Proteksi seluruh route admin
router.use(authMiddleware, adminMiddleware);

// Endpoint admin
router.get('/users', adminController.getAllUsers);
router.get('/sessions', adminController.getAllSessions);
router.get('/session/:id', adminController.getSessionDetail);
router.get('/summaries', adminController.getAllSummaries);

module.exports = router;
