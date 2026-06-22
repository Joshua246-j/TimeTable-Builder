import { Metadata } from "next";
import { AcademicModuleShell } from "@/features/dashboard/components/AcademicModuleShell";
import { PresentationContent } from "@/features/presentations/components/PresentationContent";

export const metadata: Metadata = {
  title: "Presentations | Timetable Builder",
  description: "Manage generated presentations, import content, and export slides.",
};

export default function PresentationsPage() {
  return (
    <AcademicModuleShell activeTab="presentations">
      <PresentationContent />
    </AcademicModuleShell>
  );
}
