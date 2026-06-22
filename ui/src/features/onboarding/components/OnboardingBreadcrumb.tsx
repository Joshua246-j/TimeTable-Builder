import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface OnboardingBreadcrumbProps {
  currentStepTitle?: string;
}

export function OnboardingBreadcrumb({ currentStepTitle }: OnboardingBreadcrumbProps) {
  return (
    <div className="flex items-center text-xs font-semibold text-slate-500 mb-8 pt-2">
      <Link href="/dashboard" className="hover:text-slate-900 transition-colors">Dashboard</Link>
      <ChevronRight className="h-3.5 w-3.5 mx-2 text-slate-400" />
      <span className="hover:text-slate-900 transition-colors cursor-pointer">People</span>
      <ChevronRight className="h-3.5 w-3.5 mx-2 text-slate-400" />
      <span className="text-slate-900">Person Onboarding</span>
      {currentStepTitle && currentStepTitle !== 'Person Type' && (
        <>
          <ChevronRight className="h-3.5 w-3.5 mx-2 text-slate-400" />
          <span className="text-slate-900">{currentStepTitle}</span>
        </>
      )}
    </div>
  );
}
