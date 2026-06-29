import React from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { subjectService } from "@/services/subjectService";

export async function SubjectScheduleCard({ subjectId }: { subjectId?: string }) {
  const resolvedId = subjectId || "1";
  const details = await subjectService.getSubjectDetails(resolvedId);

  if (!details) return null;

  const { weeklySchedule } = details;

  return (
    <div className="bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-slate-200 p-5 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white border border-slate-200 text-indigo-600 shadow-sm">
          <Calendar className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-[14px] font-bold text-slate-900 tracking-tight">Weekly Schedule</h4>
          <p className="text-[12px] text-slate-500 mt-0.5">Recurring timetable sessions</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 flex-grow justify-center">
        {weeklySchedule.map((slot, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 border border-slate-200 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <div>
                <p className="text-[12px] font-semibold text-slate-900">{slot.day}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-0.5">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{slot.time}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] bg-white border border-slate-200 text-slate-600 font-semibold px-2 py-1 rounded-md shadow-sm">
              <MapPin className="w-3 h-3 text-indigo-500" />
              <span>{slot.room}</span>
            </div>
          </div>
        ))}
        {weeklySchedule.length === 0 && (
          <div className="text-xs text-slate-400 text-center py-6">No classes scheduled</div>
        )}
      </div>
      
      <div className="bg-amber-50 border border-amber-200/60 rounded-lg p-3 mt-5 flex items-start gap-2.5">
        <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h5 className="text-[12px] font-bold text-amber-800">Next Scheduled Class</h5>
          <p className="text-[11px] text-amber-700 font-medium mt-0.5">
            {weeklySchedule[0]?.day || "Wednesday"} at {weeklySchedule[0]?.time.split(" - ")[0] || "09:00 AM"}
          </p>
        </div>
      </div>
    </div>
  );
}
