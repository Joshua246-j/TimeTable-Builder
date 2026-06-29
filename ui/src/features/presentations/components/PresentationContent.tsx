import React from 'react';
import { PresentationPreviewCard } from './PresentationPreviewCard';
import { PresentationInsightsCard } from './PresentationInsightsCard';
import { PresentationLibrary } from './PresentationLibrary';
import { LecturePointSourceCard } from './LecturePointSourceCard';
import { ImportContentCard } from './ImportContentCard';
import { ExportPresentationCard } from './ExportPresentationCard';

export function PresentationContent({}: { subjectId?: string }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2.2fr_1fr] gap-6 xl:gap-8 mt-2">
      
      {/* Left Column (Approx 68%) */}
      <div className="flex flex-col gap-0 min-w-0">
        <PresentationPreviewCard />
        <PresentationInsightsCard />
        <PresentationLibrary />
      </div>

      {/* Right Column (Approx 32%) */}
      <div className="flex flex-col gap-0 min-w-0">
        <LecturePointSourceCard />
        <ImportContentCard />
        <ExportPresentationCard />
      </div>

    </div>
  );
}
