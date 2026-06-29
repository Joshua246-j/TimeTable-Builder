import React from "react";
import { Zap, Users, Play, BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";

export function QuickActionsCard({ subjectId }: { subjectId?: string }) {
  const isMainDashboard = !subjectId;
  const resolvedId = subjectId || "1";

  const actions = isMainDashboard ? [
    { label: "Academic Modules", href: "/dashboard/academic-modules", icon: BookOpen, color: "text-indigo-600 bg-indigo-50 hover:bg-indigo-100/70" },
    { label: "Timetable Builder", href: "/dashboard/timetable/builder", icon: Sparkles, color: "text-blue-600 bg-blue-50 hover:bg-blue-100/70" },
    { label: "Manage Faculty", href: "/faculty", icon: Users, color: "text-emerald-600 bg-emerald-50 hover:bg-emerald-100/70" },
    { label: "Manage Rooms", href: "/rooms", icon: Zap, color: "text-orange-600 bg-orange-50 hover:bg-orange-100/70" },
  ] : [
    { label: "Mark Attendance", href: `/dashboard/academic-modules/${resolvedId}/attendance/`, icon: Users, color: "text-blue-600 bg-blue-50 hover:bg-blue-100/70" },
    { label: "Start Live Lecture", href: `/dashboard/academic-modules/${resolvedId}/lecture/`, icon: Play, color: "text-emerald-600 bg-emerald-50 hover:bg-emerald-100/70" },
    { label: "Create Presentation", href: `/dashboard/academic-modules/${resolvedId}/presentations/`, icon: BookOpen, color: "text-orange-600 bg-orange-50 hover:bg-orange-100/70" },
    { label: "Generate AI Notes", href: `/dashboard/academic-modules/${resolvedId}/notes/`, icon: Sparkles, color: "text-purple-600 bg-purple-50 hover:bg-purple-100/70" },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5A67D8]/10 text-[#5A67D8]">
          <Zap className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">Quick Actions</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Frequent teacher tasks</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-grow items-center">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <Link 
              key={idx}
              href={act.href}
              className={`flex flex-col items-center justify-center text-center p-4 rounded-xl border border-transparent shadow-sm transition-all duration-350 cursor-pointer ${act.color}`}
            >
              <Icon className="w-5 h-5 mb-2.5 shrink-0" />
              <span className="text-[12px] font-extrabold leading-tight">{act.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
