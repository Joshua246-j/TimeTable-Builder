import React from 'react';

export interface ExamItemProps {
  month: string;
  day: string;
  subject: string;
  code: string;
  room: string;
}

export function ExamItem({ month, day, subject, code, room }: ExamItemProps) {
  return (
    <div className="flex items-center gap-4 min-w-[250px] flex-1">
      <div className="flex flex-col items-center justify-center w-12 h-14 bg-white border-2 border-slate-900 rounded-xl overflow-hidden shrink-0">
        <div className="bg-slate-900 w-full text-center py-0.5">
           <span className="text-[9px] font-[800] text-white uppercase tracking-wider leading-none block">{month}</span>
        </div>
        <div className="flex-1 flex items-center justify-center bg-white w-full">
           <span className="text-[18px] font-[800] text-slate-900 leading-none block">{day}</span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-[13px] font-[800] text-slate-900 mb-1">{subject}</span>
        <span className="text-[10px] font-[600] text-slate-500 mb-1">{code}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-[600] text-slate-400">{room}</span>
          <span className="text-[9px] font-[800] text-orange-500 uppercase">UPCOMING</span>
        </div>
      </div>
    </div>
  );
}
