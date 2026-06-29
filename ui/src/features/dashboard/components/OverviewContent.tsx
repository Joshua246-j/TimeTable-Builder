import React from 'react';
import { AcademicOverviewCard } from './AcademicOverviewCard';
import { AIInsights } from './AIInsights';
import { AcademicStatistics } from './AcademicStatistics';

export async function OverviewContent({ subjectId }: { subjectId?: string }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-8 mt-2">
      
      {/* Main Content Area */}
      <div className="xl:col-span-9 flex flex-col gap-0">
        <AcademicOverviewCard subjectId={subjectId} />
        <AIInsights subjectId={subjectId} />
      </div>
      
      {/* Right Sidebar Area */}
      <div className="xl:col-span-3 flex flex-col gap-0">
        <AcademicStatistics subjectId={subjectId} />
      </div>
      
    </div>
  );
}
