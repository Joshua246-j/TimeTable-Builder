import { CalendarDays, FileText, Presentation, UserCheck } from "lucide-react";
import { MetricCard } from "@/components/shared";
import { subjectService } from "@/services/subjectService";

export async function AcademicStatistics({ subjectId }: { subjectId?: string }) {
  const resolvedId = subjectId || "1";
  
  const attendance = await subjectService.getSubjectAttendance(resolvedId);
  const totalLectures = await subjectService.getSubjectLectures(resolvedId);
  const presentations = await subjectService.getSubjectPresentations(resolvedId);
  const notes = (await subjectService.getSubjectResources(resolvedId)).length || 24;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-bold text-slate-900 mb-2">Academic Statistics</h3>
      
      <div className="flex flex-col gap-4">
        <MetricCard
          title="Lecture Count"
          value={totalLectures.toString()}
          subtitle="Total lectures conducted"
          icon={<CalendarDays className="h-6 w-6 text-[#5A67D8]" />}
          className="border-slate-100 hover:shadow-md transition-shadow"
        />

        <MetricCard
          title="Notes Generated"
          value={notes.toString()}
          subtitle="AI-generated notes"
          icon={<FileText className="h-6 w-6 text-emerald-500" />}
          className="border-slate-100 hover:shadow-md transition-shadow"
        />

        <MetricCard
          title="Presentations Created"
          value={presentations.toString()}
          subtitle="Total presentations"
          icon={<Presentation className="h-6 w-6 text-orange-500" />}
          className="border-slate-100 hover:shadow-md transition-shadow"
        />

        <MetricCard
          title="Student Engagement"
          value={`${attendance}%`}
          subtitle="Average engagement rate"
          icon={<UserCheck className="h-6 w-6 text-cyan-500" />}
          className="border-slate-100 hover:shadow-md transition-shadow"
        />
      </div>
    </div>
  );
}
