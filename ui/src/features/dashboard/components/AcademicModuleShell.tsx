import React from 'react';
import Link from 'next/link';
import { ChevronRight, Menu, Rows3 } from 'lucide-react';

export type AcademicTab = 'overview' | 'attendance' | 'lecture' | 'presentations' | 'notes' | 'settings';

interface AcademicModuleShellProps {
  activeTab: AcademicTab;
  children: React.ReactNode;
}

export function AcademicModuleShell({ activeTab, children }: AcademicModuleShellProps) {
  const tabs = [
    { id: 'overview', label: 'Overview', href: '/dashboard' },
    { id: 'attendance', label: 'Attendance', href: '/attendance' },
    { id: 'lecture', label: 'Lecture', href: '/lecture' },
    { id: 'presentations', label: 'Presentations', href: '/presentations' },
    { id: 'notes', label: 'Notes', href: '/notes' },
    { id: 'settings', label: 'Settings', href: '/settings' },
  ];

  // Map activeTab to a capitalized title for the breadcrumb
  const breadcrumbTitle = tabs.find(t => t.id === activeTab)?.label || 'Overview';

  return (
    <div className="h-full w-full overflow-x-hidden overflow-y-auto bg-[#F7F8FC] flex flex-col">
      <div className="w-full max-w-[1600px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Unified Header */}
        <div className="w-full bg-white rounded-xl shadow-sm border border-slate-100 p-2 mb-6">
          <div className="flex items-center justify-between px-4 pt-3 pb-4 border-b border-slate-100">
            {/* Breadcrumbs */}
            <div className="flex items-center text-sm font-medium text-slate-500">
              <Link href="/dashboard" className="hover:text-slate-900 transition-colors">Dashboard</Link>
              <ChevronRight className="h-4 w-4 mx-2 text-slate-400" />
              <span className="hover:text-slate-900 transition-colors cursor-pointer">Academic Modules</span>
              <ChevronRight className="h-4 w-4 mx-2 text-slate-400" />
              <span className="hover:text-slate-900 transition-colors cursor-pointer">Data Structures</span>
              <ChevronRight className="h-4 w-4 mx-2 text-slate-400" />
              <span className="text-slate-900 font-semibold">{breadcrumbTitle}</span>
            </div>

            {/* Layout Toggles */}
            <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-100">
              <button className="flex items-center gap-2 bg-[#5A67D8] text-white px-4 py-1.5 rounded-md text-sm font-semibold shadow-sm transition-colors">
                <Rows3 className="h-4 w-4" />
                Tabs Layout
              </button>
              <button className="flex items-center gap-2 text-slate-500 px-4 py-1.5 rounded-md text-sm font-semibold hover:text-slate-800 transition-colors">
                <Menu className="h-4 w-4" />
                Menu Layout
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-4 pt-3 pb-0 flex gap-8 text-sm font-medium text-slate-500">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`pb-3 px-2 transition-colors ${
                    isActive 
                      ? "text-[#5A67D8] border-b-2 border-[#5A67D8]" 
                      : "hover:text-slate-800"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        {children}

      </div>
    </div>
  );
}
