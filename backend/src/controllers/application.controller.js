const ApplicationModel = require('../models/application.model');
const JobModel = require('../models/job.model');
const { SuccessResponse, ErrorResponse } = require('../utils/response');

// 1. Kirim lamaran pekerjaan (Job Seeker)
const applyJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const applicantId = req.user.id;
    const { cover_letter } = req.body;

    // Cek apakah lowongan tersedia dan aktif
    const job = await JobModel.findById(jobId);
    if (!job) {
      return res.status(404).json(new ErrorResponse('Lowongan pekerjaan tidak ditemukan.'));
    }

    if (!job.is_active) {
      return res.status(400).json(
        new ErrorResponse('Lowongan pekerjaan ini sudah tidak aktif menerima lamaran.')
      );
    }

    // Cek apakah pelamar sudah pernah melamar pekerjaan yang sama (Constraint Unique)
    const alreadyApplied = await ApplicationModel.findByJobAndApplicant(jobId, applicantId);
    if (alreadyApplied) {
      return res.status(400).json(
        new ErrorResponse('Anda sudah pernah mengirimkan lamaran untuk lowongan pekerjaan ini.')
      );
    }

    // Simpan lamaran baru
    const applicationId = await ApplicationModel.create({
      job_id: jobId,
      applicant_id: applicantId,
      cover_letter
    });

    return res.status(201).json(
      new SuccessResponse('Lamaran pekerjaan berhasil dikirimkan!', {
        application_id: applicationId,
        job_id: Number(jobId),
        status: 'pending'
      })
    );
  } catch (error) {
    next(error);
  }
};

// 2. Lihat riwayat lamaran milik user yang sedang login (Job Seeker)
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await ApplicationModel.findByApplicant(req.user.id);
    return res.status(200).json(
      new SuccessResponse('Berhasil mengambil riwayat lamaran Anda.', applications)
    );
  } catch (error) {
    next(error);
  }
};

// 3. Lihat daftar pelamar untuk lowongan tertentu (Recruiter pemilik job)
const getJobApplicants = async (req, res, next) => {
  try {
    const jobId = req.params.id;

    // Cek lowongan
    const job = await JobModel.findById(jobId);
    if (!job) {
      return res.status(404).json(new ErrorResponse('Lowongan pekerjaan tidak ditemukan.'));
    }

    // Ownership check: hanya recruiter pembuat job yang bisa melihat pelamarnya
    if (job.recruiter_id !== req.user.id) {
      return res.status(403).json(
        new ErrorResponse('Akses ditolak. Anda hanya dapat melihat pelamar pada lowongan milik Anda sendiri.')
      );
    }

    const applicants = await ApplicationModel.findByJob(jobId);
    return res.status(200).json(
      new SuccessResponse(`Berhasil mengambil daftar pelamar untuk lowongan "${job.title}".`, applicants)
    );
  } catch (error) {
    next(error);
  }
};

// 4. Update status lamaran (Recruiter pemilik lowongan)
const updateStatus = async (req, res, next) => {
  try {
    const applicationId = req.params.id;
    const { status } = req.body;

    // Validasi status yang diperbolehkan
    const validStatuses = ['pending', 'reviewed', 'rejected'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json(
        new ErrorResponse(`Status tidak valid. Pilihan status yang tersedia: ${validStatuses.join(', ')}.`)
      );
    }

    // Cek data lamaran
    const application = await ApplicationModel.findById(applicationId);
    if (!application) {
      return res.status(404).json(new ErrorResponse('Data lamaran tidak ditemukan.'));
    }

    // Ownership check: Pastikan recruiter yang mengupdate adalah pemilik lowongan yang dilamar
    if (application.recruiter_id !== req.user.id) {
      return res.status(403).json(
        new ErrorResponse('Akses ditolak. Anda hanya dapat memperbarui status lamaran pada lowongan milik Anda sendiri.')
      );
    }

    await ApplicationModel.updateStatus(applicationId, status);

    return res.status(200).json(
      new SuccessResponse('Status lamaran berhasil diperbarui.', {
        application_id: Number(applicationId),
        status
      })
    );
  } catch (error) {
    // Handle MySQL data truncation error with a user-friendly message
    if (error.code === 'WARN_DATA_TRUNCATED' || error.code === 'ER_DATA_TOO_LONG') {
      return res.status(400).json(
        new ErrorResponse('Gagal memperbarui status: nilai status tidak valid untuk database. Silakan hubungi administrator.')
      );
    }
    next(error);
  }
};

module.exports = {
  applyJob,
  getMyApplications,
  getJobApplicants,
  updateStatus
};
