import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, X, Save } from 'lucide-react';

interface OnboardingFooterProps {
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

export function OnboardingFooter({
  showBack = true,
  showCancel = false,
  showSaveDraft = true,
  continueText = 'Continue',
  onBack,
  onCancel,
  onSaveDraft,
  onContinue,
  isContinuing = false,
  isSaving = false,
  disableContinue = false,
}: OnboardingFooterProps) {
  return (
    <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-200">
      
      {/* Left Actions */}
      <div className="flex items-center gap-3">
        {showBack && (
          <Button 
            type="button"
            variant="outline" 
            onClick={onBack}
            className="h-10 px-4 text-slate-600 border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
        
        {showCancel && (
          <Button 
            type="button"
            variant="outline" 
            onClick={onCancel}
            className="h-10 px-4 text-slate-600 border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {showSaveDraft && (
          <Button 
            type="button"
            variant="outline" 
            onClick={onSaveDraft}
            disabled={isSaving}
            className="h-10 px-4 text-slate-600 border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Draft'}
          </Button>
        )}

        <Button 
          type="button"
          onClick={onContinue}
          disabled={disableContinue || isContinuing}
          className="h-10 px-6 bg-[#5A67D8] hover:bg-[#4C51BF] text-white shadow-sm transition-all"
        >
          {continueText}
          {!isContinuing && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>

    </div>
  );
}
