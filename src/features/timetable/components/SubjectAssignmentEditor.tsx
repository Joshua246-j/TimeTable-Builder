"use client";

import { useState } from "react";
import {
  Building2,
  User,
  Clock,
  BookOpen,
  AlignLeft,
  Repeat
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SubjectCardData, ScheduleEntry } from "@/types/timetable";
import { formatTime, parseTime } from "@/lib/timeEngine";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface SubjectAssignmentEditorProps {
  subject: SubjectCardData;
  scheduleEntry?: ScheduleEntry; 
  onCancel: () => void;
  onSave: (updatedSubject: SubjectCardData, updatedTime?: { startTime: string; endTime: string }, swappedSubjectId?: string) => void;
}

export default function SubjectAssignmentEditor({
  subject,
  scheduleEntry,
  onCancel,
  onSave,
}: SubjectAssignmentEditorProps) {
  
  const subjectsRedux = useSelector((state: RootState) => state.subject.subjects);
  const allSubjects = Object.values(subjectsRedux);
  const facultyRedux = useSelector((state: RootState) => state.faculty.faculty);
  const allFaculty = Object.values(facultyRedux || {});
  const roomsRedux = useSelector((state: RootState) => state.room.rooms);
  const allRooms = Object.values(roomsRedux || {});

  const [isSwapping, setIsSwapping] = useState(false);
  const [swappedSubjectId, setSwappedSubjectId] = useState<string>(subject.id);

  // Subject Metadata
  const [subjectName, setSubjectName] = useState(subject.subjectName);
  const [code, setCode] = useState(subject.code || "");
  const [type, setType] = useState(subject.type || "THEORY");
  const [credits, setCredits] = useState(subject.credits || 4);
  const [section, setSection] = useState(subject.section || "");
  const [color] = useState(subject.color || "");
  const [notes, setNotes] = useState(subject.notes || "");
  
  // Class Metadata
  const [facultyName, setFacultyName] = useState(subject.facultyName);
  const [roomName, setRoomName] = useState(subject.roomName);

  // Time editing state
  const [timeState, setTimeState] = useState(() => {
    if (!scheduleEntry) return null;
    const startMins = parseTime(scheduleEntry.startTime);
    const endMins = parseTime(scheduleEntry.endTime);
    const to24h = (mins: number) => {
      const h = Math.floor(mins / 60).toString().padStart(2, '0');
      const m = (mins % 60).toString().padStart(2, '0');
      return `${h}:${m}`;
    };
    return {
      startTimeStr: to24h(startMins),
      endTimeStr: to24h(endMins)
    };
  });

  const handleSave = () => {
    const updatedSubj = {
      ...subject,
      subjectName,
      code,
      type,
      credits,
      section,
      color,
      notes,
      facultyName,
      roomName,
    };
    
    let timeUpdates;
    if (timeState) {
      const parse24h = (str: string) => {
        const [h, m] = str.split(':').map(Number);
        return (h * 60) + (m || 0);
      };
      timeUpdates = {
        startTime: formatTime(parse24h(timeState.startTimeStr)),
        endTime: formatTime(parse24h(timeState.endTimeStr))
      };
    }

    if (isSwapping && swappedSubjectId !== subject.id) {
      onSave(updatedSubj, timeUpdates, swappedSubjectId);
    } else {
      onSave(updatedSubj, timeUpdates);
    }
  };

  return (
    <div className="rounded-xl border-2 border-[#4F6BFF] bg-white p-5 shadow-[0_4px_20px_-4px_rgba(79,107,255,0.15)] font-inter flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h2 className="text-xl font-bold text-slate-800">Edit Class</h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">✕</button>
      </div>

      <div className="overflow-y-auto pr-2 pb-4 space-y-6 flex-1">
        
        {/* Swap Subject Selector */}
        {scheduleEntry && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500 flex items-center gap-2">
                <Repeat className="w-3.5 h-3.5" /> Change Subject
              </label>
              <input 
                type="checkbox" 
                checked={isSwapping} 
                onChange={(e) => setIsSwapping(e.target.checked)} 
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>
            {isSwapping && (
              <Select value={swappedSubjectId} onValueChange={setSwappedSubjectId}>
                <SelectTrigger className="h-10 bg-white border-slate-300">
                  <SelectValue placeholder="Select a subject..." />
                </SelectTrigger>
                <SelectContent>
                  {allSubjects.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.subjectName} ({s.code})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {/* Subject Metadata */}
        <div className={`space-y-4 ${isSwapping ? 'opacity-40 pointer-events-none' : ''}`}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Subject Name
              </label>
              <input
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Type</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-10 border-slate-200 bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="THEORY">Theory</SelectItem>
                  <SelectItem value="LAB">Lab</SelectItem>
                  <SelectItem value="TUTORIAL">Tutorial</SelectItem>
                  <SelectItem value="ELECTIVE">Elective</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Credits</label>
              <input
                type="number"
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Section</label>
              <input
                type="text"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                placeholder="e.g. CSE V A"
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Assignment Metadata */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Faculty
              </label>
              <Select value={facultyName} onValueChange={setFacultyName}>
                <SelectTrigger className="h-10 border-slate-200"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Unassigned">Unassigned</SelectItem>
                  {allFaculty.map(f => (
                    <SelectItem key={f.id} value={f.name}>{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Room
              </label>
              <Select value={roomName} onValueChange={setRoomName}>
                <SelectTrigger className="h-10 border-slate-200"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Unassigned">Unassigned</SelectItem>
                  {allRooms.map(r => (
                    <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Time Editing */}
          {timeState && (
            <div className="grid grid-cols-2 gap-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100 mt-2">
              <div className="col-span-2">
                 <h4 className="text-xs font-bold text-blue-800 flex items-center gap-1.5 uppercase tracking-wide"><Clock className="w-3.5 h-3.5" /> Schedule Time</h4>
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">Start Time</label>
                <input
                  type="time"
                  value={timeState.startTimeStr}
                  onChange={(e) => setTimeState(s => s ? { ...s, startTimeStr: e.target.value } : null)}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">End Time</label>
                <input
                  type="time"
                  value={timeState.endTimeStr}
                  onChange={(e) => setTimeState(s => s ? { ...s, endTimeStr: e.target.value } : null)}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Extra Options */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500 flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5" /> Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 min-h-[60px]"
              placeholder="Add any specific instructions for this class..."
            />
          </div>
        </div>

      </div>

      {/* Footer Actions */}
      <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-slate-100 shrink-0">
        <Button onClick={handleSave} className="h-11 w-full rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 text-sm">
          Save Changes
        </Button>
      </div>
    </div>
  );
}