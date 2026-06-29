import { Metadata } from "next";
import { AcademicModuleShell } from "@/features/dashboard/components/AcademicModuleShell";
import { OverviewContent } from "@/features/dashboard/components/OverviewContent";
import { OrgAdminDashboard } from "@/features/dashboard/components/OrgAdminDashboard";
import { DeptAdminDashboard } from "@/features/dashboard/components/DeptAdminDashboard";
import { TeacherDashboard } from "@/features/dashboard/components/TeacherDashboard";
import { UserRole } from "@/constants/navigation";

export const metadata: Metadata = {
  title: "Dashboard | Campus Management",
  description: "Campus Management System Dashboard",
};

export default function DashboardPage() {
  // In a real application, this role would come from a session/auth context
  // or a server component fetching the user's profile.
  // We're hardcoding 'TEACHER' here for demonstration, but this is where
  // the dynamic routing happens.
  const currentRole = "TEACHER" as UserRole;

  switch (currentRole) {
    case "ORG_ADMIN":
      return <OrgAdminDashboard />;
    case "DEPT_ADMIN":
    case "HOD":
      return <DeptAdminDashboard />;
    case "TEACHER":
    case "FACULTY":
      return <TeacherDashboard />;
    case "STUDENT":
      return (
        <div className="flex flex-col h-full w-full bg-[#F7F8FC] p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Student Dashboard</h1>
          <p className="text-slate-500">Welcome to your student portal.</p>
        </div>
      );
    default:
      return (
        <div className="flex items-center justify-center h-full w-full">
          <p className="text-slate-500">Dashboard not available for your role.</p>
        </div>
      );
  }
}
