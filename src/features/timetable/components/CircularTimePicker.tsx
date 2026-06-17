"use client";

import React, { useState, useRef, useMemo } from "react";
import { format, parse } from "date-fns";

interface CircularTimePickerProps {
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  onStartChange: (time: string) => void;
  onEndChange: (time: string) => void;
  onConfirm?: () => void;
}

type ActiveTab = "start" | "end";
type Mode = "hours" | "minutes";

export function CircularTimePicker({
  startTime,
  endTime,
  onStartChange,
  onEndChange,
  onConfirm,
}: CircularTimePickerProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("start");
  const [mode, setMode] = useState<Mode>("hours");
  const [isDragging, setIsDragging] = useState(false);
  const dialRef = useRef<HTMLDivElement>(null);

  const parseTime = (t: string) => {
    try {
      const d = parse(t, "HH:mm", new Date());
      return isNaN(d.getTime()) ? new Date() : d;
    } catch {
      return new Date();
    }
  };

  const activeDate = activeTab === "start" ? parseTime(startTime) : parseTime(endTime);
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
    const formatted = format(newDate, "HH:mm");
    activeTab === "start" ? onStartChange(formatted) : onEndChange(formatted);
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

    const formatted = format(newDate, "HH:mm");
    activeTab === "start" ? onStartChange(formatted) : onEndChange(formatted);
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
      const d = parse(t, "HH:mm", new Date());
      return isNaN(d.getTime()) ? "--:--" : format(d, "hh:mm a");
    } catch {
      return "--:--";
    }
  };

  return (
    <div className="w-[280px] p-4 font-inter select-none">
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
          {(["hours", "minutes"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all capitalize ${
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
        <div className="flex rounded-lg border border-slate-200 overflow-hidden text-[11px] font-bold">
          {[false, true].map((pm) => (
            <button
              key={pm ? "pm" : "am"}
              onClick={() => handleAmPmToggle(pm)}
              className={`px-2.5 py-1.5 transition-colors ${
                isPM === pm
                  ? "bg-[#4F6BFF] text-white"
                  : "bg-white text-slate-500 hover:bg-slate-50"
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
          <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-[#4F6BFF] shadow-md flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
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
      <div className="mt-4 flex justify-end">
        <button
          onClick={onConfirm}
          className="px-5 py-1.5 text-xs font-bold text-[#4F6BFF] bg-[#F0F4FF] hover:bg-[#E0E7FF] rounded-lg transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
}