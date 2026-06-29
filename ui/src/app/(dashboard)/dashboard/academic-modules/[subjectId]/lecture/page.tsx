import { Metadata } from "next";
import { AcademicModuleShell } from "@/features/dashboard/components/AcademicModuleShell";
import { LectureContent } from "@/features/lecture/components/LectureContent";
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
    title: `${subject.subjectName} Lecture | Campus Management`,
    description: `Lecture planner for ${subject.subjectName}`,
  };
}

export default async function SubjectLecturePage({ params }: PageProps) {
  const { subjectId } = await params;

  return (
    <AcademicModuleShell activeTab="lecture" subjectId={subjectId}>
      <LectureContent subjectId={subjectId} />
    </AcademicModuleShell>
  );
}
