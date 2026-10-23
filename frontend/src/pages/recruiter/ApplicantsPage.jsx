import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useJobDetail, useJobApplicants, useUpdateApplicationStatus } from '../../hooks';
import { useToast } from '../../contexts/ToastContext';
import { ApplicationStatusBadge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { Modal } from '../../components/common/Modal';
import { formatDate } from '../../utils/formatters';
import {
  Users,
  Mail,
  Calendar,
  FileText,
  ArrowLeft,
  ChevronDown,
  Eye,
  CheckCircle,
  AlertCircle,
  Briefcase,
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Menunggu Review' },
  { value: 'reviewed', label: 'Sedang Ditinjau' },
  { value: 'rejected', label: 'Tidak Lolos' },
];

export const ApplicantsPage = () => {
  const { id } = useParams();
  const { showSuccess, showError } = useToast();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [activeCoverLetter, setActiveCoverLetter] = useState(null);

  // Fetch job details for header context via custom hook
  const { data: job } = useJobDetail(id);

  // Fetch applicants for this job via custom hook
  const {
    applicants = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useJobApplicants(id);

  // Update Application Status Mutation via custom hook
  const updateStatusMutation = useUpdateApplicationStatus();

  const handleStatusChange = (applicationId, status) => {
    updateStatusMutation.mutate(
      { applicationId, status, jobId: id },
      {
        onSuccess: () => {
          showSuccess(`Status pelamar berhasil diperbarui menjadi "${status}".`);
        },
        onError: (err) => {
          const msg = err.response?.data?.message || 'Gagal memperbarui status pelamar.';
          showError(msg);
        },
      }
    );
  };

  const filteredApplicants = applicants.filter((app) => {
    if (statusFilter === 'ALL') return true;
    return app.status === statusFilter;
  });

  const tabs = [
    { key: 'ALL', label: 'Semua', count: applicants.length },
    { key: 'pending', label: 'Menunggu', count: applicants.filter((a) => a.status === 'pending').length },
    { key: 'reviewed', label: 'Ditinjau', count: applicants.filter((a) => a.status === 'reviewed').length },
    { key: 'rejected', label: 'Tidak Lolos', count: applicants.filter((a) => a.status === 'rejected').length },
  ];

  return (
    <div className="bg-[#FFFDF9] min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard Recruiter</span>
        </Link>

        {/* Job Summary Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block mb-1">
              Data Pelamar Pekerjaan
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {job?.title || 'Memuat Posisi Lowongan...'}
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              Perusahaan: <strong className="text-stone-800">{job?.company}</strong> • Lokasi: {job?.location}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto bg-[#FAF6F0] px-4 py-3 rounded-2xl border border-stone-200/60">
            <Users className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-[11px] font-bold text-stone-500 uppercase">Total Kandidat</p>
              <p className="text-lg font-extrabold text-stone-900 leading-tight">
                {applicants.length} Orang
              </p>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-stone-100/80 rounded-2xl max-w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                statusFilter === tab.key
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] ${
                  statusFilter === tab.key
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-stone-200 text-stone-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content Table / Cards */}
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-stone-500 text-sm">
              <div className="w-8 h-8 border-3 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-2" />
              <span>Memuat data pelamar...</span>
            </div>
          ) : isError ? (
            <div className="p-6">
              <ErrorState
                title="Gagal Memuat Pelamar"
                message={error?.response?.data?.message || 'Server tidak dapat merespons.'}
                onRetry={refetch}
              />
            </div>
          ) : filteredApplicants.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={Users}
                title={
                  statusFilter === 'ALL'
                    ? 'Belum Ada Pelamar untuk Lowongan Ini'
                    : `Tidak Ada Pelamar dengan Status "${statusFilter}"`
                }
                description="Ketika ada kandidat yang mengirimkan berkas lamaran, data pelamar beserta surat lamarannya akan otomatis muncul di sini."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FAF6F0] text-stone-600 text-xs font-bold uppercase tracking-wider border-b border-stone-200/60">
                  <tr>
                    <th className="py-4 px-6">Nama & Email Kandidat</th>
                    <th className="py-4 px-4">Tanggal Melamar</th>
                    <th className="py-4 px-4">Surat Lamaran</th>
                    <th className="py-4 px-4">Status Saat Ini</th>
                    <th className="py-4 px-6 text-right">Ubah Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredApplicants.map((app) => (
                    <tr key={app.application_id} className="hover:bg-stone-50/70 transition-colors">
                      {/* Applicant info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-700 font-bold text-xs uppercase shrink-0">
                            {app.applicant_name?.charAt(0) || 'P'}
                          </div>
                          <div>
                            <p className="font-bold text-stone-900 text-sm">{app.applicant_name}</p>
                            <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-stone-400" />
                              <span>{app.applicant_email}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-xs text-stone-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>{formatDate(app.applied_at)}</span>
                        </div>
                      </td>

                      {/* Cover letter */}
                      <td className="py-4 px-4">
                        {app.cover_letter ? (
                          <button
                            onClick={() =>
                              setActiveCoverLetter({
                                applicantName: app.applicant_name,
                                applicantEmail: app.applicant_email,
                                text: app.cover_letter,
                              })
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold text-xs transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Baca Cover Letter</span>
                          </button>
                        ) : (
                          <span className="text-xs text-stone-400 italic">Tidak dilampirkan</span>
                        )}
                      </td>

                      {/* Current Status Badge */}
                      <td className="py-4 px-4">
                        <ApplicationStatusBadge status={app.status} />
                      </td>

                      {/* Update Status Dropdown */}
                      <td className="py-4 px-6 text-right">
                        <select
                          value={app.status}
                          onChange={(e) =>
                            handleStatusChange(app.application_id, e.target.value)
                          }
                          disabled={updateStatusMutation.isPending}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FAF6F0] border border-stone-200 text-stone-800 hover:border-orange-500 focus:outline-hidden cursor-pointer"
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Cover Letter Modal View */}
      <Modal
        isOpen={!!activeCoverLetter}
        onClose={() => setActiveCoverLetter(null)}
        title={`Cover Letter: ${activeCoverLetter?.applicantName || ''}`}
      >
        <div className="space-y-4">
          <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-600">
            <p>
              Email: <strong>{activeCoverLetter?.applicantEmail}</strong>
            </p>
          </div>

          <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-stone-200 text-xs text-stone-800 leading-relaxed whitespace-pre-line max-h-80 overflow-y-auto">
            {activeCoverLetter?.text}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setActiveCoverLetter(null)}
              className="px-4 py-2 rounded-xl bg-stone-800 text-white font-bold text-xs hover:bg-stone-900 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
