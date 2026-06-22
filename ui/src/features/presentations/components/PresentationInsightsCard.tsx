import { Sparkles, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function PresentationInsightsCard() {
  return (
    <Card className="mb-6 shadow-sm border-slate-200">
      <CardContent className="p-5 flex flex-col">
        
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="w-4 h-4 text-[#5A67D8]" />
          <h3 className="font-bold text-[11px] text-slate-800 uppercase tracking-widest">Presentation Insights</h3>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-5">
          {/* Slides Generated */}
          <div className="flex flex-col border-r border-slate-100 pr-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Slides Generated</span>
            <span className="text-2xl font-bold text-slate-800 leading-none mb-1">10</span>
            <span className="text-[10px] text-slate-500 font-medium">Total Slides</span>
          </div>
          
          {/* Est. Duration */}
          <div className="flex flex-col border-r border-slate-100 pr-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Est. Duration</span>
            <span className="text-2xl font-bold text-slate-800 leading-none mb-1">18 <span className="text-sm font-semibold">Mins</span></span>
            <span className="text-[10px] text-slate-500 font-medium">Estimated Time</span>
          </div>

          {/* Content Coverage */}
          <div className="flex flex-col border-r border-slate-100 pr-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Content Coverage</span>
            <div className="flex items-center gap-1.5 mb-1">
              <svg className="w-5 h-5 transform -rotate-90">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-200" />
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray="50" strokeDashoffset="3" className="text-[#5A67D8]" />
              </svg>
              <span className="text-2xl font-bold text-slate-800 leading-none">94%</span>
            </div>
            <span className="text-[10px] font-semibold text-[#16A34A]">Excellent Coverage</span>
          </div>

          {/* AI Quality Score */}
          <div className="flex flex-col relative">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">AI Quality Score</span>
            <span className="text-2xl font-bold text-[#5A67D8] leading-none mb-1">A+</span>
            <span className="text-[10px] text-slate-500 font-medium">Excellent Quality</span>
            
            <div className="absolute top-1/2 -translate-y-1/2 right-2 bg-[#EEF2FF] p-2 rounded-full">
              <Star className="w-5 h-5 text-[#5A67D8] fill-current" />
            </div>
          </div>
        </div>

        {/* Bottom Info Bar */}
        <div className="bg-[#EEF2FF] rounded-lg p-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#5A67D8] shrink-0" />
          <p className="text-xs font-medium text-[#5A67D8]">
            This presentation was generated using AI based on your lecture points. You can edit, reorder, or regenerate slides anytime.
          </p>
        </div>

      </CardContent>
    </Card>
  );
}
