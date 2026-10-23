import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useJobs } from '../../hooks/useJobs';
import { useDebounce } from '../../hooks/useDebounce';
import { JobCard } from '../../components/common/JobCard';
import { JobCardSkeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { formatSalary } from '../../utils/formatters';
import {
  Search,
  MapPin,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Banknote,
  ArrowUpDown,
  X,
  Sparkles,
} from 'lucide-react';

const JOB_TYPES = [
  { value: '', label: 'Semua' },
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
];

const SALARY_PRESETS = [
  { label: 'Semua Gaji', min: '', max: '' },
  { label: '≥ 5 Juta', min: '5000000', max: '' },
  { label: '≥ 10 Juta', min: '10000000', max: '' },
  { label: '≥ 20 Juta', min: '20000000', max: '' },
  { label: '5 - 15 Juta', min: '5000000', max: '15000000' },
];

export const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Local state inputs
  const [keywordInput, setKeywordInput] = useState(searchParams.get('keyword') || '');
  const [locationInput, setLocationInput] = useState(searchParams.get('location') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [salaryMin, setSalaryMin] = useState(searchParams.get('salary_min') || '');
  const [salaryMax, setSalaryMax] = useState(searchParams.get('salary_max') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'latest');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Debounced real-time values (300ms sesuai requirement Step 4.2)
  const debouncedKeyword = useDebounce(keywordInput, 300);
  const debouncedLocation = useDebounce(locationInput, 300);

  // Sync state when URL params change externally
  useEffect(() => {
    setKeywordInput(searchParams.get('keyword') || '');
    setLocationInput(searchParams.get('location') || '');
    setType(searchParams.get('type') || '');
    setSalaryMin(searchParams.get('salary_min') || '');
    setSalaryMax(searchParams.get('salary_max') || '');
    setSort(searchParams.get('sort') || 'latest');
    setPage(Number(searchParams.get('page')) || 1);
  }, [searchParams]);

  // Update URL search parameters
  const updateQueryParams = (updates) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        nextParams.set(key, val);
      } else {
        nextParams.delete(key);
      }
    });
    setSearchParams(nextParams);
  };

  // Sync debounced search to URL params and reset page to 1
  useEffect(() => {
    const currentParamKeyword = searchParams.get('keyword') || '';
    if (debouncedKeyword !== currentParamKeyword) {
      updateQueryParams({ keyword: debouncedKeyword, page: 1 });
      setPage(1);
    }
  }, [debouncedKeyword]);

  useEffect(() => {
    const currentParamLocation = searchParams.get('location') || '';
    if (debouncedLocation !== currentParamLocation) {
      updateQueryParams({ location: debouncedLocation, page: 1 });
      setPage(1);
    }
  }, [debouncedLocation]);

  // Query parameters object passed into useJobs custom hook
  const queryParams = useMemo(() => ({
    page,
    limit: 9,
    keyword: debouncedKeyword || undefined,
    location: debouncedLocation || undefined,
    type: type && type !== 'Semua' ? type : undefined,
    salary_min: salaryMin || undefined,
    salary_max: salaryMax || undefined,
    sort,
  }), [page, debouncedKeyword, debouncedLocation, type, salaryMin, salaryMax, sort]);

  // Use custom hook useJobs
  const { jobs, pagination, isLoading, isError, error, refetch } = useJobs(queryParams);

  const handleApplyFilter = (e) => {
    e?.preventDefault();
    setPage(1);
    updateQueryParams({
      keyword: keywordInput,
      location: locationInput,
      type: type === 'Semua' ? '' : type,
      salary_min: salaryMin,
      salary_max: salaryMax,
      sort,
      page: 1,
    });
    setIsMobileFilterOpen(false);
  };

  const handleResetFilter = () => {
    setKeywordInput('');
    setLocationInput('');
    setType('');
    setSalaryMin('');
    setSalaryMax('');
    setSort('latest');
    setPage(1);
    setSearchParams({});
    setIsMobileFilterOpen(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.total_pages) return;
    setPage(newPage);
    updateQueryParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Salary Range Slider Handler (Inovasi Fitur Tambahan)
  const numericSalaryMin = Number(salaryMin) || 0;
  const numericSalaryMax = Number(salaryMax) || 50000000;

  const handleMinSliderChange = (e) => {
    const val = Number(e.target.value);
    setSalaryMin(val > 0 ? String(val) : '');
  };

  const handleMaxSliderChange = (e) => {
    const val = Number(e.target.value);
    setSalaryMax(val < 50000000 ? String(val) : '');
  };

  const handleApplySalaryFilter = () => {
    setPage(1);
    updateQueryParams({
      salary_min: salaryMin,
      salary_max: salaryMax,
      page: 1,
    });
    setIsMobileFilterOpen(false);
  };

  const isFilteringSalary = salaryMin !== '' || salaryMax !== '';

  return (
    <div className="bg-[#FFFDF9] min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Katalog Pekerjaan Aktif</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight mb-2">
            Temukan Karir Terbaik Anda
          </h1>
          <p className="text-stone-500 text-sm">
            Jelajahi ratusan lowongan kerja terverifikasi dengan pencarian real-time dan filter gaji interaktif.
          </p>
        </div>

        {/* Top Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-sm mb-8">
          <form onSubmit={handleApplyFilter} className="flex flex-col lg:flex-row gap-3">
            {/* Keyword Input with Real-time 300ms Debounce */}
            <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 bg-[#FAF6F0] rounded-xl border border-stone-200/60 focus-within:border-orange-500 focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-orange-600 shrink-0" />
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="Cari judul pekerjaan, perusahaan, atau skill... (otomatis)"
                className="w-full bg-transparent text-stone-800 placeholder-stone-400 text-sm focus:outline-hidden"
              />
              {keywordInput && (
                <button
                  type="button"
                  onClick={() => setKeywordInput('')}
                  className="text-stone-400 hover:text-stone-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Location Input with Real-time 300ms Debounce */}
            <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 bg-[#FAF6F0] rounded-xl border border-stone-200/60 focus-within:border-orange-500 focus-within:bg-white transition-all">
              <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Lokasi kota atau ketik 'Remote'..."
                className="w-full bg-transparent text-stone-800 placeholder-stone-400 text-sm focus:outline-hidden"
              />
              {locationInput && (
                <button
                  type="button"
                  onClick={() => setLocationInput('')}
                  className="text-stone-400 hover:text-stone-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="w-full lg:w-48 flex items-center gap-2 px-3.5 py-2.5 bg-[#FAF6F0] rounded-xl border border-stone-200/60">
              <ArrowUpDown className="w-4 h-4 text-stone-400 shrink-0" />
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  updateQueryParams({ sort: e.target.value, page: 1 });
                }}
                className="w-full bg-transparent text-stone-800 text-sm focus:outline-hidden cursor-pointer"
              >
                <option value="latest">Terbaru</option>
                <option value="popular">Paling Banyak Pelamar</option>
              </select>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 lg:flex-none px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                Cari Sekarang
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="lg:hidden p-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 flex items-center gap-1.5"
                aria-label="Filter tambahan"
              >
                <SlidersHorizontal className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-bold">Filter</span>
              </button>
            </div>
          </form>

          {/* Quick Job Type Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-4 mt-3 border-t border-stone-100">
            <span className="text-xs font-semibold text-stone-400 mr-1">Tipe:</span>
            {JOB_TYPES.map(({ value, label }) => {
              const isSelected = type === value;
              return (
                <button
                  key={value || 'all'}
                  type="button"
                  onClick={() => {
                    setType(value);
                    setPage(1);
                    updateQueryParams({ type: value, page: 1 });
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Layout: Sidebar Filter & Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm sticky top-28 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <Filter className="w-4 h-4 text-orange-600" />
                  <span>Filter Lanjutan</span>
                </h3>
                <button
                  onClick={handleResetFilter}
                  className="text-xs text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Semua</span>
                </button>
              </div>

              {/* Inovasi Fitur: Interactive Salary Range Slider */}
              <div className="space-y-4 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5 uppercase tracking-wider">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>Filter Gaji (IDR)</span>
                  </label>
                  {isFilteringSalary && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Aktif
                    </span>
                  )}
                </div>

                {/* Range Readout Display */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-center">
                  <span className="text-[11px] text-stone-500 block mb-0.5">Rentang yang dipilih:</span>
                  <span className="text-xs font-extrabold text-stone-800">
                    {salaryMin ? formatSalary(salaryMin) : 'Rp 0'} – {salaryMax ? formatSalary(salaryMax) : 'Tanpa Batas'}
                  </span>
                </div>

                {/* Dual Sliders: Min & Max */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] text-stone-500 mb-1">
                      <span>Batas Minimum:</span>
                      <strong className="text-stone-700">{salaryMin ? formatSalary(salaryMin) : 'Rp 0'}</strong>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="30000000"
                      step="500000"
                      value={numericSalaryMin}
                      onChange={handleMinSliderChange}
                      className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-stone-500 mb-1">
                      <span>Batas Maksimum:</span>
                      <strong className="text-stone-700">{salaryMax ? formatSalary(salaryMax) : 'Maks (50 Jt+)'}</strong>
                    </div>
                    <input
                      type="range"
                      min="5000000"
                      max="50000000"
                      step="1000000"
                      value={numericSalaryMax}
                      onChange={handleMaxSliderChange}
                      className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                    />
                  </div>
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="text-[11px] text-stone-400 font-semibold block mb-2">Preset Cepat:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {SALARY_PRESETS.map((p, idx) => {
                      const isActive = salaryMin === p.min && salaryMax === p.max;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSalaryMin(p.min);
                            setSalaryMax(p.max);
                            setPage(1);
                            updateQueryParams({
                              salary_min: p.min,
                              salary_max: p.max,
                              page: 1,
                            });
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                          }`}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleApplySalaryFilter}
                  className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                >
                  Terapkan Filter Gaji
                </button>
              </div>
            </div>
          </div>

          {/* Jobs Listing Container */}
          <div className="lg:col-span-3 space-y-6">
            {/* Results Status Header */}
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>
                Menampilkan <strong className="text-stone-800">{jobs.length}</strong> dari{' '}
                <strong className="text-stone-800">{pagination.total_items}</strong> lowongan
              </span>
              <span>
                Halaman {pagination.page} dari {pagination.total_pages || 1}
              </span>
            </div>

            {/* Content States */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            ) : isError ? (
              <ErrorState
                title="Gagal Memuat Daftar Lowongan"
                message={error?.response?.data?.message || 'Server tidak dapat dihubungi.'}
                onRetry={refetch}
              />
            ) : jobs.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="Tidak ada lowongan yang cocok"
                description="Coba ubah kata kunci pencarian, filter lokasi, atau reset filter gaji Anda."
                actionText="Reset Semua Filter"
                onAction={handleResetFilter}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.total_pages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="p-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  aria-label="Halaman sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((p) => {
                  if (
                    p === 1 ||
                    p === pagination.total_pages ||
                    (p >= pagination.page - 1 && p <= pagination.page + 1)
                  ) {
                    return (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={`w-10 h-10 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                          pagination.page === p
                            ? 'bg-orange-600 text-white shadow-sm'
                            : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  }
                  if (p === pagination.page - 2 || p === pagination.page + 2) {
                    return (
                      <span key={p} className="px-1 text-stone-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.total_pages}
                  className="p-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  aria-label="Halaman berikutnya"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-end lg:hidden bg-black/40 backdrop-blur-xs">
            <div className="w-full bg-white rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto space-y-5 animate-slide-up">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-orange-600" />
                  <span>Filter Pencarian & Gaji</span>
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Salary Filter Slider */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5 uppercase tracking-wider">
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <span>Rentang Gaji (Range Slider)</span>
                </label>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
                  <span className="text-xs font-extrabold text-stone-800">
                    {salaryMin ? formatSalary(salaryMin) : 'Rp 0'} – {salaryMax ? formatSalary(salaryMax) : 'Tanpa Batas'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-stone-500 block mb-1">Gaji Minimum: {salaryMin ? formatSalary(salaryMin) : 'Rp 0'}</span>
                    <input
                      type="range"
                      min="0"
                      max="30000000"
                      step="500000"
                      value={numericSalaryMin}
                      onChange={handleMinSliderChange}
                      className="w-full h-2 bg-stone-200 rounded-lg cursor-pointer accent-orange-600"
                    />
                  </div>

                  <div>
                    <span className="text-xs text-stone-500 block mb-1">Gaji Maksimum: {salaryMax ? formatSalary(salaryMax) : 'Maks (50 Jt+)'}</span>
                    <input
                      type="range"
                      min="5000000"
                      max="50000000"
                      step="1000000"
                      value={numericSalaryMax}
                      onChange={handleMaxSliderChange}
                      className="w-full h-2 bg-stone-200 rounded-lg cursor-pointer accent-orange-600"
                    />
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {SALARY_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSalaryMin(p.min);
                        setSalaryMax(p.max);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleResetFilter}
                  className="flex-1 py-3 rounded-xl border border-stone-200 text-stone-700 font-bold text-xs"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleApplyFilter}
                  className="flex-1 py-3 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-md"
                >
                  Terapkan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
