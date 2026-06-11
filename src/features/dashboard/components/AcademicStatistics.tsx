import { CalendarDays, FileText, Presentation, UserCheck } from "lucide-react";

export function AcademicStatistics() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-bold text-slate-900 mb-2">Academic Statistics</h3>
      
      <div className="flex flex-col gap-4">
        {/* Lecture Count */}
        <div className="flex items-center gap-4 bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5A67D8]/10 text-[#5A67D8]">
            <CalendarDays className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Lecture Count</p>
            <p className="text-2xl font-bold text-slate-900 leading-none">32</p>
            <p className="text-[11px] text-slate-400 mt-1">Total lectures conducted</p>
          </div>
        </div>

        {/* Notes Generated */}
        <div className="flex items-center gap-4 bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Notes Generated</p>
            <p className="text-2xl font-bold text-slate-900 leading-none">24</p>
            <p className="text-[11px] text-slate-400 mt-1">AI-generated notes</p>
          </div>
        </div>

        {/* Presentations Created */}
        <div className="flex items-center gap-4 bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
            <Presentation className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Presentations Created</p>
            <p className="text-2xl font-bold text-slate-900 leading-none">8</p>
            <p className="text-[11px] text-slate-400 mt-1">Total presentations</p>
          </div>
        </div>

        {/* Student Engagement */}
        <div className="flex items-center gap-4 bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Student Engagement</p>
            <p className="text-2xl font-bold text-slate-900 leading-none">89%</p>
            <p className="text-[11px] text-slate-400 mt-1">Average engagement rate</p>
          </div>
        </div>

      </div>
    </div>
  );
}
