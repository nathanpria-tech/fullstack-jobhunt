import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMyApplications } from '../../hooks';
import { JobTypeBadge, ApplicationStatusBadge } from '../../components/common/Badge';
import { TableRowSkeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { Modal } from '../../components/common/Modal';
import { formatSalaryRange, formatDate } from '../../utils/formatters';
import {
  FileText,
  Building,
  MapPin,
  Clock,
  ArrowUpRight,
  Filter,
  Eye,
  Briefcase,
} from 'lucide-react';

export const ApplicationsPage = () => {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCoverLetter, setSelectedCoverLetter] = useState(null);

  const { applications, isLoading, isError, error, refetch } = useMyApplications();

  const filteredApplications = applications.filter((app) => {
    if (statusFilter === 'ALL') return true;
    return app.status === statusFilter;
  });

  const statusTabs = [
    { key: 'ALL', label: 'Semua Lamaran', count: applications.length },
    { key: 'pending', label: 'Menunggu', count: applications.filter((a) => a.status === 'pending').length },
    { key: 'reviewed', label: 'Ditinjau', count: applications.filter((a) => a.status === 'reviewed').length },
    { key: 'rejected', label: 'Tidak Lolos', count: applications.filter((a) => a.status === 'rejected').length },
  ];

  return (
    <div className="bg-[#FFFDF9] min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight mb-2">
              Riwayat Lamaran Kerja
            </h1>
            <p className="text-stone-500 text-sm">
              Pantau seluruh status berkas dan lamaran yang pernah Anda kirimkan.
            </p>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-sm transition-all self-start sm:self-auto cursor-pointer"
          >
            <Briefcase className="w-4 h-4" />
            <span>Cari Lowongan Lain</span>
          </Link>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-stone-100/80 rounded-2xl max-w-fit">
          {statusTabs.map((tab) => (
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

        {/* Content Section */}
        {isLoading ? (
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm">
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse flex justify-between p-4 bg-stone-50 rounded-2xl">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-40 bg-stone-200 rounded" />
                    <div className="h-6 w-60 bg-stone-200 rounded" />
                  </div>
                  <div className="h-8 w-24 bg-stone-200 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ) : isError ? (
          <ErrorState
            title="Gagal Memuat Riwayat Lamaran"
            message={error?.response?.data?.message || 'Server tidak dapat dihubungi.'}
            onRetry={refetch}
          />
        ) : filteredApplications.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={
              statusFilter === 'ALL'
                ? 'Belum Ada Lamaran yang Dikirim'
                : `Tidak Ada Lamaran dengan Status "${statusFilter}"`
            }
            description="Mulai kirimkan lamaran ke posisi pekerjaan yang sesuai dengan kualifikasi dan minat Anda."
            actionText="Jelajahi Lowongan Pekerjaan"
            actionLink="/jobs"
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredApplications.map((app) => (
              <div
                key={app.application_id}
                className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm hover:border-orange-200 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Job & Company Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <JobTypeBadge type={app.type} />
                    <ApplicationStatusBadge status={app.status} />
                  </div>

                  <Link to={`/jobs/${app.job_id}`}>
                    <h3 className="text-lg font-bold text-stone-900 hover:text-orange-600 transition-colors">
                      {app.job_title}
                    </h3>
                  </Link>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500">
                    <div className="flex items-center gap-1 font-semibold text-stone-700">
                      <Building className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                      <span>{app.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{app.location}</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-700 font-medium">
                      <span>{formatSalaryRange(app.salary_min, app.salary_max)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-stone-400 pt-1">
                    <Clock className="w-3 h-3" />
                    <span>Dilamar pada: {formatDate(app.applied_at)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-stone-100">
                  {app.cover_letter && (
                    <button
                      onClick={() =>
                        setSelectedCoverLetter({
                          jobTitle: app.job_title,
                          company: app.company,
                          text: app.cover_letter,
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lihat Cover Letter</span>
                    </button>
                  )}

                  <Link
                    to={`/jobs/${app.job_id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white font-semibold text-xs transition-all cursor-pointer"
                  >
                    <span>Detail Lowongan</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cover Letter Modal View */}
      <Modal
        isOpen={!!selectedCoverLetter}
        onClose={() => setSelectedCoverLetter(null)}
        title={`Surat Lamaran: ${selectedCoverLetter?.jobTitle || ''}`}
      >
        <div className="space-y-4">
          <p className="text-xs text-stone-500 font-medium">
            Perusahaan: <strong className="text-stone-800">{selectedCoverLetter?.company}</strong>
          </p>
          <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-stone-200 text-xs text-stone-700 whitespace-pre-line leading-relaxed max-h-80 overflow-y-auto">
            {selectedCoverLetter?.text}
          </div>
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setSelectedCoverLetter(null)}
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
