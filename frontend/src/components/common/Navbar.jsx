import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { RoleBadge } from './Badge';
import {
  Briefcase,
  Menu,
  X,
  LogOut,
  User,
  PlusCircle,
  FileText,
  LayoutDashboard,
  Search,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isJobSeeker, isRecruiter, logout } = useAuth();
  const { showSuccess } = useToast();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showSuccess('Anda berhasil keluar.');
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'text-orange-600 bg-orange-50/80 font-bold'
        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'text-orange-600 bg-orange-50 font-bold'
        : 'text-stone-700 hover:bg-stone-100'
    }`;

  return (
    <nav className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-stone-900">
                Job<span className="text-orange-600">Hunt</span>
              </span>
              <span className="text-[10px] -mt-1 font-medium text-stone-400 tracking-wider uppercase">
                Portal Karir
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <NavLink to="/" className={navLinkClass}>
              Beranda
            </NavLink>
            <NavLink to="/jobs" className={navLinkClass}>
              Cari Lowongan
            </NavLink>

            {isAuthenticated && isJobSeeker && (
              <NavLink to="/applications" className={navLinkClass}>
                Riwayat Lamaran
              </NavLink>
            )}

            {isAuthenticated && isRecruiter && (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/jobs/create" className={navLinkClass}>
                  Pasang Lowongan
                </NavLink>
              </>
            )}
          </div>

          {/* Desktop Auth / User Action */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {isRecruiter && (
                  <Link
                    to="/jobs/create"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs tracking-wide shadow-sm shadow-orange-500/20 active:scale-95 transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Buat Lowongan</span>
                  </Link>
                )}

                {/* Profile Link with Role pill */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-stone-100 transition-colors border border-transparent hover:border-stone-200"
                >
                  <div className="w-8 h-8 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-700 font-bold text-xs uppercase">
                    {user?.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-stone-800 leading-tight">
                      {user?.name}
                    </span>
                    <RoleBadge role={user?.role} />
                  </div>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  title="Keluar"
                  className="p-2 rounded-xl text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-bold text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold shadow-md shadow-orange-600/20 active:scale-95 transition-all"
                >
                  Daftar Akun
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200/80 bg-[#FFFDF9] px-4 pt-3 pb-6 space-y-2 shadow-xl animate-fade-in">
          {isAuthenticated && (
            <div className="flex items-center gap-3 p-3 mb-2 rounded-xl bg-orange-50/70 border border-orange-100">
              <div className="w-10 h-10 rounded-full bg-orange-200 text-orange-800 font-bold flex items-center justify-center text-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1">
                <p className="font-bold text-stone-800 text-sm leading-tight">{user?.name}</p>
                <p className="text-xs text-stone-500">{user?.email}</p>
              </div>
              <RoleBadge role={user?.role} />
            </div>
          )}

          <NavLink
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            <Briefcase className="w-4 h-4 text-orange-600" />
            <span>Beranda</span>
          </NavLink>

          <NavLink
            to="/jobs"
            onClick={() => setIsMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            <Search className="w-4 h-4 text-orange-600" />
            <span>Cari Lowongan</span>
          </NavLink>

          {isAuthenticated && isJobSeeker && (
            <NavLink
              to="/applications"
              onClick={() => setIsMobileMenuOpen(false)}
              className={mobileNavLinkClass}
            >
              <FileText className="w-4 h-4 text-orange-600" />
              <span>Riwayat Lamaran</span>
            </NavLink>
          )}

          {isAuthenticated && isRecruiter && (
            <>
              <NavLink
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={mobileNavLinkClass}
              >
                <LayoutDashboard className="w-4 h-4 text-orange-600" />
                <span>Dashboard Recruiter</span>
              </NavLink>
              <NavLink
                to="/jobs/create"
                onClick={() => setIsMobileMenuOpen(false)}
                className={mobileNavLinkClass}
              >
                <PlusCircle className="w-4 h-4 text-orange-600" />
                <span>Pasang Lowongan Baru</span>
              </NavLink>
            </>
          )}

          {isAuthenticated && (
            <NavLink
              to="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className={mobileNavLinkClass}
            >
              <User className="w-4 h-4 text-orange-600" />
              <span>Profil Pengguna</span>
            </NavLink>
          )}

          {/* Auth buttons for mobile */}
          <div className="pt-4 border-t border-stone-200 flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar dari Akun</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full py-2.5 rounded-xl border border-stone-300 text-stone-800 font-bold text-sm hover:bg-stone-100"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full py-2.5 rounded-xl bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-600/20"
                >
                  Daftar Akun Baru
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
