"use client";

import React, { useState, useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronLeft, ChevronRight, Calendar, CalendarDays, History, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimetableDatePickerProps {
  selectedDate: string; // YYYY-MM-DD
  selectedWeek: string; // YYYY-WXX
  onNavigate: (action: 'PREV_DAY' | 'NEXT_DAY' | 'PREV_WEEK' | 'NEXT_WEEK' | 'TODAY') => void;
  onSelectDate: (date: Date) => void;
  publishedVersions: Record<string, unknown>[];
}

export default function TimetableDatePicker({
  selectedDate,
  selectedWeek,
  onNavigate,
  onSelectDate,
  publishedVersions
}: TimetableDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Parse current date or fallback
  const currentDate = useMemo(() => {
    const d = new Date(selectedDate);
    return isNaN(d.getTime()) ? new Date() : d;
  }, [selectedDate]);

  // View state for the calendar (month/year being viewed)
  const [viewDate, setViewDate] = useState<Date>(currentDate);

  // Sync viewDate when popover opens
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setViewDate(currentDate);
    }
  };

  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();

  // Generate calendar grid
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
  const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Adjust so Monday is 0

  const calendarDays = [];
  
  // Previous month padding
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
  for (let i = startingDay - 1; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - 1, prevMonthDays - i);
    calendarDays.push({ date: d, isCurrentMonth: false });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(currentYear, currentMonth, i);
    calendarDays.push({ date: d, isCurrentMonth: true });
  }

  // Next month padding
  const remainingSlots = 42 - calendarDays.length; // 6 rows * 7 days
  for (let i = 1; i <= remainingSlots; i++) {
    const d = new Date(currentYear, currentMonth + 1, i);
    calendarDays.push({ date: d, isCurrentMonth: false });
  }

  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleSelectDate = (date: Date) => {
    onSelectDate(date);
    setIsOpen(false);
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const formatMonthYear = (d: Date) => {
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-3 bg-white px-3 py-1.5 border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98]">
            <div className="w-7 h-7 rounded-lg bg-[#5A67D8]/10 text-[#5A67D8] flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="flex flex-col items-start mr-2">
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase leading-none mb-0.5">
                Week {selectedWeek.split('-W')[1] || ''}
              </span>
              <span className="text-[13px] font-bold text-slate-800 leading-none">
                {formatDateLabel(selectedDate)}
              </span>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[420px] p-0 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-slate-200" align="start">
          <div className="flex h-[320px]">
            {/* Sidebar for Quick Actions */}
            <div className="w-[140px] bg-slate-50 border-r border-slate-100 p-3 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Quick Jump</span>
              <button 
                onClick={() => { onNavigate('TODAY'); setIsOpen(false); }}
                className="text-left text-[13px] font-semibold text-slate-600 hover:text-[#5A67D8] hover:bg-[#5A67D8]/5 px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <CalendarDays className="w-3.5 h-3.5" /> Today
              </button>
              <button 
                onClick={() => { onNavigate('PREV_DAY'); setIsOpen(false); }}
                className="text-left text-[13px] font-semibold text-slate-600 hover:text-[#5A67D8] hover:bg-[#5A67D8]/5 px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                Yesterday
              </button>
              <button 
                onClick={() => { onNavigate('PREV_WEEK'); setIsOpen(false); }}
                className="text-left text-[13px] font-semibold text-slate-600 hover:text-[#5A67D8] hover:bg-[#5A67D8]/5 px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <History className="w-3.5 h-3.5" /> Last Week
              </button>
              <button 
                onClick={() => { onNavigate('NEXT_WEEK'); setIsOpen(false); }}
                className="text-left text-[13px] font-semibold text-slate-600 hover:text-[#5A67D8] hover:bg-[#5A67D8]/5 px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                Next Week
              </button>
              
              <div className="mt-auto">
                <div className="w-full h-px bg-slate-200 mb-2"></div>
                <div className="px-2 py-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Clock className="w-3 h-3" /> Timezone</span>
                  <span className="text-[11px] font-semibold text-slate-600 mt-0.5 block">Local Time (IST)</span>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 p-4 bg-white flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] font-bold text-slate-900 ml-2">
                  {formatMonthYear(viewDate)}
                </span>
                <div className="flex gap-1">
                  <button onClick={handlePrevMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={handleNextMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                  <div key={day} className="text-center text-[11px] font-bold text-slate-400">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 flex-grow">
                {calendarDays.map((item, idx) => {
                  const isSelected = isSameDay(item.date, currentDate);
                  const isToday = isSameDay(item.date, new Date("2026-06-29")); // Assuming system Today
                  
                  const hasPublished = publishedVersions.some(v => {
                    const pubDate = new Date(v.publishedAt as string | number | Date);
                    return isSameDay(item.date, pubDate);
                  });
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectDate(item.date)}
                      className={cn(
                        "relative h-9 rounded-lg text-[13px] font-semibold flex flex-col items-center justify-center transition-all",
                        !item.isCurrentMonth ? "text-slate-300" : "text-slate-700 hover:bg-slate-100",
                        isSelected && "bg-[#5A67D8] text-white hover:bg-[#5A67D8] shadow-sm shadow-[#5A67D8]/30",
                        isToday && !isSelected && "border border-[#5A67D8]/30 text-[#5A67D8]"
                      )}
                    >
                      <span>{item.date.getDate()}</span>
                      {hasPublished && (
                        <span className={cn(
                          "absolute bottom-1 w-1 h-1 rounded-full",
                          isSelected ? "bg-white" : "bg-[#5A67D8]"
                        )}></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Auxiliary navigation buttons for quick access without opening popover */}
      <div className="flex items-center bg-white p-1 border border-slate-200 rounded-xl shadow-sm">
        <button 
          onClick={() => onNavigate('PREV_DAY')}
          title="Previous Day"
          className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors hover:text-[#5A67D8]"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onNavigate('NEXT_DAY')}
          title="Next Day"
          className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors hover:text-[#5A67D8]"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
