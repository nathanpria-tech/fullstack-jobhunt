import React from 'react';
import { Briefcase, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon: Icon = Briefcase,
  title = 'Tidak ada data ditemukan',
  description = 'Saat ini belum ada data yang dapat ditampilkan untuk kriteria ini.',
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <div className="bg-white rounded-2xl p-10 md:p-14 border border-stone-200/80 shadow-sm text-center max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mx-auto text-orange-600 mb-4 shadow-sm">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-stone-800 mb-2">{title}</h3>
      <p className="text-stone-500 text-sm leading-relaxed mb-6">{description}</p>
      {actionText && (
        actionLink ? (
          <Link
            to={actionLink}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm transition-all duration-200 shadow-md shadow-orange-600/20 active:scale-95"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm transition-all duration-200 shadow-md shadow-orange-600/20 active:scale-95"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )
      )}
    </div>
  );
};
