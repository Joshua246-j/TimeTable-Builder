import { DashboardHeader } from "./DashboardHeader";
import { AcademicOverviewCard } from "./AcademicOverviewCard";
import { AcademicStatistics } from "./AcademicStatistics";
import { AIInsights } from "./AIInsights";

export function DashboardView() {
  return (
    <div className="h-full w-full overflow-x-hidden overflow-y-auto bg-[#F8FAFC] flex flex-col">
      <div className="w-full max-w-[1400px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <DashboardHeader />
        
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Main Content Area */}
          <div className="xl:col-span-9 flex flex-col">
            <AcademicOverviewCard />
            <AIInsights />
          </div>
          
          {/* Right Sidebar Area */}
          <div className="xl:col-span-3">
            <AcademicStatistics />
          </div>
          
        </div>
      </div>
    </div>
  );
}
