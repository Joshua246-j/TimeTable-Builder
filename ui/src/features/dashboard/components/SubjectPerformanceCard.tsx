import React from "react";
import { BarChart3, TrendingUp } from "lucide-react";
import { subjectService } from "@/services/subjectService";

export async function SubjectPerformanceCard({ subjectId }: { subjectId?: string }) {
  const resolvedId = subjectId || "1";
  const analytics = await subjectService.getSubjectAnalytics(resolvedId);

  if (!analytics) return null;

  return (
    <div className="bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-slate-200 p-5 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white border border-slate-200 text-indigo-600 shadow-sm">
          <BarChart3 className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-[14px] font-bold text-slate-900 tracking-tight">Student Performance</h4>
          <p className="text-[12px] text-slate-500 mt-0.5">Average Score: {analytics.averageScore}%</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 flex-grow justify-center">
        {analytics.gradeDistribution.map((item, idx) => (
          <div key={idx}>
            <div className="flex justify-between items-center mb-1 text-[11px] font-semibold text-slate-600">
              <span>{item.grade}</span>
              <span className="text-slate-900">{item.count} Students</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 text-emerald-600 text-[11px] font-bold mt-5 pt-4 border-t border-slate-100">
        <TrendingUp className="h-3.5 w-3.5" />
        <span>Average class performance increased by 2.4% this month</span>
      </div>
    </div>
  );
}
