export type OnboardingStepId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface OnboardingStep {
  id: OnboardingStepId;
  title: string;
  isCompleted?: boolean;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  { id: 1, title: 'Person Type' },
  { id: 2, title: 'Personal Information' },
  { id: 3, title: 'Guardian' },
  { id: 4, title: 'Qualifications' },
  { id: 5, title: 'Placement' },
  { id: 6, title: 'Credentials' },
  { id: 7, title: 'Review' },
];

export type PersonType = 'student' | 'staff' | null;
