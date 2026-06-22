import { Sparkles, Check } from 'lucide-react';
import { InfoCard } from '@/components/shared';

interface AttendanceInsightsCardProps {
  insights?: string[];
}

export function AttendanceInsightsCard({ insights = [] }: AttendanceInsightsCardProps) {
  const displayInsights = insights.length > 0 ? insights : [
    '7 students have attendance below 75%.',
    'Attendance increased by 4% compared to last week.',
    '3 students are at risk of shortage.',
    'Consider reaching out to students with low attendance.'
  ];

  return (
    <InfoCard
      title="AI attendance insights"
      icon={<Sparkles className="w-5 h-5 text-[#5A67D8]" />}
      className="mb-6 bg-[#F4F5FB] border-[#E2E8F0]/50"
    >
      <ul className="space-y-3">
        {displayInsights.map((insight, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-[#5A67D8] mt-0.5 shrink-0" />
            <span className="text-sm text-slate-600">{insight}</span>
          </li>
        ))}
      </ul>
    </InfoCard>
  );
}
