import { Metadata } from "next";
import { AcademicModuleShell } from "@/features/dashboard/components/AcademicModuleShell";
import { AttendanceContent } from "@/features/attendance/components/AttendanceContent";
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
    title: `${subject.subjectName} Attendance | Campus Management`,
    description: `Attendance management for ${subject.subjectName}`,
  };
}

export default async function SubjectAttendancePage({ params }: PageProps) {
  const { subjectId } = await params;

  return (
    <AcademicModuleShell activeTab="attendance" subjectId={subjectId}>
      <AttendanceContent subjectId={subjectId} />
    </AcademicModuleShell>
  );
}
