import { List, ChevronRight, FileType2, FileText, Image as ImageIcon, MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function ExportPresentationCard() {
  return (
    <Card className="mb-6 shadow-sm border-slate-200 flex flex-col h-full">
      <CardContent className="p-6 flex flex-col h-full">
        
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <List className="w-4 h-4 text-[#5A67D8]" />
          <h3 className="font-semibold text-slate-800 text-sm">Export Presentation</h3>
        </div>
        <p className="text-[11px] text-slate-500 mb-5">
          Export your generated presentation in multiple formats.
        </p>

        {/* Options List */}
        <div className="flex flex-col gap-3 mb-5">
          
          {/* PPTX */}
          <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#FFF7ED] border border-[#FFEDD5] flex items-center justify-center text-[#F97316]">
                <FileType2 className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-700">Export as PPTX</span>
                <span className="text-[9px] font-medium text-slate-400">PowerPoint Presentation</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
          </div>

          {/* PDF */}
          <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#FEF2F2] border border-[#FEE2E2] flex items-center justify-center text-[#EF4444]">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-700">Export as PDF</span>
                <span className="text-[9px] font-medium text-slate-400">PDF Document</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
          </div>

          {/* Google Slides */}
          <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#FEFCE8] border border-[#FEF08A] flex items-center justify-center text-[#EAB308]">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-700">Export as Google Slides</span>
                <span className="text-[9px] font-medium text-slate-400">Google Slides Format</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
          </div>
          
        </div>

        {/* More Options */}
        <div className="mt-auto border border-slate-100 rounded-lg p-3 flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
          <MoreHorizontal className="w-4 h-4 text-slate-400" />
          <div className="flex flex-col items-center">
             <span className="text-[10px] font-bold text-slate-700 leading-tight">More Options</span>
             <span className="text-[8px] font-medium text-slate-400 leading-tight">Additional Formats</span>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
