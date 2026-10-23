const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const { ErrorResponse } = require('../utils/response');

// Middleware untuk memverifikasi JWT token dari header Authorization
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Cek keberadaan token dengan format "Bearer <token>"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(
        new ErrorResponse('Akses ditolak. Token tidak disediakan atau format salah (gunakan format: Bearer <token>).')
      );
    }

    const token = authHeader.split(' ')[1];

    // Verifikasi validitas token dengan secret key
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'jobhunt_super_secret_jwt_key_at_least_32_characters_long_2026'
    );

    // Ambil data user terbaru dari DB untuk memastikan user masih aktif/terdaftar
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json(new ErrorResponse('Pengguna dengan token ini sudah tidak ditemukan di database.'));
    }

    // Tempelkan data user ke request object agar bisa diakses di controller berikutnya
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json(
      new ErrorResponse('Token tidak valid atau telah kedaluwarsa.', error.message)
    );
  }
};

// Middleware untuk membatasi akses berdasarkan role (misal: 'recruiter', 'job_seeker')
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json(
        new ErrorResponse(`Akses terlarang. Endpoint ini hanya untuk role: ${allowedRoles.join(', ')}.`)
      );
    }
    next();
  };
};

module.exports = {
  verifyToken,
  authorizeRoles
};
