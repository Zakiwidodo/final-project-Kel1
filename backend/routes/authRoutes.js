// backend/routes/authRoutes.js
// Routing untuk otentikasi user (register, login, profil)

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Daftar akun baru
router.post('/register', authController.register);

// Login dan dapatkan JWT
router.post('/login', authController.login);

// Ambil profil user yang sedang login (butuh token)
router.get('/me', authMiddleware, authController.me);

module.exports = router;
