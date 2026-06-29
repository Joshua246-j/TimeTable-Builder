import { Metadata } from "next";
import { AcademicModuleShell } from "@/features/dashboard/components/AcademicModuleShell";
import { BarChart3, TrendingUp, Users, Clock } from "lucide-react";
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
    title: `${subject.subjectName} Analytics | Campus Management`,
    description: `Analytics for ${subject.subjectName}`,
  };
}

export default async function SubjectAnalyticsPage({ params }: PageProps) {
  const { subjectId } = await params;
  const resolvedId = subjectId || "1";

  const details = MOCK_SUBJECTS_DETAILS[resolvedId] || MOCK_SUBJECTS_DETAILS["1"];

  return (
    <AcademicModuleShell activeTab="analytics" subjectId={subjectId}>
      <div className="max-w-4xl mx-auto mt-2 flex flex-col gap-6">
        
        {/* Top summary row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Average Grade Score</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{details.analytics.averageScore}%</h3>
            </div>
            <div className="h-10 w-10 bg-indigo-50 text-[#5A67D8] rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Average Attendance</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{details.attendanceRate}%</h3>
            </div>
            <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Weekly engagement</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{details.analytics.engagementRate}%</h3>
            </div>
            <div className="h-10 w-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Details card */}
        <div className="bg-white rounded-xl border border-slate-100 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5A67D8]/10 text-[#5A67D8]">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Academic Analytics</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Syllabus compliance & grade stats</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {details.analytics.gradeDistribution.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-1 text-[13px] font-bold text-slate-600">
                  <span>{item.grade}</span>
                  <span className="text-[#5A67D8]">{item.count} Students ({item.percentage}%)</span>
                </div>
                <div className="w-full h-3.5 bg-slate-55 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#5A67D8] rounded-full transition-all duration-500" 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AcademicModuleShell>
  );
}
