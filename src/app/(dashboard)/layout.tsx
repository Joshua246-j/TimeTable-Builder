import type { ReactNode } from "react";

import Sidebar from "@/components/layout/sidebar/Sidebar";
import Topbar from "@/components/layout/topbar/Topbar";
import MobileDrawer from "@/components/layout/mobile-drawer/MobileDrawer";
import Breadcrumbs from "@/components/layout/breadcrumbs/Breadcrumbs";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div
      className="
        min-h-screen
        bg-[var(--background)]
      "
    >
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Area */}
        <div className="flex min-h-screen flex-1 flex-col">
          {/* Top Navigation */}
          <Topbar />

          {/* Mobile Header */}
          <div
            className="
              sticky
              top-0
              z-30
              border-b
              border-[var(--border)]
              bg-white
              px-4
              py-3
              lg:hidden
            "
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MobileDrawer />

                <div>
                  <h1
                    className="
                      text-sm
                      font-semibold
                      text-[var(--foreground)]
                    "
                  >
                    Timetable Creation
                  </h1>

                  <p
                    className="
                      text-[10px]
                      uppercase
                      tracking-wider
                      text-[var(--muted-foreground)]
                    "
                  >
                    B.Tech CSE • Semester V
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <main
            className="
              flex-1
              overflow-hidden
            "
          >
            {/* Desktop Breadcrumb Section */}
            <div
              className="
                hidden
                border-b
                border-[var(--border)]
                bg-white
                px-8
                py-4
                lg:block
              "
            >
              <Breadcrumbs />
            </div>

            {/* Content Wrapper */}
            <div
              className="
                h-full
                px-4
                py-4
                md:px-6
                lg:px-8
                lg:py-6
              "
            >
              <div
                className="
                  mx-auto
                  w-full
                  max-w-[1800px]
                "
              >
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}