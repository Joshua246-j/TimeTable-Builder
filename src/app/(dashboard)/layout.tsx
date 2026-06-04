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
    <div className="h-screen overflow-hidden bg-slate-50">
      <div className="flex h-full">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Application */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Desktop Topbar */}
          <Topbar />

          {/* Mobile Header */}
          <header
            className="
              sticky
              top-0
              z-40
              border-b
              border-slate-200
              bg-white
              lg:hidden
            "
          >
            <div
              className="
                flex
                h-16
                items-center
                justify-between
                px-4
              "
            >
              <div className="flex items-center gap-3">
                <MobileDrawer />

                <div>
                  <h1
                    className="
                      text-sm
                      font-semibold
                      text-slate-900
                    "
                  >
                    Timetable Builder
                  </h1>

                  <p
                    className="
                      text-xs
                      text-slate-500
                    "
                  >
                    Academic Scheduler
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Desktop Breadcrumb Area */}
          <section
            className="
              hidden
              border-b
              border-slate-200
              bg-white
              lg:block
            "
          >
            <div
              className="
                mx-auto
                max-w-[1800px]
                px-8
                py-4
              "
            >
              <Breadcrumbs />
            </div>
          </section>

          {/* Page Content */}
          <main
            className="
              flex-1
              overflow-y-auto
            "
          >
            <div
              className="
                mx-auto
                w-full
                max-w-[1800px]
                px-4
                py-4
                md:px-6
                md:py-6
                lg:px-8
              "
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}