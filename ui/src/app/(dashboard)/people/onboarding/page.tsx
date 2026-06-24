import { Metadata } from 'next';
import OnboardingWizard from '@/features/onboarding-wizard/OnboardingWizard';

export const metadata: Metadata = {
  title: 'Person Onboarding | Timetable Builder',
  description: 'Create and onboard a new person into the institution.',
};

export default function PersonOnboardingPage() {
  return <OnboardingWizard />;
}
