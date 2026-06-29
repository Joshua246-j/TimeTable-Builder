import React from 'react';
import Link from 'next/link';
import { ChevronRight, Menu, Rows3 } from 'lucide-react';
import { subjectService } from '@/services/subjectService';

export type AcademicTab = 'overview' | 'attendance' | 'lecture' | 'presentations' | 'notes' | 'settings' | 'analytics' | 'assignments' | 'resources';

interface AcademicModuleShellProps {
  activeTab: AcademicTab;
  subjectId?: string;
  children: React.ReactNode;
}

export async function AcademicModuleShell({ activeTab, subjectId, children }: AcademicModuleShellProps) {
  const resolvedId = subjectId || '1';
  const subject = await subjectService.getSubjectById(resolvedId);

  if (!subject) return <div className="p-12 text-center text-slate-500">Subject not found</div>;

  const tabs = [
    { id: 'overview', label: 'Overview', href: `/dashboard/academic-modules/${subject.id}` },
    { id: 'attendance', label: 'Attendance', href: `/dashboard/academic-modules/${subject.id}/attendance` },
    { id: 'lecture', label: 'Lecture', href: `/dashboard/academic-modules/${subject.id}/lecture` },
    { id: 'presentations', label: 'Presentations', href: `/dashboard/academic-modules/${subject.id}/presentations` },
    { id: 'notes', label: 'Notes', href: `/dashboard/academic-modules/${subject.id}/notes` },
    { id: 'settings', label: 'Settings', href: `/dashboard/academic-modules/${subject.id}/settings` },
  ];

  // Map activeTab to a capitalized title for the breadcrumb
  const breadcrumbTitle = tabs.find(t => t.id === activeTab)?.label || 'Overview';

  return (
    <div className="h-full w-full overflow-x-hidden overflow-y-auto bg-[#F7F8FC] flex flex-col font-inter">
      <div className="w-full max-w-[1600px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Unified Header */}
        <div className="w-full bg-white rounded-xl shadow-sm border border-slate-100 p-2 mb-6">
          <div className="flex items-center justify-between px-4 pt-3 pb-4 border-b border-slate-100">
            {/* Breadcrumbs */}
            <div className="flex items-center text-sm font-medium text-slate-500">
              <Link href="/dashboard" className="hover:text-slate-900 transition-colors">Dashboard</Link>
              <ChevronRight className="h-4 w-4 mx-2 text-slate-400" />
              <Link href="/dashboard/academic-modules" className="hover:text-slate-900 transition-colors">Academic Modules</Link>
              <ChevronRight className="h-4 w-4 mx-2 text-slate-400" />
              <Link href={`/dashboard/academic-modules/${subject.id}`} className="hover:text-slate-900 transition-colors">{subject.subjectName}</Link>
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
