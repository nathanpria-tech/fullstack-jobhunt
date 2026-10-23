import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Heart, Sparkles, MapPin, Mail, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#FAF6F0] border-t border-stone-200/80 mt-auto text-stone-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-stone-900">
                Job<span className="text-orange-600">Hunt</span>
              </span>
            </Link>
            <p className="text-sm text-stone-500 max-w-sm leading-relaxed">
              JobHunt adalah platform lowongan kerja terdepan yang menghubungkan talenta terbaik dengan perusahaan impian. Membuka peluang karir yang luas, transparan, dan terpercaya.
            </p>
            <div className="flex items-center gap-4 text-xs text-stone-500 pt-2">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-orange-600" />
                <span>Jakarta, Indonesia</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-orange-600" />
                <span>support@jobhunt.id</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4">
              Pencari Kerja
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/jobs" className="hover:text-orange-600 transition-colors">
                  Jelajahi Lowongan
                </Link>
              </li>
              <li>
                <Link to="/jobs?location=Remote" className="hover:text-orange-600 transition-colors">
                  Pekerjaan Remote
                </Link>
              </li>
              <li>
                <Link to="/jobs?type=full-time" className="hover:text-orange-600 transition-colors">
                  Lowongan Full-time
                </Link>
              </li>
              <li>
                <Link to="/applications" className="hover:text-orange-600 transition-colors">
                  Riwayat Lamaran
                </Link>
              </li>
            </ul>
          </div>

          {/* Recruiter links */}
          <div>
            <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4">
              Perusahaan & Recruiter
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/jobs/create" className="hover:text-orange-600 transition-colors">
                  Pasang Lowongan Baru
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-orange-600 transition-colors">
                  Dashboard Rekrutmen
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-orange-600 transition-colors">
                  Daftar sebagai Recruiter
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-orange-600 transition-colors">
                  Kelola Akun
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-stone-200/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} JobHunt Indonesia. Hak cipta dilindungi undang-undang.</p>
          <p className="flex items-center gap-1">
            Dibangun dengan rasa bangga untuk pencari kerja & recruiter Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
};
