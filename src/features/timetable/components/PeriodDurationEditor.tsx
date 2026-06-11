"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { createAllocation } from "@/store/timetableSlice";
import { ScheduleEntry } from "@/types/timetable";
import { SelectedCellData } from "@/store/timetableSlice";

interface PeriodDurationEditorProps {
  startCell: SelectedCellData;
  onClose: () => void;
}

export default function PeriodDurationEditor({ startCell, onClose }: PeriodDurationEditorProps) {
  const dispatch = useDispatch();
  const [durationHours, setDurationHours] = useState(1);

  const handleSave = () => {
    const newGroup: ScheduleEntry = {
      id: crypto.randomUUID(),
      dayId: startCell.dayId,
      startTime: startCell.startTime,
      endTime: "TBD", // Normally calculated by Engine
      rowSpan: durationHours, // Simplified 1 hr = 1 rowSpan
      rowStart: startCell.rowIndex,
      subjectId: startCell.subjectId || "",
      isLocked: false,
      isEditable: true,
    };
    dispatch(createAllocation(newGroup));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-[320px] p-5 animate-in zoom-in-95">
        <h3 className="text-lg font-bold text-[#0D2463] mb-4">Set Period Duration</h3>
        
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Start Time</span>
            <span className="font-semibold text-slate-900">{startCell.startTime}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Duration (Periods)</span>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setDurationHours(Math.max(1, durationHours - 1))}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
              >
                -
              </button>
              <span className="font-bold text-base w-4 text-center">{durationHours}</span>
              <button 
                onClick={() => setDurationHours(Math.min(6, durationHours + 1))}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1 bg-[#0D2463] hover:bg-[#091A4A]" onClick={handleSave}>
            Apply Span
          </Button>
        </div>
      </div>
    </div>
  );
}
