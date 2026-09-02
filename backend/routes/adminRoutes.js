// backend/routes/adminRoutes.js
// Routing khusus Administrator (monitoring user & sesi)

const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Seluruh endpoint di bawah ini wajib login DAN wajib role admin
router.use(authMiddleware, adminMiddleware);

router.get('/users', adminController.getAllUsers);
router.get('/sessions', adminController.getAllSessions);
router.get('/session/:id', adminController.getSessionDetail);
router.get('/summaries', adminController.getAllSummaries);

module.exports = router;
