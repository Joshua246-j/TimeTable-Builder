"use client";

import React, { useState, useRef, useMemo } from "react";
import { format, parse } from "date-fns";
import { Plus, Minus, Clock } from "lucide-react";

interface CircularTimePickerProps {
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  onStartChange: (time: string) => void;
  onEndChange: (time: string) => void;
  onConfirm?: () => void;
  onDurationSync?: (durationMinutes: number) => void;
}

type ActiveTab = "start" | "end";
type Mode = "hours" | "minutes";

export function CircularTimePicker({
  startTime,
  endTime,
  onStartChange,
  onEndChange,
  onConfirm,
  onDurationSync,
}: CircularTimePickerProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("start");
  const [mode, setMode] = useState<Mode>("hours");
  const [isDragging, setIsDragging] = useState(false);
  const dialRef = useRef<HTMLDivElement>(null);

  const parseTimeLocal = (t: string) => {
    try {
      const match = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
      if (!match) return new Date();

      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const modifier = match[3]?.toUpperCase();

      if (modifier === "PM" && hours < 12) {
        hours += 12;
      } else if (modifier === "AM" && hours === 12) {
        hours = 0;
      }

      const d = new Date();
      d.setHours(hours, minutes, 0, 0);
      return d;
    } catch {
      return new Date();
    }
  };

  const activeDate = activeTab === "start" ? parseTimeLocal(startTime) : parseTimeLocal(endTime);
  const hours24 = activeDate.getHours();
  const minutes = activeDate.getMinutes();
  const isPM = hours24 >= 12;
  const hours12 = hours24 % 12 || 12;

  const handleAmPmToggle = (newIsPM: boolean) => {
    if (isPM === newIsPM) return;
    const newDate = new Date(activeDate);
    let newHours24 = hours12;
    if (newIsPM && hours12 < 12) newHours24 += 12;
    if (!newIsPM && hours12 === 12) newHours24 = 0;
    newDate.setHours(newHours24);
    const hh = hours12.toString().padStart(2, "0");
    const mm = newDate.getMinutes().toString().padStart(2, "0");
    const ampm = newIsPM ? "PM" : "AM";
    const formatted = `${hh}:${mm} ${ampm}`;
    
    if (activeTab === "start") {
      onStartChange(formatted);
    } else {
      onEndChange(formatted);
    }
  };

  const handlePointerEvent = (e: React.PointerEvent) => {
    if (!dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;

    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    const newDate = new Date(activeDate);

    if (mode === "hours") {
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

    const currentHours24 = newDate.getHours();
    const currentIsPM = currentHours24 >= 12;
    const currentHours12 = currentHours24 % 12 || 12;
    const hh = currentHours12.toString().padStart(2, "0");
    const mm = newDate.getMinutes().toString().padStart(2, "0");
    const ampm = currentIsPM ? "PM" : "AM";
    const formatted = `${hh}:${mm} ${ampm}`;
    if (activeTab === "start") {
      onStartChange(formatted);
    } else {
      onEndChange(formatted);
    }
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
    if (!isDragging) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);

    if (mode === "hours") {
      // auto switch to minutes
      setMode("minutes");
    } else if (mode === "minutes" && activeTab === "start") {
      // auto switch to end time
      setActiveTab("end");
      setMode("hours");
    }
  };

  const numbers = useMemo(() => {
    if (mode === "hours") {
      return Array.from({ length: 12 }, (_, i) => {
        const h = i === 0 ? 12 : i;
        return { value: h, label: h.toString() };
      });
    } else {
      return Array.from({ length: 12 }, (_, i) => {
        const m = i * 5;
        return { value: m, label: m.toString().padStart(2, "0") };
      });
    }
  }, [mode]);

  const handAngle = mode === "hours" ? hours12 * 30 : minutes * 6;

  const formatDisplay = (t: string) => {
    try {
      const match = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
      if (!match) return "--:--";
      return t; // It is already formatted perfectly as "hh:mm A" by our new global logic
    } catch {
      return "--:--";
    }
  };

  const durationMins = useMemo(() => {
    try {
      const start = parse(startTime, "hh:mm a", new Date());
      const end = parse(endTime, "hh:mm a", new Date());
      let diff = (end.getTime() - start.getTime()) / 60000;
      if (diff < 0) diff += 24 * 60;
      return diff;
    } catch {
      return 0;
    }
  }, [startTime, endTime]);

  const handleDurationChange = (newMins: number) => {
    if (newMins <= 0) return;
    try {
      const start = parse(startTime, "hh:mm a", new Date());
      const end = new Date(start.getTime() + newMins * 60000);
      const formattedEnd = format(end, "hh:mm a");
      onEndChange(formattedEnd);
      if (onDurationSync) {
        onDurationSync(newMins);
      }
    } catch {}
  };

  return (
    <div className="w-full max-w-[280px] mx-auto p-4 font-inter select-none">
      {/* Tab Switcher */}
      <div className="flex gap-2 mb-5">
        {(["start", "end"] as ActiveTab[]).map((tab) => {
          const time = tab === "start" ? startTime : endTime;
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setMode("hours");
              }}
              className={`flex-1 rounded-xl px-3 py-2.5 text-left transition-all border ${
                isActive
                  ? "bg-[#4F6BFF] border-[#4F6BFF] shadow-md shadow-[#4F6BFF]/20"
                  : "bg-slate-50 border-slate-200 hover:border-slate-300"
              }`}
            >
              <p className={`text-[9px] font-bold uppercase tracking-widest mb-0.5 ${isActive ? "text-white/70" : "text-slate-400"}`}>
                {tab === "start" ? "Start" : "End"}
              </p>
              <p className={`text-[15px] font-bold tracking-tight ${isActive ? "text-white" : "text-slate-700"}`}>
                {formatDisplay(time)}
              </p>
            </button>
          );
        })}
      </div>

      {/* Hours / Minutes toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-1 bg-slate-100/80 rounded-lg p-1 shadow-inner">
          {(["hours", "minutes"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all capitalize ${
                mode === m
                  ? "bg-white text-[#4F6BFF] shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* AM / PM */}
        <div className="flex items-center gap-1 bg-slate-100/80 rounded-lg p-1 shadow-inner text-[11px] font-bold">
          {[false, true].map((pm) => (
            <button
              key={pm ? "pm" : "am"}
              onClick={() => handleAmPmToggle(pm)}
              className={`px-3 py-1.5 rounded-md transition-all ${
                isPM === pm
                  ? "bg-white text-[#4F6BFF] shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {pm ? "PM" : "AM"}
            </button>
          ))}
        </div>
      </div>

      {/* Clock Dial */}
      <div
        ref={dialRef}
        className="relative w-[220px] h-[220px] mx-auto rounded-full bg-slate-50 border border-slate-100 touch-none cursor-pointer"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 -mt-1 -ml-1 rounded-full bg-[#4F6BFF] z-20" />

        {/* Hand */}
        <div
          className="absolute top-1/2 left-1/2 w-[2px] bg-[#4F6BFF] origin-bottom z-10 rounded-full transition-transform duration-100 ease-out"
          style={{
            height: "85px",
            marginTop: "-85px",
            marginLeft: "-1px",
            transform: `rotate(${handAngle}deg)`,
          }}
        >
          <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-[#4F6BFF] shadow-lg flex items-center justify-center">
             {/* The white dot was removed because it visually conflicted with the white text of the number */}
          </div>
        </div>

        {/* Numbers */}
        {numbers.map((num, i) => {
          const angle = i * 30;
          const rad = angle * (Math.PI / 180);
          const radius = 88;
          const x = radius * Math.sin(rad);
          const y = -radius * Math.cos(rad);
          const isSelected =
            mode === "hours" ? hours12 === num.value : minutes === num.value;

          return (
            <div
              key={num.value}
              className={`absolute top-1/2 left-1/2 w-8 h-8 -mt-4 -ml-4 rounded-full flex items-center justify-center text-[12px] font-semibold z-20 pointer-events-none transition-colors ${
                isSelected ? "text-white" : "text-slate-500"
              }`}
              style={{ transform: `translate(${x}px, ${y}px)` }}
            >
              {num.label}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className={`mt-6 flex items-center ${onConfirm ? 'justify-between' : 'justify-center'} border-t border-slate-100 pt-4`}>
        <div className="flex items-center gap-2">
           <div className="flex items-center gap-1.5 text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
               <Clock className="w-3.5 h-3.5" />
               <span className="text-[10px] font-bold uppercase tracking-widest">Dur</span>
           </div>
           
           <div className="flex items-center bg-white border border-slate-200 rounded-md shadow-sm">
               <button 
                 onClick={() => handleDurationChange(durationMins - 5)}
                 className="w-7 h-7 flex items-center justify-center rounded-l-md hover:bg-slate-50 text-slate-500 transition-all border-r border-slate-100"
               >
                 <Minus className="w-3 h-3" />
               </button>
               <input 
                 type="text"
                 value={durationMins}
                 onChange={(e) => {
                   const val = parseInt(e.target.value.replace(/\D/g, ''), 10);
                   if (!isNaN(val)) handleDurationChange(val);
                 }}
                 className="w-9 text-center text-[12px] font-bold bg-transparent outline-none text-slate-700"
               />
               <span className="text-[10px] font-bold text-slate-400 pr-1">m</span>
               <button 
                 onClick={() => handleDurationChange(durationMins + 5)}
                 className="w-7 h-7 flex items-center justify-center rounded-r-md hover:bg-slate-50 text-slate-500 transition-all border-l border-slate-100"
               >
                 <Plus className="w-3 h-3" />
               </button>
           </div>
        </div>
        {onConfirm && (
          <button
            onClick={onConfirm}
            className="px-5 py-2 text-[13px] font-bold text-white bg-[#4F6BFF] hover:bg-[#3D56E0] rounded-lg shadow-[0_4px_12px_rgba(79,107,255,0.25)] transition-all hover:shadow-md active:scale-95"
          >
            Apply
          </button>
        )}
      </div>
    </div>
  );
}