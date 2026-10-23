const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

// Fungsi untuk mendapatkan connection pool MySQL
const getPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'jobhunt_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  return pool;
};

// Fungsi untuk menguji koneksi database sebelum server dinyalakan
const checkConnection = async () => {
  const connection = await getPool().getConnection();
  console.log(`✅ Berhasil terhubung ke database MySQL: ${process.env.DB_NAME || 'jobhunt_db'}`);
  connection.release();
  return pool;
};

module.exports = {
  getPool,
  checkConnection
};
