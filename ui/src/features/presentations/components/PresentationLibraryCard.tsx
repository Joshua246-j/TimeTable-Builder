import { ExternalLink, Edit2, Copy, Eye, FileText, FlaskConical, BookOpen, Layers } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export interface PresentationData {
  id: string;
  title: string;
  created: string;
  slides: number;
  lastModified: string;
  sourceLecture: string;
  color: string;
  bgColor: string;
  icon: 'file' | 'flask' | 'book' | 'layers';
}

interface PresentationLibraryCardProps {
  data: PresentationData;
}

export function PresentationLibraryCard({ data }: PresentationLibraryCardProps) {
  const IconMap = {
    file: FileText,
    flask: FlaskConical,
    book: BookOpen,
    layers: Layers,
  };
  
  const Icon = IconMap[data.icon];

  return (
    <Card className="shadow-sm border-slate-200 h-full flex flex-col hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-5 flex flex-col h-full">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="p-2.5 rounded-lg border" style={{ backgroundColor: data.bgColor, borderColor: `${data.bgColor}80` }}>
            <Icon className="w-5 h-5" style={{ color: data.color }} />
          </div>
          <div className="flex flex-col items-end text-right">
            <h4 className="font-semibold text-slate-800 text-sm max-w-[140px] truncate">{data.title}</h4>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">Created {data.created}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Slides</span>
            <span className="text-sm font-bold text-slate-800">{data.slides}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Last Modified</span>
            <span className="text-[11px] font-semibold text-slate-800">{data.lastModified}</span>
          </div>
        </div>

        {/* Source Lecture */}
        <div className="flex flex-col mb-6 mt-auto">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Source Lecture</span>
          <span className="text-[11px] font-semibold text-slate-800 truncate">{data.sourceLecture}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button className="text-slate-400 hover:text-[#5A67D8] transition-colors p-1">
            <ExternalLink className="w-4 h-4" />
          </button>
          <button className="text-slate-400 hover:text-[#5A67D8] transition-colors p-1">
            <Edit2 className="w-4 h-4" />
          </button>
          <button className="text-slate-400 hover:text-[#5A67D8] transition-colors p-1">
            <Eye className="w-4 h-4" />
          </button>
          <button className="text-slate-400 hover:text-[#5A67D8] transition-colors p-1">
            <Copy className="w-4 h-4" />
          </button>
        </div>

      </CardContent>
    </Card>
  );
}
