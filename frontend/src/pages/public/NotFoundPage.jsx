import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-sm space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto shadow-sm">
          <Compass className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-stone-900 tracking-tight mb-2">404</h1>
          <h2 className="text-xl font-bold text-stone-800 mb-2">Halaman Tidak Ditemukan</h2>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
            Halaman atau tautan yang Anda tuju mungkin telah dipindahkan, dihapus, atau tidak pernah ada.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/20 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    </div>
  );
};
