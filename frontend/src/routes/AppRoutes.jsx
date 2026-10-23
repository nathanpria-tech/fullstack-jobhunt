import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

// Public Pages
import { LandingPage } from '../pages/public/LandingPage';
import { JobsPage } from '../pages/public/JobsPage';
import { JobDetailPage } from '../pages/public/JobDetailPage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';
import { NotFoundPage } from '../pages/public/NotFoundPage';

// Job Seeker Pages
import { ApplicationsPage } from '../pages/job_seeker/ApplicationsPage';
import { ProfilePage } from '../pages/job_seeker/ProfilePage';

// Recruiter Pages
import { DashboardPage } from '../pages/recruiter/DashboardPage';
import { CreateJobPage } from '../pages/recruiter/CreateJobPage';
import { EditJobPage } from '../pages/recruiter/EditJobPage';
import { ApplicantsPage } from '../pages/recruiter/ApplicantsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Halaman Publik */}
        <Route index element={<LandingPage />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="jobs/:id" element={<JobDetailPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Halaman Profil (Semua Pengguna Terautentikasi) */}
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Halaman Khusus Job Seeker */}
        <Route
          path="applications"
          element={
            <ProtectedRoute allowedRoles={['job_seeker']}>
              <ApplicationsPage />
            </ProtectedRoute>
          }
        />

        {/* Halaman Khusus Recruiter */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="jobs/create"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <CreateJobPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="jobs/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <EditJobPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="jobs/:id/applicants"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <ApplicantsPage />
            </ProtectedRoute>
          }
        />

        {/* 404 Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
