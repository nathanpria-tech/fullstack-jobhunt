const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/application.controller");
const {
  verifyToken,
  authorizeRoles,
} = require("../middleware/auth.middleware");

// 1. GET /api/applications/mine - Riwayat lamaran user yang sedang login (Job Seeker)
router.get(
  "/mine",
  verifyToken,
  authorizeRoles("job_seeker"),
  applicationController.getMyApplications,
);

// 2. PUT /api/applications/:id - Update status lamaran oleh recruiter pemilik job (Recruiter)
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("recruiter"),
  applicationController.updateStatus,
);

module.exports = router;
