import { Metadata } from "next";
import { AcademicModuleShell } from "@/features/dashboard/components/AcademicModuleShell";
import { FileText, Download, Eye } from "lucide-react";
import { MOCK_SUBJECTS } from "@/lib/mockData";

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
    title: `${subject.subjectName} Notes | Campus Management`,
    description: `Lecture notes for ${subject.subjectName}`,
  };
}

export default async function SubjectNotesPage({ params }: PageProps) {
  const { subjectId } = await params;
  const resolvedId = subjectId || "1";
  const subject = MOCK_SUBJECTS[resolvedId] || MOCK_SUBJECTS["1"];

  const notesList = [
    { id: "n1", title: "Introduction and Basic Terminologies", date: "June 25, 2026", size: "2.4 MB" },
    { id: "n2", title: "Core Concepts and Architectures", date: "June 22, 2026", size: "4.1 MB" },
    { id: "n3", title: "Implementation details & Best Practices", date: "June 18, 2026", size: "3.8 MB" },
    { id: "n4", title: "Advanced Optimizations and Case Studies", date: "June 12, 2026", size: "5.2 MB" },
  ];

  return (
    <AcademicModuleShell activeTab="notes" subjectId={subjectId}>
      <div className="bg-white rounded-xl border border-slate-100 p-8 shadow-sm max-w-4xl mx-auto mt-2">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{subject.subjectName} Notes</h2>
            <p className="text-slate-500 text-sm mt-1">Access AI-generated study materials and reference guides.</p>
          </div>
          <span className="inline-block px-3 py-1 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-full">
            {notesList.length} Notes Available
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {notesList.map((note) => (
            <div key={note.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-[#5A67D8]/30 hover:bg-[#5A67D8]/5 transition-all duration-300 gap-4 group">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-indigo-50 text-[#5A67D8] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-[15px] group-hover:text-[#5A67D8] transition-colors">{note.title}</h3>
                  <p className="text-slate-400 text-xs mt-0.5">Uploaded on {note.date} • {note.size}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button className="flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-[#5A67D8] hover:bg-white border border-transparent hover:border-slate-200 transition-all">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-white border border-transparent hover:border-slate-200 transition-all">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AcademicModuleShell>
  );
}
