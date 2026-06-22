import { FileText, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function LecturePointSourceCard() {
  return (
    <Card className="mb-6 shadow-sm border-slate-200">
      <CardContent className="p-6">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#EEF2FF] p-2 rounded border border-[#E0E7FF]">
              <FileText className="w-4 h-4 text-[#5A67D8]" />
            </div>
            <h3 className="font-semibold text-slate-800 text-sm">Lecture Points Source</h3>
          </div>
          
          <Button variant="outline" size="sm" className="h-8 text-xs border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh From Lecture
          </Button>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 mb-4">
          These points are imported from the Lecture tab and will be used to generate your presentation.
        </p>

        {/* Bullet Points */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <div className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-[#5A67D8] mt-1.5 shrink-0"></div>
            <span className="text-[11px] font-semibold text-slate-700">Introduction to AVL Trees</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-[#5A67D8] mt-1.5 shrink-0"></div>
            <span className="text-[11px] font-semibold text-slate-700">Height Balancing</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-[#5A67D8] mt-1.5 shrink-0"></div>
            <span className="text-[11px] font-semibold text-slate-700">Balance Factor</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-[#5A67D8] mt-1.5 shrink-0"></div>
            <span className="text-[11px] font-semibold text-slate-700">Search Efficiency</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-[#5A67D8] mt-1.5 shrink-0"></div>
            <span className="text-[11px] font-semibold text-slate-700">Left Rotation</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-[#5A67D8] mt-1.5 shrink-0"></div>
            <span className="text-[11px] font-semibold text-slate-700">Time Complexity</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-[#5A67D8] mt-1.5 shrink-0"></div>
            <span className="text-[11px] font-semibold text-slate-700">Right Rotation</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-[#5A67D8] mt-1.5 shrink-0"></div>
            <span className="text-[11px] font-semibold text-slate-700">Applications</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-[#5A67D8] mt-1.5 shrink-0"></div>
            <span className="text-[11px] font-semibold text-slate-700">Insertion in AVL Trees</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-[#5A67D8] mt-1.5 shrink-0"></div>
            <span className="text-[11px] font-semibold text-slate-700">Deletion in AVL Trees</span>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
