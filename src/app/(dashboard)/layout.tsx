import type { ReactNode } from "react";
import NavBar from "@/components/NavBar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col font-inter">
      <NavBar />
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}