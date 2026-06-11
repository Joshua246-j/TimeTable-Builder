import { ChevronRight, Menu, Rows3 } from "lucide-react";
import Link from "next/link";

export function DashboardHeader() {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-100 p-2 mb-6">
      <div className="flex items-center justify-between px-4 pt-3 pb-4 border-b border-slate-100">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm font-medium text-slate-500">
          <Link href="/dashboard" className="hover:text-slate-900 transition-colors">Dashboard</Link>
          <ChevronRight className="h-4 w-4 mx-2 text-slate-400" />
          <span className="hover:text-slate-900 transition-colors cursor-pointer">Academic Modules</span>
          <ChevronRight className="h-4 w-4 mx-2 text-slate-400" />
          <span className="hover:text-slate-900 transition-colors cursor-pointer">Data Structures</span>
          <ChevronRight className="h-4 w-4 mx-2 text-slate-400" />
          <span className="text-slate-900 font-semibold">Overview</span>
        </div>

        {/* Layout Toggles */}
        <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-100">
          <button className="flex items-center gap-2 bg-[#5A67D8] text-white px-4 py-1.5 rounded-md text-sm font-semibold shadow-sm transition-colors">
            <Rows3 className="h-4 w-4" />
            Tabs Layout
          </button>
          <button className="flex items-center gap-2 text-slate-500 px-4 py-1.5 rounded-md text-sm font-semibold hover:text-slate-800 transition-colors">
            <Menu className="h-4 w-4" />
            Menu Layout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-4 pt-3 pb-0 flex gap-8 text-sm font-medium text-slate-500">
        <button className="text-[#5A67D8] border-b-2 border-[#5A67D8] pb-3 px-2 transition-colors">
          Overview
        </button>
        <button className="hover:text-slate-800 pb-3 px-2 transition-colors">
          Lecture
        </button>
        <button className="hover:text-slate-800 pb-3 px-2 transition-colors">
          Presentations
        </button>
        <button className="hover:text-slate-800 pb-3 px-2 transition-colors">
          Notes
        </button>
        <button className="hover:text-slate-800 pb-3 px-2 transition-colors">
          Settings
        </button>
      </div>
    </div>
  );
}
