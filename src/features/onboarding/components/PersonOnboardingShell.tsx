import React from 'react';
import { OnboardingBreadcrumb } from './OnboardingBreadcrumb';
import { OnboardingStepper } from './OnboardingStepper';
import { OnboardingFooter } from './OnboardingFooter';
import { ONBOARDING_STEPS, OnboardingStepId } from '../types';

interface PersonOnboardingShellProps {
  currentStep: OnboardingStepId;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  
  // Footer props
  showBack?: boolean;
  showCancel?: boolean;
  showSaveDraft?: boolean;
  continueText?: string;
  onBack?: () => void;
  onCancel?: () => void;
  onSaveDraft?: () => void;
  onContinue?: () => void;
  isContinuing?: boolean;
  isSaving?: boolean;
  disableContinue?: boolean;
}

export function PersonOnboardingShell({
  currentStep,
  children,
  sidebar,
  
  showBack = true,
  showCancel = false,
  showSaveDraft = true,
  continueText = 'Continue',
  onBack,
  onCancel,
  onSaveDraft,
  onContinue,
  isContinuing,
  isSaving,
  disableContinue
}: PersonOnboardingShellProps) {
  
  const stepConfig = ONBOARDING_STEPS.find(s => s.id === currentStep);
  const isPersonTypeStep = currentStep === 1;

  return (
    <div className="min-h-screen bg-[#1A1C23] p-4 lg:p-8">
      {/* Main Container */}
      <div className="max-w-[1600px] mx-auto bg-[#F8FAFC] rounded-2xl shadow-xl min-h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-white px-8 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#5A67D8] rounded-xl flex items-center justify-center text-white shadow-sm">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-[15px] font-bold text-slate-900 leading-tight">Person Onboarding</h1>
              <p className="text-[11px] font-medium text-slate-500">Create and onboard a new person into the institution.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#EEF2FF] text-[#5A67D8] flex items-center justify-center text-xs font-bold border border-[#E0E7FF]">
              AK
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex flex-col flex-1 px-8 py-6 max-h-full overflow-y-auto">
          
          <OnboardingBreadcrumb currentStepTitle={stepConfig?.title} />
          <OnboardingStepper currentStep={currentStep} />

          <div className="flex-1 flex flex-col">
            {isPersonTypeStep ? (
              // Step 1: Centered content, no sidebar
              <div className="max-w-4xl w-full mx-auto flex flex-col flex-1">
                {children}
                <OnboardingFooter 
                  showBack={showBack}
                  showCancel={showCancel}
                  showSaveDraft={showSaveDraft}
                  continueText={continueText}
                  onBack={onBack}
                  onCancel={onCancel}
                  onSaveDraft={onSaveDraft}
                  onContinue={onContinue}
                  isContinuing={isContinuing}
                  isSaving={isSaving}
                  disableContinue={disableContinue}
                />
              </div>
            ) : (
              // Steps 2+: Two column layout
              <div className="grid grid-cols-1 lg:grid-cols-[2.2fr_1fr] gap-8 h-full flex-1">
                {/* Left Form Content */}
                <div className="flex flex-col h-full">
                  <div className="flex-1 pb-8">
                    {children}
                  </div>
                  <div className="sticky bottom-0 bg-[#F8FAFC] pb-2 z-10">
                    <OnboardingFooter 
                      showBack={showBack}
                      showCancel={showCancel}
                      showSaveDraft={showSaveDraft}
                      continueText={continueText}
                      onBack={onBack}
                      onCancel={onCancel}
                      onSaveDraft={onSaveDraft}
                      onContinue={onContinue}
                      isContinuing={isContinuing}
                      isSaving={isSaving}
                      disableContinue={disableContinue}
                    />
                  </div>
                </div>

                {/* Right Sidebar Widgets */}
                <div className="flex flex-col gap-6">
                  {sidebar}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
