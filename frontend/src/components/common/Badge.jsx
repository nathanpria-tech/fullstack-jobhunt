import React from 'react';

// Badge untuk Tipe Pekerjaan
export const JobTypeBadge = ({ type }) => {
  const styles = {
    'full-time': 'bg-blue-50 text-blue-700 border-blue-200/80',
    'part-time': 'bg-teal-50 text-teal-700 border-teal-200/80',
    contract: 'bg-amber-50 text-amber-800 border-amber-200/80',
    internship: 'bg-purple-50 text-purple-700 border-purple-200/80',
  };
  const labels = {
    'full-time': 'Full-time',
    'part-time': 'Part-time',
    contract: 'Contract',
    internship: 'Internship',
  };

  const styleClass = styles[type] || 'bg-stone-100 text-stone-700 border-stone-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styleClass}`}>
      {labels[type] || type}
    </span>
  );
};

// Badge untuk Status Lamaran
export const ApplicationStatusBadge = ({ status }) => {
  const configs = {
    pending: {
      label: 'Menunggu Review',
      style: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500',
    },
    reviewed: {
      label: 'Sedang Ditinjau',
      style: 'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-blue-500',
    },
    rejected: {
      label: 'Tidak Lolos',
      style: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-500',
    },
  };

  const current = configs[status] || configs.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${current.style}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      {current.label}
    </span>
  );
};

// Badge untuk Role Pengguna
export const RoleBadge = ({ role }) => {
  if (role === 'recruiter') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
        Recruiter
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-800 border border-stone-200">
      Job Seeker
    </span>
  );
};

// Badge Status Lowongan (Aktif / Nonaktif)
export const JobStatusBadge = ({ isActive }) => {
  if (isActive) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Aktif
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-500 border border-stone-200">
      Ditutup
    </span>
  );
};
