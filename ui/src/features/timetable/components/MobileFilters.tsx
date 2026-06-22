"use client";

import { Calendar, Building, Users } from "lucide-react";

export default function MobileFilters() {
  return (
    <div className="flex w-full items-center gap-3 overflow-x-auto snap-x py-2 px-4 lg:hidden no-scrollbar">
      {/* Semester Filter */}
      <button className="flex shrink-0 snap-start items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
        <Calendar className="h-3.5 w-3.5 text-slate-400" />
        Odd Sem 2024-25
      </button>

      {/* Department Filter */}
      <button className="flex shrink-0 snap-start items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
        <Building className="h-3.5 w-3.5 text-slate-400" />
        CSE Department
      </button>

      {/* Section Filter */}
      <button className="flex shrink-0 snap-start items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
        <Users className="h-3.5 w-3.5 text-slate-400" />
        Section V A
      </button>
    </div>
  );
}
