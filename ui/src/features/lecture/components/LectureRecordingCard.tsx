import { MoreHorizontal, Mic, Play, Pause, Square, Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function LectureRecordingCard() {
  return (
    <Card className="mb-6 shadow-sm border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-6">
        <CardTitle className="text-sm font-semibold text-slate-800">Lecture recording</CardTitle>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </CardHeader>
      
      <CardContent className="px-6 pb-6 pt-4 flex flex-col items-center">
        
        {/* Pulsing Mic */}
        <div className="relative w-24 h-24 flex items-center justify-center mb-8 mt-4">
          <div className="absolute inset-0 bg-[#EEF2FF] rounded-full opacity-50"></div>
          <div className="absolute inset-2 bg-[#E0E7FF] rounded-full opacity-60"></div>
          <div className="relative z-10 bg-white p-3 rounded-full shadow-sm border border-[#E0E7FF]">
            <Mic className="w-8 h-8 text-[#5A67D8]" />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-8 mb-8 w-full">
          <div className="flex flex-col items-center gap-2">
            <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all shadow-sm">
              <Play className="w-5 h-5 ml-1" />
            </button>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Start Recording</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <button className="w-14 h-14 flex items-center justify-center rounded-full bg-[#5A67D8] text-white hover:bg-[#4C51BF] transition-all shadow-md shadow-[#5A67D8]/30">
              <Pause className="w-6 h-6 fill-current" />
            </button>
            <span className="text-[9px] font-bold text-slate-800 uppercase tracking-wider">Pause Recording</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all shadow-sm">
              <Square className="w-4 h-4 fill-current" />
            </button>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Stop Recording</span>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-0 w-full border border-slate-100 rounded-xl overflow-hidden bg-[#F8FAFC]">
          
          <div className="p-3 border-r border-slate-100 flex flex-col justify-center">
            <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Recording Status</span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#16A34A]"></div>
              <span className="text-xs font-semibold text-slate-800">Recording</span>
            </div>
          </div>
          
          <div className="p-3 border-r border-slate-100 flex flex-col justify-center">
            <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Duration</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#5A67D8]" />
              <span className="text-xs font-bold text-slate-800">00:15:24</span>
            </div>
          </div>
          
          <div className="p-3 flex flex-col justify-center">
            <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Transcript Status</span>
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#5A67D8]" />
              <span className="text-xs font-semibold text-slate-800">In Progress</span>
            </div>
          </div>

        </div>

      </CardContent>
    </Card>
  );
}
