const { getPool } = require('../config/db');

// Model untuk mengelola tabel `applications`
const ApplicationModel = {
  // 1. Simpan lamaran baru
  async create({ job_id, applicant_id, cover_letter }) {
    const db = getPool();
    const query = `
      INSERT INTO applications (job_id, applicant_id, cover_letter, status) 
      VALUES (?, ?, ?, 'pending')
    `;
    const [result] = await db.query(query, [job_id, applicant_id, cover_letter || null]);
    return result.insertId;
  },

  // 2. Cek apakah pelamar sudah pernah melamar pekerjaan yang sama (mencegah duplikasi)
  async findByJobAndApplicant(job_id, applicant_id) {
    const db = getPool();
    const query = `
      SELECT * FROM applications 
      WHERE job_id = ? AND applicant_id = ?
    `;
    const [rows] = await db.query(query, [job_id, applicant_id]);
    return rows[0] || null;
  },

  // 3. Ambil riwayat lamaran milik pelamar yang sedang login (/api/applications/mine)
  async findByApplicant(applicant_id) {
    const db = getPool();
    const query = `
      SELECT 
        a.id AS application_id,
        a.job_id,
        a.cover_letter,
        a.status,
        a.applied_at,
        j.title AS job_title,
        j.company,
        j.location,
        j.type,
        j.salary_min,
        j.salary_max
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.applicant_id = ?
      ORDER BY a.applied_at DESC
    `;
    const [rows] = await db.query(query, [applicant_id]);
    return rows;
  },

  // 4. Ambil daftar pelamar untuk lowongan tertentu (/api/jobs/:id/applicants)
  async findByJob(job_id) {
    const db = getPool();
    const query = `
      SELECT 
        a.id AS application_id,
        a.job_id,
        a.cover_letter,
        a.status,
        a.applied_at,
        u.id AS applicant_id,
        u.name AS applicant_name,
        u.email AS applicant_email
      FROM applications a
      JOIN users u ON a.applicant_id = u.id
      WHERE a.job_id = ?
      ORDER BY a.applied_at DESC
    `;
    const [rows] = await db.query(query, [job_id]);
    return rows;
  },

  // 5. Cari detail satu aplikasi (termasuk pemilik job untuk otorisasi update status)
  async findById(id) {
    const db = getPool();
    const query = `
      SELECT 
        a.*,
        j.recruiter_id,
        j.title AS job_title
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.id = ?
    `;
    const [rows] = await db.query(query, [id]);
    return rows[0] || null;
  },

  // 6. Update status lamaran oleh recruiter
  async updateStatus(id, status) {
    const db = getPool();
    const [result] = await db.query('UPDATE applications SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows > 0;
  }
};

module.exports = ApplicationModel;
