const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const applicationController = require('../controllers/application.controller');
const { verifyToken, authorizeRoles } = require('../middleware/auth.middleware');

// 1. GET /api/jobs - Katalog lowongan aktif (Public, Filter, Search, Sort, Pagination)
router.get('/', jobController.getAllJobs);

// 2. GET /api/jobs/mine - Daftar lowongan milik recruiter yang login (Recruiter)
// Catatan: Harus ditempatkan SEBELUM route '/:id' agar 'mine' tidak dianggap sebagai parameter id
router.get('/mine', verifyToken, authorizeRoles('recruiter'), jobController.getMyJobs);

// 3. GET /api/jobs/:id - Detail satu lowongan pekerjaan (Public)
router.get('/:id', jobController.getJobDetail);

// 4. POST /api/jobs - Posting lowongan baru (Recruiter)
router.post('/', verifyToken, authorizeRoles('recruiter'), jobController.createJob);

// 5. PUT /api/jobs/:id - Edit lowongan milik sendiri (Recruiter)
router.put('/:id', verifyToken, authorizeRoles('recruiter'), jobController.updateJob);

// 6. DELETE /api/jobs/:id - Hapus lowongan milik sendiri (Recruiter)
router.delete('/:id', verifyToken, authorizeRoles('recruiter'), jobController.deleteJob);

// 7. POST /api/jobs/:id/apply - Lamar pekerjaan (Job Seeker)
router.post('/:id/apply', verifyToken, authorizeRoles('job_seeker'), applicationController.applyJob);

// 8. GET /api/jobs/:id/applicants - Daftar pelamar pada lowongan ini (Recruiter)
router.get('/:id/applicants', verifyToken, authorizeRoles('recruiter'), applicationController.getJobApplicants);

module.exports = router;
