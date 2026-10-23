import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export const ErrorState = ({
  title = 'Gagal Memuat Data',
  message = 'Terjadi kesalahan saat berkomunikasi dengan server. Silakan coba kembali.',
  onRetry,
}) => {
  return (
    <div className="bg-rose-50/80 rounded-2xl p-8 border border-rose-200 text-center max-w-lg mx-auto my-8">
      <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center mx-auto text-rose-600 mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-rose-900 mb-1">{title}</h3>
      <p className="text-rose-700 text-sm leading-relaxed mb-5">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-rose-300 text-rose-800 hover:bg-rose-100 font-semibold text-sm transition-all shadow-sm active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Coba Lagi</span>
        </button>
      )}
    </div>
  );
};
