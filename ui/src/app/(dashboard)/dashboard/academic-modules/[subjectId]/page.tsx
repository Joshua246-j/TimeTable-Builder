import { Metadata } from "next";
import { AcademicModuleShell } from "@/features/dashboard/components/AcademicModuleShell";
import { OverviewContent } from "@/features/dashboard/components/OverviewContent";
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
    title: `${subject.subjectName} Overview | Campus Management`,
    description: `Overview details for ${subject.subjectName}`,
  };
}

export default async function SubjectOverviewPage({ params }: PageProps) {
  const { subjectId } = await params;

  return (
    <AcademicModuleShell activeTab="overview" subjectId={subjectId}>
      <OverviewContent subjectId={subjectId} />
    </AcademicModuleShell>
  );
}
