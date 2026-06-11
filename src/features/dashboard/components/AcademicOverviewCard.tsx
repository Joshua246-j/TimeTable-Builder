import { BookText, CalendarDays, FileText, MonitorPlay, Presentation, Star, User } from "lucide-react";

export function AcademicOverviewCard() {
  return (
    <div className="relative bg-white rounded-xl shadow-sm border border-slate-100 p-8 overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-[0.03] pointer-events-none flex items-center justify-center">
        <div className="w-[300px] h-[300px] rounded-full border-[40px] border-slate-900 flex items-center justify-center">
          <span className="text-8xl font-black text-slate-900">AI</span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-6">
        {/* Header */}
        <div>
          <span className="inline-block px-2.5 py-1 text-[10px] font-bold text-[#5A67D8] bg-[#5A67D8]/10 rounded uppercase tracking-wider mb-3">
            AI Generated
          </span>
          <h2 className="text-3xl font-bold text-slate-900">Academic Overview</h2>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5A67D8]/10 text-[#5A67D8]">
              <BookText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Subject</p>
              <p className="text-lg font-bold text-slate-900 leading-tight mt-0.5">Data Structures</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5A67D8]/10 text-[#5A67D8]">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Faculty</p>
              <p className="text-lg font-bold text-slate-900 leading-tight mt-0.5">Dr. Anil Kumar</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5A67D8]/10 text-[#5A67D8]">
              <Star className="h-6 w-6 fill-current" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Credits</p>
              <p className="text-lg font-bold text-slate-900 leading-tight mt-0.5">4</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-slate-100 my-2"></div>

        {/* Bottom Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-100 text-[#5A67D8]">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Attendance</p>
              <p className="text-xl font-bold text-slate-900 leading-tight mt-0.5">89%</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-100 text-[#5A67D8]">
              <MonitorPlay className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Lectures</p>
              <p className="text-xl font-bold text-slate-900 leading-tight mt-0.5">32</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-100 text-[#5A67D8]">
              <Presentation className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Presentations</p>
              <p className="text-xl font-bold text-slate-900 leading-tight mt-0.5">8</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-100 text-[#5A67D8]">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Notes Generated</p>
              <p className="text-xl font-bold text-slate-900 leading-tight mt-0.5">24</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
