const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Endpoint Public: Registrasi User Baru
router.post('/register', authController.register);

// Endpoint Public: Login User (mendapatkan token JWT)
router.post('/login', authController.login);

// Endpoint Terproteksi: Melihat Profil Sendiri (Wajib menyertakan Header Authorization: Bearer <token>)
router.get('/me', verifyToken, authController.getMe);

module.exports = router;
