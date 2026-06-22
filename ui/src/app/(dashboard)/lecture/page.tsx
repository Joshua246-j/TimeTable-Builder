import { Metadata } from "next";
import { AcademicModuleShell } from "@/features/dashboard/components/AcademicModuleShell";
import { LectureContent } from "@/features/lecture/components/LectureContent";

export const metadata: Metadata = {
  title: "Lecture Management | Timetable Builder",
  description: "Manage lecture points, overview, and recording.",
};

export default function LecturePage() {
  return (
    <AcademicModuleShell activeTab="lecture">
      <LectureContent />
    </AcademicModuleShell>
  );
}
