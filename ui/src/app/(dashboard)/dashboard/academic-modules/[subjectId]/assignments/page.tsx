import { Metadata } from "next";
import { AcademicModuleShell } from "@/features/dashboard/components/AcademicModuleShell";
import { FileText, Calendar, Plus } from "lucide-react";
import { MOCK_SUBJECTS } from "@/lib/mockData";
import { MOCK_SUBJECTS_DETAILS } from "@/mock/subjectsDetail";

interface PageProps {
  params: Promise<{
    subjectId: string;
  }>;
}

export async function generateStaticParams() {
  return Object.keys(MOCK_SUBJECTS).map((id) => ({
    subjectId: id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { subjectId } = await params;
  const subject = MOCK_SUBJECTS[subjectId] || { subjectName: "Subject Details" };
  return {
    title: `${subject.subjectName} Assignments | Campus Management`,
    description: `Assignments for ${subject.subjectName}`,
  };
}

export default async function SubjectAssignmentsPage({ params }: PageProps) {
  const { subjectId } = await params;
  const resolvedId = subjectId || "1";
  const subject = MOCK_SUBJECTS[resolvedId] || MOCK_SUBJECTS["1"];
  const details = MOCK_SUBJECTS_DETAILS[resolvedId] || MOCK_SUBJECTS_DETAILS["1"];

  return (
    <AcademicModuleShell activeTab="assignments" subjectId={subjectId}>
      <div className="bg-white rounded-xl border border-slate-100 p-8 shadow-sm max-w-4xl mx-auto mt-2">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{subject.subjectName} Assignments</h2>
            <p className="text-slate-500 text-sm mt-1">Manage, grade, and schedule upcoming homework and tests.</p>
          </div>
          <button className="flex items-center gap-2 bg-[#5A67D8] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-[#5A67D8]/90 transition-colors">
            <Plus className="h-4 w-4" />
            Create Assignment
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {details.assignments.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-[#5A67D8]/30 hover:bg-[#5A67D8]/5 transition-all duration-300 gap-4 group">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-indigo-50 text-[#5A67D8] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-[15px] group-hover:text-[#5A67D8] transition-colors">{item.title}</h3>
                  <div className="flex items-center gap-2 text-slate-400 text-xs mt-0.5 font-semibold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Due on {item.dueDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded uppercase ${
                  item.status === "Graded" 
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                    : "bg-amber-50 text-amber-600 border border-amber-100"
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AcademicModuleShell>
  );
}
