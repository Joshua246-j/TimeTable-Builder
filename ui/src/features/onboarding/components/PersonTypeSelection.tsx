import React from 'react';
import { useFormContext } from 'react-hook-form';
import { OnboardingFormData } from '../schema';
import { GraduationCap, Briefcase, CheckCircle2, Circle } from 'lucide-react';

export function PersonTypeSelection() {
  const { watch, setValue } = useFormContext<OnboardingFormData>();
  
  const selectedType = watch('personType.personType');

  const handleSelect = (type: 'student' | 'staff') => {
    setValue('personType.personType', type, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Select Person Type</h2>
        <p className="text-sm font-medium text-slate-500">Choose the type of person you want to onboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        
        {/* Staff Card */}
        <div 
          onClick={() => handleSelect('staff')}
          className={`relative flex flex-col items-center p-10 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
            selectedType === 'staff' 
              ? 'border-[#5A67D8] bg-white shadow-md' 
              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
          }`}
        >
          {selectedType === 'staff' && (
            <div className="absolute top-4 right-4 text-[#5A67D8]">
              <CheckCircle2 className="w-5 h-5 fill-current text-white bg-[#5A67D8] rounded-full" />
            </div>
          )}
          
          <div className="w-16 h-16 rounded-2xl bg-[#EEF2FF] flex items-center justify-center text-[#5A67D8] mb-6">
            <Briefcase className="w-8 h-8" />
          </div>
          
          <h3 className="text-lg font-bold text-slate-800 mb-2">Staff Onboarding</h3>
          <p className="text-sm text-slate-500 text-center mb-8 max-w-[200px]">Create and provision a staff member.</p>
          
          <div className="mt-auto">
            {selectedType === 'staff' ? (
              <div className="w-5 h-5 rounded-full border-[6px] border-[#5A67D8]" />
            ) : (
              <Circle className="w-5 h-5 text-slate-300" />
            )}
          </div>
        </div>

        {/* Student Card */}
        <div 
          onClick={() => handleSelect('student')}
          className={`relative flex flex-col items-center p-10 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
            selectedType === 'student' 
              ? 'border-[#5A67D8] bg-white shadow-md' 
              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
          }`}
        >
          {selectedType === 'student' && (
            <div className="absolute top-4 right-4 text-[#5A67D8]">
              <CheckCircle2 className="w-5 h-5 fill-[#5A67D8] text-white" />
            </div>
          )}
          
          <div className="w-16 h-16 rounded-2xl bg-[#EEF2FF] flex items-center justify-center text-[#5A67D8] mb-6">
            <GraduationCap className="w-8 h-8" />
          </div>
          
          <h3 className="text-lg font-bold text-slate-800 mb-2">Student Onboarding</h3>
          <p className="text-sm text-slate-500 text-center mb-8 max-w-[200px]">Create a student profile with optional guardian linkage.</p>
          
          <div className="mt-auto">
            {selectedType === 'student' ? (
              <div className="w-5 h-5 rounded-full border-[6px] border-[#5A67D8]" />
            ) : (
              <Circle className="w-5 h-5 text-slate-300" />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
