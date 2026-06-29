import React from "react";
import { FileText, BookOpen, ExternalLink, Download } from "lucide-react";
import { subjectService } from "@/services/subjectService";

export async function AssignmentsResourcesCard({ subjectId }: { subjectId?: string }) {
  const resolvedId = subjectId || "1";
  const details = await subjectService.getSubjectDetails(resolvedId);

  if (!details) return null;

  const { assignments, resources } = details;

  return (
    <div className="bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-slate-200 p-6 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white border border-slate-200 text-indigo-600 shadow-sm">
          <BookOpen className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-[14px] font-bold text-slate-900 tracking-tight">Assignments & Resources</h4>
          <p className="text-[12px] text-slate-500 mt-0.5">Quick access to course items</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
        {/* Assignments Column */}
        <div className="flex flex-col gap-2.5">
          <h5 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Recent Assignments</h5>
          {assignments.slice(0, 3).map((item, idx) => (
            <div key={idx} className="flex items-start justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div>
                <p className="text-[12px] font-semibold text-slate-900 line-clamp-1">{item.title}</p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Due: {item.dueDate}</p>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${
                item.status === "Graded" 
                  ? "bg-emerald-100/50 text-emerald-700" 
                  : "bg-amber-100/50 text-amber-700"
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>

        {/* Resources Column */}
        <div className="flex flex-col gap-2.5">
          <h5 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Subject Resources</h5>
          {resources.slice(0, 3).map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-slate-900 truncate">{item.title}</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">{item.type} {item.size && `• ${item.size}`}</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-indigo-600 transition-colors p-1 rounded hover:bg-slate-200 shrink-0">
                {item.type === "Link" ? <ExternalLink className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
