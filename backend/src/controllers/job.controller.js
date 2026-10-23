const JobModel = require('../models/job.model');
const { SuccessResponse, ErrorResponse } = require('../utils/response');
const VALID_JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship'];
const REQUIRED_TEXT_FIELDS = ['title', 'company', 'location', 'description'];

const isValidSalary = (value) =>
  value === undefined || value === null || value === '' ||
  (Number.isInteger(Number(value)) && Number(value) >= 0);
const salaryValue = (value) =>
  value === undefined || value === null || value === '' ? null : Number(value);

// 1. Ambil semua lowongan aktif (Search, Filter Kategori, Filter Gaji, Sorting, Pagination)
const getAllJobs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      keyword = '',
      type = '',
      location = '',
      salary_min = null,
      salary_max = null,
      sort = 'latest'
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    if (!Number.isInteger(pageNumber) || pageNumber < 1 ||
        !Number.isInteger(limitNumber) || limitNumber < 1 || limitNumber > 100) {
      return res.status(400).json(new ErrorResponse('Page harus positif dan limit harus antara 1 sampai 100.'));
    }
    if (typeof keyword !== 'string' || typeof type !== 'string' ||
        typeof location !== 'string' || typeof sort !== 'string' ||
        !['latest', 'popular'].includes(sort) ||
        (type && !VALID_JOB_TYPES.includes(type))) {
      return res.status(400).json(new ErrorResponse('Parameter pencarian atau filter tidak valid.'));
    }
    if (!isValidSalary(salary_min) || !isValidSalary(salary_max)) {
      return res.status(400).json(new ErrorResponse('Filter gaji harus berupa bilangan bulat positif.'));
    }

    const result = await JobModel.findAll({
      page: pageNumber,
      limit: limitNumber,
      keyword,
      type,
      location,
      salary_min: salaryValue(salary_min),
      salary_max: salaryValue(salary_max),
      sort
    });

    return res.status(200).json(
      new SuccessResponse('Berhasil mengambil daftar lowongan pekerjaan.', result)
    );
  } catch (error) {
    next(error);
  }
};

// 2. Ambil detail satu lowongan berdasarkan ID (Public)
const getJobDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await JobModel.findById(id);

    if (!job) {
      return res.status(404).json(new ErrorResponse('Lowongan pekerjaan tidak ditemukan.'));
    }

    return res.status(200).json(
      new SuccessResponse('Berhasil mengambil detail lowongan pekerjaan.', job)
    );
  } catch (error) {
    next(error);
  }
};

// 3. Ambil daftar lowongan milik recruiter yang sedang login (Recruiter)
const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await JobModel.findByRecruiter(req.user.id);
    return res.status(200).json(
      new SuccessResponse('Berhasil mengambil daftar lowongan milik Anda.', jobs)
    );
  } catch (error) {
    next(error);
  }
};

// 4. Posting lowongan pekerjaan baru (Recruiter)
const createJob = async (req, res, next) => {
  try {
    const {
      title,
      company,
      location,
      type,
      description,
      requirements,
      salary_min,
      salary_max
    } = req.body;

    if (REQUIRED_TEXT_FIELDS.some((field) =>
      typeof req.body[field] !== 'string' || !req.body[field].trim()
    )) {
      return res.status(400).json(
        new ErrorResponse('Harap lengkapi kolom wajib: title, company, location, type, dan description.')
      );
    }

    // Validasi jenis tipe pekerjaan
    if (!VALID_JOB_TYPES.includes(type)) {
      return res.status(400).json(
        new ErrorResponse(`Tipe pekerjaan harus salah satu dari: ${VALID_JOB_TYPES.join(', ')}.`)
      );
    }

    if (title.length > 200 || company.length > 150 || location.length > 150) {
      return res.status(400).json(
        new ErrorResponse('Judul maksimal 200 karakter, perusahaan dan lokasi maksimal 150 karakter.')
      );
    }

    if (requirements !== undefined && requirements !== null && typeof requirements !== 'string') {
      return res.status(400).json(new ErrorResponse('Requirements harus berupa teks.'));
    }

    if (!isValidSalary(salary_min) || !isValidSalary(salary_max)) {
      return res.status(400).json(new ErrorResponse('Gaji harus berupa bilangan bulat positif.'));
    }

    if (salary_min !== undefined && salary_min !== null && salary_min !== '' &&
        salary_max !== undefined && salary_max !== null && salary_max !== '' &&
        Number(salary_min) > Number(salary_max)) {
      return res.status(400).json(
        new ErrorResponse('Nilai salary_min tidak boleh lebih besar dari salary_max.')
      );
    }

    const newJobId = await JobModel.create({
      recruiter_id: req.user.id,
      title,
      company,
      location,
      type,
      description,
      requirements,
      salary_min: salaryValue(salary_min),
      salary_max: salaryValue(salary_max)
    });

    return res.status(201).json(
      new SuccessResponse('Lowongan pekerjaan berhasil dibuat dan dipublikasikan!', {
        id: newJobId,
        recruiter_id: req.user.id,
        title,
        company,
        location,
        type,
        salary_min,
        salary_max
      })
    );
  } catch (error) {
    next(error);
  }
};

// 5. Update lowongan pekerjaan (Recruiter pemilik job)
const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      company,
      location,
      type,
      description,
      requirements,
      salary_min,
      salary_max,
      is_active
    } = req.body;

    // Cek keberadaan lowongan
    const existingJob = await JobModel.findById(id);
    if (!existingJob) {
      return res.status(404).json(new ErrorResponse('Lowongan pekerjaan tidak ditemukan.'));
    }

    // Pengecekan Kepemilikan (Ownership Check): Hanya pembuat yang boleh mengedit
    if (existingJob.recruiter_id !== req.user.id) {
      return res.status(403).json(
        new ErrorResponse('Akses ditolak. Anda hanya dapat mengubah lowongan milik Anda sendiri.')
      );
    }

    if (type !== undefined && !VALID_JOB_TYPES.includes(type)) {
      return res.status(400).json(
        new ErrorResponse(`Tipe pekerjaan harus salah satu dari: ${VALID_JOB_TYPES.join(', ')}.`)
      );
    }

    const textFields = { title, company, location, description };
    for (const [field, value] of Object.entries(textFields)) {
      if (value !== undefined && (typeof value !== 'string' || !value.trim())) {
        return res.status(400).json(new ErrorResponse(`${field} harus berupa teks dan tidak boleh kosong.`));
      }
    }

    if ((title !== undefined && title.length > 200) ||
        (company !== undefined && company.length > 150) ||
        (location !== undefined && location.length > 150)) {
      return res.status(400).json(
        new ErrorResponse('Judul maksimal 200 karakter, perusahaan dan lokasi maksimal 150 karakter.')
      );
    }

    if (requirements !== undefined && requirements !== null && typeof requirements !== 'string') {
      return res.status(400).json(new ErrorResponse('Requirements harus berupa teks.'));
    }
    if (is_active !== undefined && typeof is_active !== 'boolean') {
      return res.status(400).json(new ErrorResponse('is_active harus berupa boolean.'));
    }
    if (!isValidSalary(salary_min) || !isValidSalary(salary_max)) {
      return res.status(400).json(new ErrorResponse('Gaji harus berupa bilangan bulat positif.'));
    }

    const finalMin = salary_min !== undefined ? salaryValue(salary_min) : existingJob.salary_min;
    const finalMax = salary_max !== undefined ? salaryValue(salary_max) : existingJob.salary_max;
    if (finalMin !== null && finalMax !== null && Number(finalMin) > Number(finalMax)) {
      return res.status(400).json(
        new ErrorResponse('Nilai salary_min tidak boleh lebih besar dari salary_max.')
      );
    }

    await JobModel.update(id, {
      title,
      company,
      location,
      type,
      description,
      requirements,
      salary_min,
      salary_max,
      is_active
    });

    return res.status(200).json(
      new SuccessResponse('Lowongan pekerjaan berhasil diperbarui.')
    );
  } catch (error) {
    next(error);
  }
};

// 6. Hapus lowongan pekerjaan (Recruiter pemilik job)
const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Cek keberadaan lowongan
    const existingJob = await JobModel.findById(id);
    if (!existingJob) {
      return res.status(404).json(new ErrorResponse('Lowongan pekerjaan tidak ditemukan.'));
    }

    // Pengecekan Kepemilikan (Ownership Check): Hanya pembuat yang boleh menghapus
    if (existingJob.recruiter_id !== req.user.id) {
      return res.status(403).json(
        new ErrorResponse('Akses ditolak. Anda hanya dapat menghapus lowongan milik Anda sendiri.')
      );
    }

    await JobModel.delete(id);

    return res.status(200).json(
      new SuccessResponse('Lowongan pekerjaan berhasil dihapus.')
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllJobs,
  getJobDetail,
  getMyJobs,
  createJob,
  updateJob,
  deleteJob
};
