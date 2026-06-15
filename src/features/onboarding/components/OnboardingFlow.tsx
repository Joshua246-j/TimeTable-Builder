"use client";

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { OnboardingMasterSchema, OnboardingFormData } from '../schema';
import { PersonOnboardingShell } from './PersonOnboardingShell';
import { OnboardingStepId } from '../types';

import { PersonTypeSelection } from './PersonTypeSelection';
import { PersonalInformation } from './PersonalInformation';
import { GuardianManagement } from './GuardianManagement';
import { Qualifications } from './Qualifications';
import { Placement } from './Placement';

// Sidebars
import { ProfilePreviewCard } from './ProfilePreviewCard';
import { CompletionStatusCard } from './CompletionStatusCard';
import { ValidationStatusCard } from './ValidationStatusCard';
import { RequiredFieldsCard } from './RequiredFieldsCard';
import { SummaryCard } from './SummaryCard';

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState<OnboardingStepId>(1);

  const methods = useForm<OnboardingFormData>({
    resolver: zodResolver(OnboardingMasterSchema),
    mode: 'onChange',
    defaultValues: {
      personType: { personType: null as unknown as "Student" | "Staff" },
      personalInfo: { sameAsPermanent: false },
      guardian: { hasExistingGuardian: false, isPrimary: false },
      qualifications: {},
      placement: {}
    }
  });

  const { handleSubmit, formState: { errors }, watch } = methods;

  const nextStep = async () => {
    // Ideally we would trigger validation for specific step here
    // For now just move to next
    if (currentStep < 7) {
      setCurrentStep((currentStep + 1) as OnboardingStepId);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as OnboardingStepId);
    }
  };

  const onSubmit = (data: OnboardingFormData) => {
    console.log("FINAL SUBMISSION", data);
  };

  // Build the sidebar dynamically based on the current step
  const renderSidebar = () => {
    switch (currentStep) {
      case 2:
        return (
          <>
            <ProfilePreviewCard />
            <CompletionStatusCard completed={1} inProgress={1} pending={5} total={7} />
            <ValidationStatusCard 
              isValid={!errors.personalInfo} 
              errors={errors.personalInfo ? Object.values(errors.personalInfo).map(e => (e as {message?: string})?.message) : []} 
            />
            <RequiredFieldsCard sections={[
              { id: '1', label: 'Basic Information', missingCount: 3 },
              { id: '2', label: 'Contact Information', missingCount: 2 },
              { id: '3', label: 'Address Information', missingCount: 1 },
              { id: '4', label: 'Emergency Contact', missingCount: 1 },
            ]} />
          </>
        );
      case 3:
        return (
          <>
            <SummaryCard 
              title="Guardian Summary" 
              items={[
                { id: '1', label: 'Primary Guardian', value: 'Not assigned' }
              ]} 
            />
            <SummaryCard 
              title="Relationship Details" 
              items={[
                { id: '1', label: 'Guardian Type', value: 'Not set' },
                { id: '2', label: 'Relationship', value: 'Not set' },
                { id: '3', label: 'Contact Number', value: 'Not set' },
              ]} 
            />
          </>
        );
      case 4:
        return (
          <>
            <SummaryCard 
              title="Qualification Summary" 
              items={[
                { id: '1', label: 'Academic Qualification', value: 'Not added' },
                { id: '2', label: 'Professional Qualification', value: 'Not added' },
                { id: '3', label: 'Experience Details', value: 'Not added' },
              ]} 
            />
            <CompletionStatusCard completed={3} inProgress={1} pending={3} total={7} />
          </>
        );
      case 5:
        return (
          <>
            <SummaryCard 
              title="Placement Summary" 
              items={[
                { id: '1', label: 'Placement Type', value: personTypeVal || 'Student' },
                { id: '2', label: 'Academic Year', value: '2024-25' },
              ]} 
            />
            <ValidationStatusCard isValid={true} />
          </>
        );
      default:
        return null;
    }
  };

  // eslint-disable-next-line
  const personTypeVal = watch('personType.personType');

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <PersonOnboardingShell
          currentStep={currentStep}
          showBack={currentStep > 1}
          showCancel={currentStep === 1}
          showSaveDraft={currentStep > 1}
          continueText={currentStep === 7 ? 'Submit' : 'Continue'}
          onBack={prevStep}
          onContinue={nextStep}
          disableContinue={currentStep === 1 && !personTypeVal}
          sidebar={renderSidebar()}
        >
          {currentStep === 1 && <PersonTypeSelection />}
          {currentStep === 2 && <PersonalInformation />}
          {currentStep === 3 && <GuardianManagement />}
          {currentStep === 4 && <Qualifications />}
          {currentStep === 5 && <Placement />}
          {currentStep === 6 && <div className="p-10 text-center font-bold">Credentials Step (Placeholder)</div>}
          {currentStep === 7 && <div className="p-10 text-center font-bold">Review Step (Placeholder)</div>}
        </PersonOnboardingShell>
      </form>
    </FormProvider>
  );
}
