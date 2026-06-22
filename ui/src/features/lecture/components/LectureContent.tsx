import React from 'react';
import { LectureEditorCard } from './LectureEditorCard';
import { GeneratedOverviewCard } from './GeneratedOverviewCard';
import { LectureRecordingCard } from './LectureRecordingCard';
import { LiveTranscriptCard } from './LiveTranscriptCard';

export function LectureContent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2.2fr_1fr] gap-6 xl:gap-8 mt-2">
      
      {/* Left Column (70%) */}
      <div className="flex flex-col gap-0 min-w-0">
        <LectureEditorCard />
        <GeneratedOverviewCard />
      </div>

      {/* Right Column (30%) */}
      <div className="flex flex-col gap-0 min-w-0">
        <LectureRecordingCard />
        <LiveTranscriptCard />
      </div>

    </div>
  );
}
