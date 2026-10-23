import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { RoleBadge } from '../../components/common/Badge';
import { formatDate } from '../../utils/formatters';
import {
  User,
  Mail,
  Calendar,
  Briefcase,
  FileText,
  LogOut,
  Shield,
  PlusCircle,
  LayoutDashboard,
} from 'lucide-react';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showSuccess } = useToast();

  const { data: userProfile, isLoading, isError } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const res = await api.get('/auth/me');
      return res.data;
    },
  });

  const handleLogout = () => {
    logout();
    showSuccess('Anda telah keluar dari akun.');
    navigate('/login');
  };

  const isRecruiter = userProfile?.role === 'recruiter';

  return (
    <div className="bg-[#FFFDF9] min-h-screen py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight mb-2">
            Profil Pengguna
          </h1>
          <p className="text-stone-500 text-sm">
            Informasi akun dan aksesibilitas akun JobHunt Anda.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-stone-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-orange-600/20">
                {userProfile?.name?.charAt(0) || 'U'}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                    {userProfile?.name}
                  </h2>
                  <RoleBadge role={userProfile?.role} />
                </div>
                <p className="text-xs sm:text-sm text-stone-500 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-stone-400" />
                  <span>{userProfile?.email}</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs transition-colors self-start sm:self-auto cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar dari Akun</span>
            </button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
            <div className="bg-[#FAF6F0] p-4 rounded-2xl space-y-1">
              <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider block">
                ID Pengguna
              </span>
              <p className="font-bold text-stone-800 text-sm">#{userProfile?.id}</p>
            </div>

            <div className="bg-[#FAF6F0] p-4 rounded-2xl space-y-1">
              <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider block">
                Tanggal Bergabung
              </span>
              <p className="font-bold text-stone-800 text-sm flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-orange-600" />
                <span>{formatDate(userProfile?.created_at)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Role Privileges & Quick Links */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-orange-600" />
            <span>Hak Akses Akun: {userProfile?.role}</span>
          </h3>

          {isRecruiter ? (
            <div className="space-y-4">
              <p className="text-xs text-stone-500 leading-relaxed">
                Sebagai recruiter, Anda memiliki wewenang untuk memasang lowongan pekerjaan, mengedit, menutup, dan meninjau seluruh surat lamaran kandidat.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Buka Dashboard Recruiter</span>
                </Link>
                <Link
                  to="/jobs/create"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-800 font-bold text-xs transition-colors"
                >
                  <PlusCircle className="w-4 h-4 text-orange-600" />
                  <span>Pasang Lowongan Baru</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-stone-500 leading-relaxed">
                Sebagai pencari kerja (job seeker), Anda dapat menelusuri katalog pekerjaan, melamar posisi impian, dan memantau status lamaran kerja Anda secara berkala.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/applications"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm transition-all"
                >
                  <FileText className="w-4 h-4" />
                  <span>Lihat Riwayat Lamaran Saya</span>
                </Link>
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-800 font-bold text-xs transition-colors"
                >
                  <Briefcase className="w-4 h-4 text-orange-600" />
                  <span>Cari Lowongan Pekerjaan</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
