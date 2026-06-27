import type { ReactNode } from "react";
import SideNavbar from "@/components/SideNavbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

// src/app/(dashboard)/layout.tsx

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // In a real app, this would be fetched from auth context
  const currentRole = "TEACHER";

  return (
    <div className="flex h-screen w-full bg-[#F7F8FC] font-inter overflow-hidden">
      <SideNavbar currentRole={currentRole} />
      
      <div className="flex flex-col flex-1 min-w-0">
        <main className="flex-1 overflow-hidden relative">
          {children}
        </main>
      </div>
    </div>
  );
}