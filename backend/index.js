require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

// Import Response Helper dan DB Connection yang sudah dipisah
const { SuccessResponse, ErrorResponse } = require("./src/utils/response");
const { getPool, checkConnection } = require("./src/config/db");

// Middleware Global
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Healthcheck Route Wajib sesuai Guideline
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Root route
app.get("/", (req, res) => {
  res.status(200).json(
    new SuccessResponse("Healthcheck route: Safe JobHunt API", {
      health: "/api/health",
    }),
  );
});

// 2. Import Router yang sudah dipisah
const authRouter = require("./src/routes/auth.routes");
const jobRouter = require("./src/routes/job.routes");
const applicationRouter = require("./src/routes/application.routes");

app.use("/api/auth", authRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/applications", applicationRouter);

// 3. 404 Route Handler jika route tidak ditemukan
app.use((req, res) => {
  res.status(404).json(new ErrorResponse("Route tidak ditemukan", null));
});

// 4. Global Error Handler
app.use((err, req, res, next) => {
  const statusErr = err.statusCode || 500;
  console.error(err);
  res
    .status(statusErr)
    .json(new ErrorResponse(err.message || "Internal server error"));
});

// 5. Hubungkan ke Database terlebih dahulu, baru jalankan Server
checkConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`JobHunt API running on port ${PORT}.`);
      console.log(`Healthcheck: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
    console.warn("Pastikan MySQL aktif dan konfigurasi database sudah benar.");
  });

module.exports = app;
