import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMyJobs, useDeleteJob, useUpdateJob } from '../../hooks';
import { useToast } from '../../contexts/ToastContext';
import { JobTypeBadge, JobStatusBadge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { Modal } from '../../components/common/Modal';
import { formatSalaryRange, formatDate } from '../../utils/formatters';
import {
  Briefcase,
  Users,
  PlusCircle,
  Eye,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  TrendingUp,
  MapPin,
  Building,
  AlertTriangle,
} from 'lucide-react';

export const DashboardPage = () => {
  const { showSuccess, showError } = useToast();
  const [jobToDelete, setJobToDelete] = useState(null);

  // Fetch recruiter's jobs via custom hook
  const {
    jobs = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useMyJobs();

  // Delete Job Mutation via custom hook
  const deleteMutation = useDeleteJob();

  // Toggle Active Status Mutation via custom hook
  const toggleStatusMutation = useUpdateJob();

  const handleDeleteConfirm = () => {
    if (!jobToDelete) return;
    deleteMutation.mutate(jobToDelete.id, {
      onSuccess: () => {
        showSuccess('Lowongan pekerjaan berhasil dihapus.');
        setJobToDelete(null);
      },
      onError: (err) => {
        showError(err.response?.data?.message || 'Gagal menghapus lowongan pekerjaan.');
      },
    });
  };

  const handleToggleStatus = (job) => {
    toggleStatusMutation.mutate(
      { id: job.id, is_active: !job.is_active },
      {
        onSuccess: () => {
          showSuccess(`Status lowongan berhasil ${!job.is_active ? 'diaktifkan' : 'ditutup'}.`);
        },
        onError: (err) => {
          showError(err.response?.data?.message || 'Gagal mengubah status lowongan.');
        },
      }
    );
  };

  // Summary Metrics
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j.is_active).length;
  const totalApplicants = jobs.reduce((acc, curr) => acc + (Number(curr.total_applicants) || 0), 0);

  return (
    <div className="bg-[#FFFDF9] min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight mb-2">
              Dashboard Recruiter
            </h1>
            <p className="text-stone-500 text-sm">
              Kelola seluruh lowongan pekerjaan dan pantau data pelamar Anda di satu tempat.
            </p>
          </div>
          <Link
            to="/jobs/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/20 active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Pasang Lowongan Baru</span>
          </Link>
        </div>

        {/* Metrics Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Total Lowongan</p>
              <h3 className="text-2xl font-extrabold text-stone-900">{totalJobs}</h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Lowongan Aktif</p>
              <h3 className="text-2xl font-extrabold text-emerald-700">{activeJobs}</h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Total Pelamar Masuk</p>
              <h3 className="text-2xl font-extrabold text-stone-900">{totalApplicants}</h3>
            </div>
          </div>
        </div>

        {/* Job Listings Table */}
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900">Daftar Lowongan Kerja Milik Anda</h2>
            <span className="text-xs text-stone-500 font-medium">{jobs.length} lowongan</span>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-stone-500 text-sm">
              <div className="w-8 h-8 border-3 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-2" />
              <span>Memuat lowongan Anda...</span>
            </div>
          ) : isError ? (
            <div className="p-6">
              <ErrorState
                title="Gagal Memuat Lowongan"
                message={error?.response?.data?.message || 'Server bermasalah.'}
                onRetry={refetch}
              />
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={Briefcase}
                title="Anda Belum Memasang Lowongan"
                description="Mulai publikasikan lowongan pekerjaan pertama Anda untuk menemukan talenta terbaik."
                actionText="Buat Lowongan Sekarang"
                actionLink="/jobs/create"
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FAF6F0] text-stone-600 text-xs font-bold uppercase tracking-wider border-b border-stone-200/60">
                  <tr>
                    <th className="py-4 px-6">Posisi & Perusahaan</th>
                    <th className="py-4 px-4">Tipe & Gaji</th>
                    <th className="py-4 px-4 text-center">Pelamar</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4">Dibuat</th>
                    <th className="py-4 px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-stone-50/70 transition-colors">
                      {/* Title & Company */}
                      <td className="py-4 px-6">
                        <Link
                          to={`/jobs/${job.id}`}
                          className="font-bold text-stone-900 hover:text-orange-600 transition-colors block text-base"
                        >
                          {job.title}
                        </Link>
                        <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Building className="w-3 h-3 text-orange-600" />
                            {job.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            {job.location}
                          </span>
                        </div>
                      </td>

                      {/* Type & Salary */}
                      <td className="py-4 px-4">
                        <JobTypeBadge type={job.type} />
                        <p className="text-xs text-stone-600 font-medium mt-1">
                          {formatSalaryRange(job.salary_min, job.salary_max)}
                        </p>
                      </td>

                      {/* Applicants */}
                      <td className="py-4 px-4 text-center">
                        <Link
                          to={`/jobs/${job.id}/applicants`}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100/80 hover:bg-orange-200 text-orange-800 font-extrabold text-xs transition-colors"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>{job.total_applicants || 0}</span>
                        </Link>
                      </td>

                      {/* Status & Toggle */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleStatus(job)}
                          title="Klik untuk ubah status aktif/tutup"
                          className="cursor-pointer"
                        >
                          <JobStatusBadge isActive={job.is_active} />
                        </button>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-xs text-stone-500">
                        {formatDate(job.created_at)}
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/jobs/${job.id}/applicants`}
                            title="Lihat Daftar Pelamar"
                            className="p-2 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
                          >
                            <Users className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/jobs/${job.id}/edit`}
                            title="Edit Lowongan"
                            className="p-2 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setJobToDelete(job)}
                            title="Hapus Lowongan"
                            className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!jobToDelete}
        onClose={() => setJobToDelete(null)}
        title="Konfirmasi Hapus Lowongan"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-rose-50 rounded-2xl border border-rose-200 text-rose-900">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-sm">Apakah Anda yakin ingin menghapus lowongan ini?</p>
              <p>
                Posisi: <strong>{jobToDelete?.title}</strong> di <strong>{jobToDelete?.company}</strong>
              </p>
              <p className="text-rose-700 pt-1">
                Tindakan ini akan menghapus data lowongan beserta seluruh riwayat lamaran yang terhubung secara permanen.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setJobToDelete(null)}
              className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-semibold text-xs hover:bg-stone-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={deleteMutation.isPending}
              onClick={handleDeleteConfirm}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {deleteMutation.isPending ? 'Menghapus...' : 'Ya, Hapus Permanen'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
