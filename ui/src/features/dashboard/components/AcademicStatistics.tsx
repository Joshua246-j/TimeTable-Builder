import { CalendarDays, FileText, Presentation, UserCheck } from "lucide-react";
import { MetricCard } from "@/components/shared";

export function AcademicStatistics() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-bold text-slate-900 mb-2">Academic Statistics</h3>
      
      <div className="flex flex-col gap-4">
        <MetricCard
          title="Lecture Count"
          value="32"
          subtitle="Total lectures conducted"
          icon={<CalendarDays className="h-6 w-6 text-[#5A67D8]" />}
          className="border-slate-100 hover:shadow-md transition-shadow"
        />

        <MetricCard
          title="Notes Generated"
          value="24"
          subtitle="AI-generated notes"
          icon={<FileText className="h-6 w-6 text-emerald-500" />}
          className="border-slate-100 hover:shadow-md transition-shadow"
        />

        <MetricCard
          title="Presentations Created"
          value="8"
          subtitle="Total presentations"
          icon={<Presentation className="h-6 w-6 text-orange-500" />}
          className="border-slate-100 hover:shadow-md transition-shadow"
        />

        <MetricCard
          title="Student Engagement"
          value="89%"
          subtitle="Average engagement rate"
          icon={<UserCheck className="h-6 w-6 text-cyan-500" />}
          className="border-slate-100 hover:shadow-md transition-shadow"
        />
      </div>
    </div>
  );
}
