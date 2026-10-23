const { getPool } = require('../config/db');

// Model untuk mengelola query tabel `users`
const UserModel = {
  // Cari user berdasarkan email (digunakan saat registrasi & login)
  async findByEmail(email) {
    const db = getPool();
    const [rows] = await db.query(
      'SELECT id, name, email, password_hash, role, created_at FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  },

  // Cari user berdasarkan id (digunakan untuk endpoint /me dan verifyToken)
  async findById(id) {
    const db = getPool();
    const [rows] = await db.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  // Buat user baru ke dalam database
  async create({ name, email, password_hash, role }) {
    const db = getPool();
    const [result] = await db.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, password_hash, role]
    );
    return result.insertId;
  }
};

module.exports = UserModel;
