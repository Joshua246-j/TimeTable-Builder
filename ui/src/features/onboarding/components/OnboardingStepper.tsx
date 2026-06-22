import React from 'react';
import { Check } from 'lucide-react';
import { ONBOARDING_STEPS, OnboardingStepId } from '../types';

interface OnboardingStepperProps {
  currentStep: OnboardingStepId;
}

export function OnboardingStepper({ currentStep }: OnboardingStepperProps) {
  return (
    <div className="w-full flex items-start justify-between mb-10 px-4 max-w-4xl mx-auto relative">
      
      {/* Background Lines */}
      <div className="absolute top-5 left-[5%] right-[5%] h-0.5 bg-slate-200 -z-10" />
      
      {/* Active Line Fill */}
      <div 
        className="absolute top-5 left-[5%] h-0.5 bg-[#10B981] -z-10 transition-all duration-500 ease-in-out" 
        style={{ width: `${Math.max(0, (currentStep - 1) / (ONBOARDING_STEPS.length - 1)) * 90}%` }}
      />

      {ONBOARDING_STEPS.map((step) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;

        return (
          <div key={step.id} className="flex flex-col items-center relative bg-[#F7F8FC] px-2">
            
            {/* Circle */}
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-3 shadow-sm transition-colors ${
                isCompleted 
                  ? 'bg-white border-2 border-[#10B981] text-[#10B981]' 
                  : isActive 
                    ? 'bg-[#5A67D8] text-white border-2 border-[#5A67D8]' 
                    : 'bg-white border-2 border-slate-200 text-slate-400'
              }`}
            >
              {isCompleted ? <Check className="w-5 h-5" strokeWidth={3} /> : step.id}
            </div>

            {/* Label */}
            <div className={`text-[11px] text-center font-bold uppercase tracking-wider max-w-[80px] leading-tight ${
              isCompleted 
                ? 'text-[#10B981]' 
                : isActive 
                  ? 'text-[#5A67D8]' 
                  : 'text-slate-400'
            }`}>
              {step.title.split(' ').map((word, i) => (
                <React.Fragment key={i}>
                  {word}
                  {i < step.title.split(' ').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>

          </div>
        );
      })}
    </div>
  );
}
