// src/controllers/authController.js
// Authentication controllers (Register, Login, Me)

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const env = require('../config/env');
const responseHelper = require('../utils/responseHelper');

const authController = {
  /**
   * Register User Baru
   * POST /api/auth/register
   * Body: { email, password }
   */
  async register(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return responseHelper.validationError(res, {
          message: 'Email dan password wajib diisi',
        });
      }

      if (password.length < 6) {
        return responseHelper.validationError(res, {
          password: 'Password minimal 6 karakter',
        });
      }

      // Cek apakah email sudah terdaftar
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return responseHelper.error(res, 'Email sudah terdaftar', 400);
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Simpan user ke DB
      const newUser = await userModel.createUser(email, passwordHash);

      // Buat JWT token
      const token = jwt.sign(
        {
          id: newUser.id,
          email: newUser.email,
          is_admin: newUser.is_admin,
        },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN }
      );

      return responseHelper.success(
        res,
        {
          token,
          user: {
            id: newUser.id,
            email: newUser.email,
            is_admin: newUser.is_admin,
            token_balance: newUser.token_balance,
            created_at: newUser.created_at,
          },
        },
        'Registrasi berhasil',
        201
      );
    } catch (err) {
      next(err);
    }
  },

  /**
   * Login User
   * POST /api/auth/login
   * Body: { email, password }
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return responseHelper.validationError(res, {
          message: 'Email dan password wajib diisi',
        });
      }

      // Cari user berdasarkan email
      const user = await userModel.findByEmail(email);
      if (!user) {
        return responseHelper.error(res, 'Email atau password salah', 401);
      }

      // Verifikasi password
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return responseHelper.error(res, 'Email atau password salah', 401);
      }

      // Buat JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          is_admin: user.is_admin,
        },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN }
      );

      return responseHelper.success(
        res,
        {
          token,
          user: {
            id: user.id,
            email: user.email,
            is_admin: user.is_admin,
            token_balance: user.token_balance,
            created_at: user.created_at,
          },
        },
        'Login berhasil'
      );
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get Current User Profile
   * GET /api/auth/me
   * Headers: Authorization: Bearer <token>
   */
  async me(req, res, next) {
    try {
      const user = await userModel.findById(req.user.id);
      if (!user) {
        return responseHelper.error(res, 'User tidak ditemukan', 404);
      }

      return responseHelper.success(res, { user }, 'Data user berhasil diambil');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = authController;
