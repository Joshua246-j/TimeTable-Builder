"use client";

import React, { useState, useEffect } from 'react';
import { AcademicOverviewCard } from './AcademicOverviewCard';
import { AIInsights } from './AIInsights';
import { AcademicStatistics } from './AcademicStatistics';
import { DashboardService } from '@/services';

export function OverviewContent() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      setIsLoading(true);
      try {
        await DashboardService.getOverview();
      } catch (error) {
        console.error("Failed to load dashboard overview", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5A67D8]"></div></div>;
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-8 mt-2">
      
      {/* Main Content Area */}
      <div className="xl:col-span-9 flex flex-col gap-0">
        <AcademicOverviewCard />
        <AIInsights />
      </div>
      
      {/* Right Sidebar Area */}
      <div className="xl:col-span-3 flex flex-col gap-0">
        <AcademicStatistics />
      </div>
      
    </div>
  );
}
