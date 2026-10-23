const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const { SuccessResponse, ErrorResponse } = require('../utils/response');

// 1. Controller untuk Registrasi User
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validasi kelengkapan input
    if (typeof name !== 'string' || typeof email !== 'string' ||
        typeof password !== 'string' || !name.trim() || !email.trim() ||
        !password || !role) {
      return res.status(400).json(
        new ErrorResponse('Harap isi semua kolom: name, email, password, dan role.')
      );
    }

    if (name.trim().length > 100 || email.trim().length > 150) {
      return res.status(400).json(
        new ErrorResponse('Nama maksimal 100 karakter dan email maksimal 150 karakter.')
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json(new ErrorResponse('Format email tidak valid.'));
    }

    if (password.length < 6) {
      return res.status(400).json(new ErrorResponse('Password Anda kurang dari 6 karakter.'));
    }
    if (password.length > 6) {
      return res.status(400).json(new ErrorResponse('Password Anda melebihi 6 karakter.'));
    }

    // Validasi role (hanya boleh 'job_seeker' atau 'recruiter')
    const allowedRoles = ['job_seeker', 'recruiter'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json(
        new ErrorResponse(`Role tidak valid. Pilihan role yang tersedia: ${allowedRoles.join(', ')}.`)
      );
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await UserModel.findByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(400).json(
        new ErrorResponse('Email sudah terdaftar. Silakan gunakan email lain atau langsung login.')
      );
    }

    // Hash password menggunakan bcrypt
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Simpan data user ke database
    const newUserId = await UserModel.create({
      name: name.trim(),
      email: normalizedEmail,
      password_hash,
      role
    });

    return res.status(201).json(
      new SuccessResponse('Registrasi pengguna berhasil!', {
        id: newUserId,
        name: name.trim(),
        email: normalizedEmail,
        role
      })
    );
  } catch (error) {
    next(error);
  }
};

// 2. Controller untuk Login User
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validasi kelengkapan input
    if (typeof email !== 'string' || !email.trim() ||
        typeof password !== 'string' || !password) {
      return res.status(400).json(new ErrorResponse('Harap masukkan email dan password.'));
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Cari user berdasarkan email
    const user = await UserModel.findByEmail(normalizedEmail);
    if (!user) {
      return res.status(401).json(new ErrorResponse('Email atau password salah.'));
    }

    // Verifikasi kesesuaian password dengan hash di database
    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordMatch) {
      return res.status(401).json(new ErrorResponse('Email atau password salah.'));
    }

    // Generate token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'jobhunt_super_secret_jwt_key_at_least_32_characters_long_2026',
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      }
    );

    return res.status(200).json(
      new SuccessResponse('Login berhasil!', {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      })
    );
  } catch (error) {
    next(error);
  }
};

// 3. Controller untuk Melihat Profil Sendiri (Current User)
const getMe = async (req, res, next) => {
  try {
    // req.user sudah diisi otomatis oleh middleware verifyToken
    return res.status(200).json(
      new SuccessResponse('Berhasil mengambil profil pengguna.', req.user)
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe
};
