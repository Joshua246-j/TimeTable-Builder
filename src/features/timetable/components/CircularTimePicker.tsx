import React, { useState, useRef, useMemo } from 'react';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface CircularTimePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  className?: string;
}

type Mode = 'hours' | 'minutes';

export function CircularTimePicker({ value, onChange, className = '' }: CircularTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('hours');
  const [isDragging, setIsDragging] = useState(false);
  const dialRef = useRef<HTMLDivElement>(null);

  // Defaults if null and ensure valid date
  const displayDate = value && !isNaN(value.getTime()) ? value : new Date();
  const hours24 = displayDate.getHours();
  const minutes = displayDate.getMinutes();
  
  const isPM = hours24 >= 12;
  const hours12 = hours24 % 12 || 12;

  // Toggle AM/PM
  const handleAmPmToggle = (newIsPM: boolean) => {
    if (isPM === newIsPM) return;
    const newDate = new Date(displayDate);
    let newHours24 = hours12;
    if (newIsPM && hours12 < 12) newHours24 += 12;
    if (!newIsPM && hours12 === 12) newHours24 = 0;
    newDate.setHours(newHours24);
    onChange(newDate);
  };

  const handlePointerEvent = (e: React.PointerEvent) => {
    if (!dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    
    // Calculate angle in degrees (0 is top, clockwise)
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    const newDate = new Date(displayDate);

    if (mode === 'hours') {
      const selectedHour = Math.round(angle / 30) || 12;
      let newHours24 = selectedHour;
      if (isPM && selectedHour < 12) newHours24 += 12;
      if (!isPM && selectedHour === 12) newHours24 = 0;
      newDate.setHours(newHours24);
    } else {
      let selectedMinute = Math.round(angle / 6);
      if (selectedMinute === 60) selectedMinute = 0;
      newDate.setMinutes(selectedMinute);
    }

    onChange(newDate);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    handlePointerEvent(e);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    handlePointerEvent(e);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      setIsDragging(false);
      if (mode === 'hours') {
        // Auto switch to minutes after selecting hour
        setMode('minutes');
      }
    }
  };

  // Calculate rendering logic
  const numbers = useMemo(() => {
    if (mode === 'hours') {
      return Array.from({ length: 12 }, (_, i) => {
        const h = i === 0 ? 12 : i;
        return { value: h, label: h.toString() };
      });
    } else {
      return Array.from({ length: 12 }, (_, i) => {
        const m = i * 5;
        return { value: m, label: m.toString().padStart(2, '0') };
      });
    }
  }, [mode]);

  const handAngle = mode === 'hours' ? (hours12 * 30) : (minutes * 6);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`flex items-center justify-between w-full h-[32px] px-2 text-[11px] font-semibold bg-white border rounded-md transition-all outline-none focus:border-[#4F6BFF] focus:ring-1 focus:ring-[#4F6BFF] ${isOpen ? 'border-[#4F6BFF] ring-1 ring-[#4F6BFF]' : 'border-slate-200 hover:border-slate-300'} ${className}`}
        >
          <span className="text-slate-900 tracking-wide">
            {value && !isNaN(value.getTime()) ? format(value, 'hh:mm a') : 'Select Time'}
          </span>
          <Clock className="w-3.5 h-3.5 text-[#4F6BFF]" />
        </button>
      </PopoverTrigger>

      <PopoverContent 
        side="bottom" 
        align="start" 
        className="w-[260px] p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 bg-white z-[100]"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1 text-3xl font-light text-slate-800 tracking-tight">
            <button 
              onClick={() => setMode('hours')}
              className={`px-2 py-1 rounded-lg transition-colors ${mode === 'hours' ? 'bg-[#F0F4FF] text-[#4F6BFF] font-medium' : 'hover:bg-slate-50 opacity-60'}`}
            >
              {hours12.toString().padStart(2, '0')}
            </button>
            <span className="opacity-50 pb-1">:</span>
            <button 
              onClick={() => setMode('minutes')}
              className={`px-2 py-1 rounded-lg transition-colors ${mode === 'minutes' ? 'bg-[#F0F4FF] text-[#4F6BFF] font-medium' : 'hover:bg-slate-50 opacity-60'}`}
            >
              {minutes.toString().padStart(2, '0')}
            </button>
          </div>
          
          <div className="flex flex-col rounded-lg border border-slate-200 overflow-hidden text-[11px] font-bold">
            <button 
              onClick={() => handleAmPmToggle(false)}
              className={`px-2.5 py-1.5 transition-colors ${!isPM ? 'bg-[#4F6BFF] text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
            >
              AM
            </button>
            <div className="h-px bg-slate-200" />
            <button 
              onClick={() => handleAmPmToggle(true)}
              className={`px-2.5 py-1.5 transition-colors ${isPM ? 'bg-[#4F6BFF] text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
            >
              PM
            </button>
          </div>
        </div>

        {/* Clock Dial */}
        <div 
          className="relative w-[210px] h-[210px] mx-auto rounded-full bg-slate-50 touch-none select-none cursor-pointer"
          ref={dialRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* Center Dot */}
          <div className="absolute top-1/2 left-1/2 w-2 h-2 -mt-1 -ml-1 rounded-full bg-[#4F6BFF] z-20" />
          
          {/* Clock Hand */}
          <div 
            className="absolute top-1/2 left-1/2 w-[2px] bg-[#4F6BFF] origin-bottom z-10 rounded-full transition-all duration-100 ease-out"
            style={{
              height: '80px',
              marginTop: '-80px',
              marginLeft: '-1px',
              transform: `rotate(${handAngle}deg)`
            }}
          >
            {/* Hand Circle */}
            <div className="absolute -top-3.5 -left-[15px] w-8 h-8 rounded-full bg-[#4F6BFF] opacity-90 shadow-sm flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
          </div>

          {/* Numbers */}
          {numbers.map((num, i) => {
            const angle = i * 30;
            const rad = angle * (Math.PI / 180);
            const radius = 85;
            const x = radius * Math.sin(rad);
            const y = -radius * Math.cos(rad);
            
            const isSelected = mode === 'hours' ? hours12 === num.value : minutes === num.value;

            return (
              <div
                key={num.value}
                className={`absolute top-1/2 left-1/2 w-8 h-8 -mt-4 -ml-4 rounded-full flex items-center justify-center text-[13px] font-medium z-20 transition-colors pointer-events-none ${isSelected ? 'text-white' : 'text-slate-600'}`}
                style={{ transform: `translate(${x}px, ${y}px)` }}
              >
                {num.label}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex justify-end">
            <button 
              onClick={() => setIsOpen(false)}
              className="px-4 py-1.5 text-xs font-bold text-[#4F6BFF] bg-[#F0F4FF] hover:bg-[#E0E7FF] rounded-lg transition-colors"
            >
              OK
            </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

