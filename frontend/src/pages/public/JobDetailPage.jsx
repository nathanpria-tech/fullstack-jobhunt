import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { useAuth, useJobDetail, useApplyJob } from '../../hooks';
import { useToast } from '../../contexts/ToastContext';
import { JobTypeBadge, JobStatusBadge } from '../../components/common/Badge';
import { DetailSkeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { Modal } from '../../components/common/Modal';
import { formatSalaryRange, formatDate, formatRelativeDate } from '../../utils/formatters';
import {
  Building2,
  MapPin,
  Banknote,
  Clock,
  Users,
  Mail,
  Send,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Briefcase,
  Share2,
} from 'lucide-react';

export const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isJobSeeker, isRecruiter } = useAuth();
  const { showSuccess, showError } = useToast();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [hasAppliedLocally, setHasAppliedLocally] = useState(false);

  // Fetch Job Detail via custom hook
  const {
    data: job,
    isLoading,
    isError,
    error,
    refetch,
  } = useJobDetail(id);

  // Apply Mutation via custom hook
  const applyMutation = useApplyJob();

  const handleApplySubmit = (e) => {
    e.preventDefault();
    applyMutation.mutate(
      { jobId: id, cover_letter: coverLetter },
      {
        onSuccess: (res) => {
          showSuccess(res?.message || 'Lamaran Anda berhasil dikirimkan!');
          setIsApplyModalOpen(false);
          setCoverLetter('');
          setHasAppliedLocally(true);
        },
        onError: (err) => {
          const msg = err.response?.data?.message || 'Gagal mengirimkan lamaran pekerjaan.';
          showError(msg);
        },
      }
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${job?.title} di ${job?.company}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showSuccess('Tautan lowongan berhasil disalin ke clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <DetailSkeleton />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="py-16 max-w-xl mx-auto px-4">
        <ErrorState
          title="Lowongan Tidak Ditemukan"
          message={error?.response?.data?.message || 'Lowongan yang Anda cari mungkin telah dihapus atau tidak tersedia.'}
          onRetry={refetch}
        />
        <div className="text-center mt-4">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog Lowongan</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF9] min-h-screen py-8 md:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Semua Lowongan</span>
        </Link>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-stone-200/80 shadow-sm relative overflow-hidden">
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400" />

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <JobTypeBadge type={job.type} />
                <JobStatusBadge isActive={job.is_active} />
                <span className="text-xs text-stone-400 font-medium">
                  Diposting {formatRelativeDate(job.created_at)}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-stone-600 text-sm">
                <div className="flex items-center gap-1.5 font-bold text-stone-900">
                  <Building2 className="w-4 h-4 text-orange-600" />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-stone-400" />
                  <span>{job.location}</span>
                </div>
                {job.recruiter_name && (
                  <div className="flex items-center gap-1.5 text-xs text-stone-500">
                    <span>Recruiter:</span>
                    <strong className="text-stone-700">{job.recruiter_name}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions (Share & Apply) */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              {job.is_active ? (
                isAuthenticated ? (
                  isJobSeeker ? (
                    <button
                      onClick={() => setIsApplyModalOpen(true)}
                      disabled={hasAppliedLocally}
                      className={`px-6 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                        hasAppliedLocally
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20 active:scale-95 cursor-pointer'
                      }`}
                    >
                      {hasAppliedLocally ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Sudah Dilamar</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Lamar Lowongan Ini</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="p-3 bg-stone-100 rounded-xl text-center text-xs text-stone-600 font-medium max-w-[200px]">
                      Akun Recruiter tidak dapat melamar
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => navigate('/login', { state: { from: window.location.pathname } })}
                    className="px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Masuk untuk Melamar</span>
                  </button>
                )
              ) : (
                <div className="px-6 py-3.5 rounded-xl bg-stone-200 text-stone-500 font-bold text-sm flex items-center justify-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Lowongan Ditutup</span>
                </div>
              )}

              <button
                onClick={handleShare}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Bagikan Lowongan</span>
              </button>
            </div>
          </div>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-stone-100 text-xs">
            <div className="bg-[#FAF6F0] p-3.5 rounded-2xl">
              <span className="text-stone-400 block mb-1">Perkiraan Gaji</span>
              <p className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <Banknote className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{formatSalaryRange(job.salary_min, job.salary_max)}</span>
              </p>
            </div>

            <div className="bg-[#FAF6F0] p-3.5 rounded-2xl">
              <span className="text-stone-400 block mb-1">Total Pelamar</span>
              <p className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <Users className="w-4 h-4 text-orange-600 shrink-0" />
                <span>{job.total_applicants || 0} Kandidat</span>
              </p>
            </div>

            <div className="bg-[#FAF6F0] p-3.5 rounded-2xl col-span-2 sm:col-span-1">
              <span className="text-stone-400 block mb-1">Tanggal Publikasi</span>
              <p className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-stone-500 shrink-0" />
                <span>{formatDate(job.created_at)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Description & Requirements Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Job Body */}
          <div className="md:col-span-2 space-y-6">
            {/* Description Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-orange-600" />
                <span>Deskripsi Pekerjaan</span>
              </h2>
              <div className="text-stone-700 text-sm leading-relaxed whitespace-pre-line font-normal">
                {job.description}
              </div>
            </div>

            {/* Requirements Card */}
            {job.requirements && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Kualifikasi & Persyaratan</span>
                </h2>
                <div className="text-stone-700 text-sm leading-relaxed whitespace-pre-line font-normal">
                  {job.requirements}
                </div>
              </div>
            )}
          </div>

          {/* Company / Recruiter Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Tentang Perusahaan
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-700 font-extrabold text-lg">
                  {job.company.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">{job.company}</h4>
                  <p className="text-xs text-stone-500">{job.location}</p>
                </div>
              </div>

              {job.recruiter_email && (
                <div className="pt-3 border-t border-stone-100 text-xs text-stone-600 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-600 shrink-0" />
                  <span className="truncate">{job.recruiter_email}</span>
                </div>
              )}
            </div>

            {/* Safety Tip Card */}
            <div className="bg-[#FAF6F0] rounded-3xl p-6 border border-orange-100 text-xs text-stone-600 space-y-2">
              <h4 className="font-bold text-stone-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span>Tips Keamanan Pelamar</span>
              </h4>
              <p className="leading-relaxed">
                JobHunt tidak pernah memungut biaya apapun dari pencari kerja dalam proses rekrutmen. Hati-hati terhadap segala bentuk penipuan yang meminta transfer uang atau dokumen sensitif.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title={`Lamar: ${job.title}`}
      >
        <form onSubmit={handleApplySubmit} className="space-y-4">
          <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-xs text-orange-950 space-y-1">
            <p>
              <strong>Perusahaan:</strong> {job.company}
            </p>
            <p>
              <strong>Pelamar:</strong> {user?.name} ({user?.email})
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Surat Lamaran / Cover Letter (Opsional)
            </label>
            <textarea
              rows={5}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Jelaskan secara singkat mengapa Anda cocok untuk posisi ini, pengalaman relevan, serta portofolio Anda..."
              className="w-full p-3 bg-[#FAF6F0] rounded-xl border border-stone-200 text-stone-800 text-xs focus:outline-hidden focus:border-orange-500 focus:bg-white transition-all resize-y"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsApplyModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-semibold text-xs hover:bg-stone-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={applyMutation.isPending}
              className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {applyMutation.isPending ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Mengirimkan...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Lamaran Sekarang</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
