// Format angka ke format mata uang Rupiah
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return null;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatSalary = formatCurrency;

// Format rentang gaji dari salary_min & salary_max
export const formatSalaryRange = (min, max) => {
  const minFormatted = formatCurrency(min);
  const maxFormatted = formatCurrency(max);

  if (minFormatted && maxFormatted) {
    return `${minFormatted} - ${maxFormatted}`;
  }
  if (minFormatted && !maxFormatted) {
    return `Mulai dari ${minFormatted}`;
  }
  if (!minFormatted && maxFormatted) {
    return `Hingga ${maxFormatted}`;
  }
  return 'Gaji Kompetitif (Negosiasi)';
};

// Format tanggal ke format bahasa Indonesia
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
};

// Format tanggal relatif (misal: "Hari ini", "2 hari yang lalu")
export const formatRelativeDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Baru saja';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari lalu`;

    return formatDate(dateString);
  } catch {
    return formatDate(dateString);
  }
};
