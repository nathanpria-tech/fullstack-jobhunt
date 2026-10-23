import React from 'react';

export const JobCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm animate-pulse space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="h-4 w-28 bg-stone-200 rounded" />
          <div className="h-6 w-3/4 bg-stone-200 rounded-md" />
        </div>
        <div className="h-6 w-20 bg-stone-200 rounded-full" />
      </div>
      <div className="flex gap-4 pt-2">
        <div className="h-4 w-24 bg-stone-200 rounded" />
        <div className="h-4 w-32 bg-stone-200 rounded" />
      </div>
      <div className="h-4 w-full bg-stone-100 rounded" />
      <div className="h-4 w-5/6 bg-stone-100 rounded" />
      <div className="flex items-center justify-between pt-4 border-t border-stone-100">
        <div className="h-4 w-24 bg-stone-200 rounded" />
        <div className="h-9 w-24 bg-orange-100 rounded-xl" />
      </div>
    </div>
  );
};

export const TableRowSkeleton = ({ cols = 5 }) => {
  return (
    <tr className="animate-pulse border-b border-stone-100">
      {Array.from({ length: cols }).map((_, idx) => (
        <td key={idx} className="p-4">
          <div className="h-4 bg-stone-200 rounded w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
};

export const DetailSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
      <div className="bg-white rounded-2xl p-8 border border-stone-200/80 shadow-sm space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-3 flex-1">
            <div className="h-5 w-32 bg-stone-200 rounded" />
            <div className="h-8 w-2/3 bg-stone-200 rounded-lg" />
            <div className="h-4 w-40 bg-stone-200 rounded" />
          </div>
          <div className="h-8 w-24 bg-stone-200 rounded-full" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-stone-100">
          <div className="h-12 bg-stone-100 rounded-xl" />
          <div className="h-12 bg-stone-100 rounded-xl" />
          <div className="h-12 bg-stone-100 rounded-xl" />
          <div className="h-12 bg-stone-100 rounded-xl" />
        </div>
      </div>
      <div className="bg-white rounded-2xl p-8 border border-stone-200/80 shadow-sm space-y-4">
        <div className="h-6 w-48 bg-stone-200 rounded" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-stone-100 rounded" />
          <div className="h-4 w-full bg-stone-100 rounded" />
          <div className="h-4 w-3/4 bg-stone-100 rounded" />
        </div>
      </div>
    </div>
  );
};
