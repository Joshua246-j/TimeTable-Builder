"use client";

import { Bell, GraduationCap, LayoutGrid, ChevronDown, CalendarDays } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();
  
  const isDashboard = pathname.includes('/dashboard');
  
  return (
    <nav className="flex h-[64px] w-full items-center justify-between border-b border-[#E5E7EB] bg-white px-6">
      
      {/* Left: Logo, Title & Tabs */}
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0D2463] text-white">
            {isDashboard ? <GraduationCap className="h-5 w-5" /> : <LayoutGrid className="h-5 w-5" />}
          </div>
          <div>
            <h1 className="text-[15px] font-bold text-slate-900 leading-tight">
              {isDashboard ? "IIS" : "Timetable Creation"}
            </h1>
            <div className="flex items-center text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              SS Tech CSE • Semester
              <ChevronDown className="ml-1 h-3 w-3" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-1">
          <Link 
            href="/dashboard"
            className={`rounded-lg px-6 py-2 text-sm font-semibold transition-colors ${
              pathname.includes('/dashboard') || pathname === '/attendance' || pathname === '/lecture' || pathname === '/presentations'
                ? "bg-[#5A67D8] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Dashboard
          </Link>
          <Link 
            href="/timetable-builder"
            className={`rounded-lg px-6 py-2 text-sm font-semibold transition-colors ${
              pathname.includes('/timetable-builder')
                ? "bg-[#5A67D8] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Timetable
          </Link>
        </div>
      </div>

      {/* Right: Selectors & Profile */}
      <div className="flex items-center gap-4">
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
            <CalendarDays className="h-4 w-4 text-slate-400" />
            Odd Sem 2024-25
            <ChevronDown className="ml-1 h-4 w-4 text-slate-400" />
          </button>
          
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
            CSE Department
            <ChevronDown className="ml-1 h-4 w-4 text-slate-400" />
          </button>
        </div>

        <div className="h-6 w-px bg-slate-200 mx-1"></div>

        <button className="relative flex h-8 w-8 items-center justify-center text-slate-500 hover:text-slate-700">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0D2463]/10 text-sm font-bold text-[#0D2463]">
          AK
        </div>

      </div>

    </nav>
  );
}
