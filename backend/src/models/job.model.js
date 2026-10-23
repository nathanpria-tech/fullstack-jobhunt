const { getPool } = require('../config/db');

// Model untuk mengelola tabel `jobs`
const JobModel = {
  // 1. Ambil semua lowongan aktif dengan filter, pencarian, sort, dan pagination
  async findAll({ page = 1, limit = 10, keyword = '', type = '', location = '', salary_min = null, salary_max = null, sort = 'latest' }) {
    const db = getPool();
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        j.id, j.recruiter_id, j.title, j.company, j.location, j.type, 
        j.description, j.requirements, j.salary_min, j.salary_max, j.is_active, j.created_at,
        u.name AS recruiter_name,
        COUNT(a.id) AS total_applicants
      FROM jobs j
      JOIN users u ON j.recruiter_id = u.id
      LEFT JOIN applications a ON j.id = a.job_id
      WHERE j.is_active = TRUE
    `;

    let countQuery = `
      SELECT COUNT(DISTINCT j.id) AS total
      FROM jobs j
      WHERE j.is_active = TRUE
    `;

    const params = [];
    const countParams = [];

    // Filter Keyword (Mencari di title, company, atau description)
    if (keyword && keyword.trim() !== '') {
      const kw = `%${keyword.trim()}%`;
      const kwCondition = ` AND (j.title LIKE ? OR j.company LIKE ? OR j.description LIKE ?)`;
      query += kwCondition;
      countQuery += kwCondition;
      params.push(kw, kw, kw);
      countParams.push(kw, kw, kw);
    }

    // Filter Tipe Pekerjaan (full-time, part-time, dll.)
    if (type && type.trim() !== '') {
      const typeCondition = ` AND j.type = ?`;
      query += typeCondition;
      countQuery += typeCondition;
      params.push(type.trim());
      countParams.push(type.trim());
    }

    // Filter Lokasi
    if (location && location.trim() !== '') {
      const locCondition = ` AND j.location LIKE ?`;
      query += locCondition;
      countQuery += locCondition;
      params.push(`%${location.trim()}%`);
      countParams.push(`%${location.trim()}%`);
    }

    // Fitur Inovatif: Filter Gaji (Rentang Beririsan / Overlap)
    if (salary_min !== null && !isNaN(salary_min)) {
      const minVal = Number(salary_min);
      const minCondition = ` AND (j.salary_max IS NULL OR j.salary_max >= ?)`;
      query += minCondition;
      countQuery += minCondition;
      params.push(minVal);
      countParams.push(minVal);
    }

    if (salary_max !== null && !isNaN(salary_max)) {
      const maxVal = Number(salary_max);
      const maxCondition = ` AND (j.salary_min IS NULL OR j.salary_min <= ?)`;
      query += maxCondition;
      countQuery += maxCondition;
      params.push(maxVal);
      countParams.push(maxVal);
    }

    // Grouping
    query += ` GROUP BY j.id`;

    // Sorting: Paling Banyak Pelamar ('popular') atau Terbaru ('latest')
    if (sort === 'popular') {
      query += ` ORDER BY total_applicants DESC, j.created_at DESC`;
    } else {
      query += ` ORDER BY j.created_at DESC`;
    }

    // Pagination
    query += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    // Eksekusi query data & total item
    const [rows] = await db.query(query, params);
    const [countRows] = await db.query(countQuery, countParams);

    const totalItems = countRows[0] ? countRows[0].total : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      jobs: rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total_items: totalItems,
        total_pages: totalPages
      }
    };
  },

  // 2. Cari satu detail job berdasarkan ID
  async findById(id) {
    const db = getPool();
    const query = `
      SELECT 
        j.id, j.recruiter_id, j.title, j.company, j.location, j.type, 
        j.description, j.requirements, j.salary_min, j.salary_max, j.is_active, j.created_at,
        u.name AS recruiter_name, u.email AS recruiter_email,
        COUNT(a.id) AS total_applicants
      FROM jobs j
      JOIN users u ON j.recruiter_id = u.id
      LEFT JOIN applications a ON j.id = a.job_id
      WHERE j.id = ?
      GROUP BY j.id
    `;
    const [rows] = await db.query(query, [id]);
    return rows[0] || null;
  },

  // 3. Ambil semua lowongan milik satu recruiter tertentu
  async findByRecruiter(recruiter_id) {
    const db = getPool();
    const query = `
      SELECT 
        j.id, j.recruiter_id, j.title, j.company, j.location, j.type, 
        j.description, j.requirements, j.salary_min, j.salary_max, j.is_active, j.created_at,
        COUNT(a.id) AS total_applicants
      FROM jobs j
      LEFT JOIN applications a ON j.id = a.job_id
      WHERE j.recruiter_id = ?
      GROUP BY j.id
      ORDER BY j.created_at DESC
    `;
    const [rows] = await db.query(query, [recruiter_id]);
    return rows;
  },

  // 4. Buat lowongan baru oleh recruiter
  async create({ recruiter_id, title, company, location, type, description, requirements, salary_min, salary_max }) {
    const db = getPool();
    const query = `
      INSERT INTO jobs 
        (recruiter_id, title, company, location, type, description, requirements, salary_min, salary_max) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      recruiter_id,
      title,
      company,
      location,
      type,
      description,
      requirements || null,
      salary_min ?? null,
      salary_max ?? null
    ]);
    return result.insertId;
  },

  // 5. Update lowongan
  async update(id, fields) {
    const db = getPool();
    const columns = ['title', 'company', 'location', 'type', 'description', 'requirements', 'salary_min', 'salary_max', 'is_active'];
    const updates = columns.filter((column) => fields[column] !== undefined);
    if (updates.length === 0) return false;

    const assignments = updates.map((column) => `${column} = ?`).join(', ');
    const values = updates.map((column) => fields[column]);
    const [result] = await db.query(`UPDATE jobs SET ${assignments} WHERE id = ?`, [...values, id]);
    return result.affectedRows > 0;
  },

  // 6. Hapus lowongan
  async delete(id) {
    const db = getPool();
    const [result] = await db.query('DELETE FROM jobs WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = JobModel;
