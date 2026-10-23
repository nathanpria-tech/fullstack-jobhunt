import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building, Banknote, Clock, Users, ArrowUpRight } from 'lucide-react';
import { JobTypeBadge } from './Badge';
import { formatSalaryRange, formatRelativeDate } from '../../utils/formatters';

export const JobCard = ({ job }) => {
  return (
    <div className="group bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
      {/* Accent corner line on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Header: Company & Job Type */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
            <Building className="w-3.5 h-3.5 text-orange-600 shrink-0" />
            <span className="truncate max-w-[200px]">{job.company}</span>
          </div>
          <JobTypeBadge type={job.type} />
        </div>

        {/* Title */}
        <Link to={`/jobs/${job.id}`}>
          <h3 className="text-lg font-bold text-stone-900 group-hover:text-orange-600 transition-colors line-clamp-1 mb-2">
            {job.title}
          </h3>
        </Link>

        {/* Location & Salary */}
        <div className="space-y-1.5 mb-4 text-xs text-stone-600">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-stone-800">
            <Banknote className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{formatSalaryRange(job.salary_min, job.salary_max)}</span>
          </div>
        </div>

        {/* Description Snippet */}
        <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-4">
          {job.description}
        </p>
      </div>

      {/* Footer Info & CTA */}
      <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2 mt-auto text-xs">
        <div className="flex items-center gap-3 text-stone-400 font-medium">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatRelativeDate(job.created_at)}
          </span>
          {job.total_applicants !== undefined && (
            <span className="flex items-center gap-1 text-orange-600/90 font-semibold">
              <Users className="w-3 h-3" />
              {job.total_applicants} pelamar
            </span>
          )}
        </div>

        <Link
          to={`/jobs/${job.id}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white font-semibold transition-all group/btn"
        >
          <span>Detail</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
