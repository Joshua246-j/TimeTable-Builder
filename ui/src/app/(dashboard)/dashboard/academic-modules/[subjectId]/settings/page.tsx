import { Metadata } from "next";
import { SettingsForm } from "./SettingsForm";
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
    title: `${subject.subjectName} Settings | Campus Management`,
    description: `Subject settings for ${subject.subjectName}`,
  };
}

export default async function SubjectSettingsPage({ params }: PageProps) {
  const { subjectId } = await params;
  const resolvedId = subjectId || "1";
  const subject = MOCK_SUBJECTS[resolvedId] || MOCK_SUBJECTS["1"];

  return <SettingsForm subjectId={resolvedId} initialSubject={subject} />;
}
