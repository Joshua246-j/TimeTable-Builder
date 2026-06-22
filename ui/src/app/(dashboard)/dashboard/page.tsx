import { Metadata } from "next";
import { AcademicModuleShell } from "@/features/dashboard/components/AcademicModuleShell";
import { OverviewContent } from "@/features/dashboard/components/OverviewContent";

export const metadata: Metadata = {
  title: "Dashboard | Timetable Builder",
  description: "Academic module overview and statistics.",
};

export default function DashboardPage() {
  return (
    <AcademicModuleShell activeTab="overview">
      <OverviewContent />
    </AcademicModuleShell>
  );
}
