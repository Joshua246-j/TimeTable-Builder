import type { ReactNode } from "react";
import NavBar from "@/components/NavBar";

interface DashboardLayoutProps {
  children: ReactNode;
}

// src/app/(dashboard)/layout.tsx

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="h-screen bg-[#F7F8FC] flex flex-col font-inter">  {/* min-h-screen → h-screen */}
      <NavBar />
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}