import { LectureInfo } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { ClipboardList, BookOpen, User, Calendar, Clock, Building2 } from 'lucide-react';

interface LectureInformationCardProps {
  info: LectureInfo;
}

export function LectureInformationCard({ info }: LectureInformationCardProps) {
  return (
    <Card className="mb-6 shadow-sm border-slate-200">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-[#EEF2FF] p-2 rounded-lg">
            <ClipboardList className="w-5 h-5 text-[#5A67D8]" />
          </div>
          <h3 className="font-semibold text-slate-800 text-lg">Lecture Information</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
          {/* Subject */}
          <div className="flex items-start gap-3">
            <div className="bg-[#F8FAFC] p-2 rounded-md mt-0.5 border border-slate-100">
              <BookOpen className="w-4 h-4 text-[#5A67D8]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Subject</span>
              <span className="text-sm font-semibold text-slate-800">{info.subject}</span>
            </div>
          </div>

          {/* Faculty */}
          <div className="flex items-start gap-3">
            <div className="bg-[#F8FAFC] p-2 rounded-md mt-0.5 border border-slate-100">
              <User className="w-4 h-4 text-[#5A67D8]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Faculty</span>
              <span className="text-sm font-semibold text-slate-800">{info.faculty}</span>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-start gap-3">
            <div className="bg-[#F8FAFC] p-2 rounded-md mt-0.5 border border-slate-100">
              <Calendar className="w-4 h-4 text-[#5A67D8]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Date</span>
              <span className="text-sm font-semibold text-slate-800">{info.date}</span>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-start gap-3">
            <div className="bg-[#F8FAFC] p-2 rounded-md mt-0.5 border border-slate-100">
              <Clock className="w-4 h-4 text-[#5A67D8]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Time</span>
              <span className="text-sm font-semibold text-slate-800">{info.time}</span>
            </div>
          </div>

          {/* Section */}
          <div className="flex items-start gap-3">
            <div className="bg-[#F8FAFC] p-2 rounded-md mt-0.5 border border-slate-100">
              <Building2 className="w-4 h-4 text-[#5A67D8]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Section</span>
              <span className="text-sm font-semibold text-slate-800">{info.section}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
