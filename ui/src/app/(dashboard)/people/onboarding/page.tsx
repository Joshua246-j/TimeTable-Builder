import { Metadata } from 'next';
import { OnboardingFlow } from '@/features/onboarding/components/OnboardingFlow';

export const metadata: Metadata = {
  title: 'Person Onboarding | Timetable Builder',
  description: 'Create and onboard a new person into the institution.',
};

export default function PersonOnboardingPage() {
  return <OnboardingFlow />;
}
