import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useJobs } from '../../hooks';
import { JobCard } from '../../components/common/JobCard';
import { JobCardSkeleton } from '../../components/common/Skeleton';
import {
  Search,
  MapPin,
  Briefcase,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Building2,
  Users2,
  CheckCircle,
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  // Fetch featured jobs (popular or latest) via useJobs hook
  const {
    jobs: featuredJobs,
    pagination,
    isLoading,
    isError,
  } = useJobs({ limit: 6, sort: 'popular' });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('keyword', keyword.trim());
    if (location.trim()) params.set('location', location.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  const categories = [
    { label: 'Remote Friendly', query: 'location=Remote', icon: '🌐' },
    { label: 'Full-time', query: 'type=full-time', icon: '💼' },
    { label: 'Magang / Internship', query: 'type=internship', icon: '🎓' },
    { label: 'Kontrak', query: 'type=contract', icon: '📝' },
    { label: 'Part-time', query: 'type=part-time', icon: '⏱️' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-gradient-to-b from-[#FFF9F2] via-[#FFFDF9] to-[#FFFDF9]">
        {/* Decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-amber-300/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-orange-800 text-xs font-bold tracking-wide uppercase mb-6 shadow-xs animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Platform Karir & Rekrutmen Modern #1</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.15] max-w-4xl mx-auto mb-6">
            Raih Karir Impian Anda Bersama{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              Ribuan Perusahaan
            </span>{' '}
            Terpercaya
          </h1>

          <p className="text-stone-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Jembatan profesional bagi pencari kerja berbakat dan recruiter yang mencari kandidat terbaik di seluruh Indonesia.
          </p>

          {/* Search Box Card */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl md:rounded-3xl p-3 md:p-4 shadow-xl shadow-orange-950/5 border border-stone-200/90 mb-8">
            <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
              {/* Keyword Input */}
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-[#FAF6F0] rounded-xl border border-stone-200/60 focus-within:border-orange-500 focus-within:bg-white transition-all">
                <Search className="w-5 h-5 text-orange-600 shrink-0" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Posisi pekerjaan, keahlian, atau perusahaan..."
                  className="w-full bg-transparent text-stone-800 placeholder-stone-400 text-sm focus:outline-hidden"
                />
              </div>

              {/* Location Input */}
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-[#FAF6F0] rounded-xl border border-stone-200/60 focus-within:border-orange-500 focus-within:bg-white transition-all">
                <MapPin className="w-5 h-5 text-orange-600 shrink-0" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Lokasi atau 'Remote'..."
                  className="w-full bg-transparent text-stone-800 placeholder-stone-400 text-sm focus:outline-hidden"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="px-8 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Cari Lowongan</span>
              </button>
            </form>

            {/* Quick Filter Categories */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4 mt-2 border-t border-stone-100 text-xs">
              <span className="text-stone-400 font-medium">Paling Dicari:</span>
              {categories.map((cat, idx) => (
                <Link
                  key={idx}
                  to={`/jobs?${cat.query}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 hover:bg-orange-100 text-stone-600 hover:text-orange-700 transition-colors font-medium"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Dual CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/jobs"
              className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Cari Kerja Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/jobs/create"
              className="px-6 py-3 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 font-bold text-sm shadow-xs active:scale-95 transition-all flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4 text-orange-600" />
              <span>Pasang Lowongan (Recruiter)</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="border-y border-stone-200/80 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-3">
              <p className="text-3xl md:text-4xl font-extrabold text-orange-600 mb-1">
                {isLoading ? '…' : isError ? '—' : Number(pagination.total_items).toLocaleString('id-ID')}
              </p>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Lowongan Aktif</p>
            </div>
            <div className="p-3">
              <p className="text-3xl md:text-4xl font-extrabold text-stone-900 mb-1">2</p>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Jenis Pengguna</p>
            </div>
            <div className="p-3">
              <p className="text-3xl md:text-4xl font-extrabold text-stone-900 mb-1">4</p>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Tipe Pekerjaan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
              <TrendingUp className="w-4 h-4" />
              <span>Lowongan Unggulan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Paling Banyak Dilamar
            </h2>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors group"
          >
            <span>Lihat Semua Lowongan</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Job Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center text-rose-800">
            <p className="text-sm font-semibold">Tidak dapat memuat lowongan unggulan saat ini.</p>
          </div>
        ) : featuredJobs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
            <p className="text-stone-500 text-sm">Belum ada lowongan pekerjaan yang dipublikasikan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* Why JobHunt Section */}
      <section className="py-16 bg-[#FAF6F0] border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mb-3">
              Mengapa Memilih JobHunt?
            </h2>
            <p className="text-stone-500 text-sm sm:text-base leading-relaxed">
              Kami menyederhanakan proses pencarian kerja dan rekrutmen talenta dengan pengalaman yang ramah, transparan, dan cepat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 mb-5">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">Pencarian & Filter Cepat</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Filter lowongan berdasarkan gaji, tipe pekerjaan remote maupun on-site, dan lokasi secara akurat tanpa hambatan.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">Perusahaan Terpercaya</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Semua recruiter dan info lowongan diverifikasi untuk menjamin keamanan dan kenyamanan karir Anda.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 mb-5">
                <Users2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">Transparansi Status Lamaran</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Pantau langsung status lamaran Anda secara real-time dari 'Menunggu Review' hingga 'Diterima' tanpa ghosting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recruiter CTA Banner */}
      <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-gradient-to-r from-stone-900 to-stone-800 rounded-3xl p-8 md:p-14 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-orange-600/20 to-transparent pointer-events-none" />
          <div className="max-w-2xl relative z-10">
            <span className="text-orange-400 font-bold text-xs uppercase tracking-wider mb-2 block">
              Untuk Perusahaan & HRD
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Siap Merekrut Talenta Unggul untuk Tim Anda?
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-8">
              Pasang lowongan kerja Anda dalam hitungan menit. Kelola pelamar dengan dashboard interaktif dan tinjau cover letter langsung.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/jobs/create"
                className="px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-600/30 active:scale-95 transition-all"
              >
                Mulai Pasang Lowongan
              </Link>
              <Link
                to="/register"
                className="px-6 py-3.5 rounded-xl bg-stone-700/80 hover:bg-stone-700 text-white font-bold text-sm border border-stone-600 active:scale-95 transition-all"
              >
                Daftar Akun Recruiter
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
