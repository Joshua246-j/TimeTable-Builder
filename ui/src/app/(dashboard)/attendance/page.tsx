import { Metadata } from "next";
import { AcademicModuleShell } from "@/features/dashboard/components/AcademicModuleShell";
import { AttendanceContent } from "@/features/attendance/components/AttendanceContent";

export const metadata: Metadata = {
  title: "Attendance | Timetable Builder",
  description: "Manage student attendance and view insights.",
};

export default function AttendancePage() {
  return (
    <AcademicModuleShell activeTab="attendance">
      <AttendanceContent />
    </AcademicModuleShell>
  );
}
