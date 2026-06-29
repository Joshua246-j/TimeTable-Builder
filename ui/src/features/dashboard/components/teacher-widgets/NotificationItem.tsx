import React from 'react';

export interface NotificationItemProps {
  icon: React.ReactNode;
  text: string;
  time: string;
  unread?: boolean;
}

export function NotificationItem({ icon, text, time, unread }: NotificationItemProps) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 rounded-lg px-2 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
          {icon}
        </div>
        <span className="text-[12px] font-[600] text-slate-600 line-clamp-1 pr-4">{text}</span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[10px] font-[600] text-slate-400">{time}</span>
        <div className={`w-1.5 h-1.5 rounded-full ${unread ? 'bg-[#5A67D8]' : 'bg-transparent'}`}></div>
      </div>
    </div>
  );
}
