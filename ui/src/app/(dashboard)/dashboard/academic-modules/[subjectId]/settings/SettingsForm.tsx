"use client";

import React, { useState } from "react";
import { AcademicModuleShell } from "@/features/dashboard/components/AcademicModuleShell";
import { Save, Lock, RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { updateSubject } from "@/store/subjectSlice";
import type { SubjectCardData } from "@/types/timetable";

interface SettingsFormProps {
  subjectId: string;
  initialSubject: SubjectCardData;
}

export function SettingsForm({ subjectId, initialSubject }: SettingsFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    subjectName: initialSubject.subjectName,
    code: initialSubject.code || `CS30${subjectId}`,
    facultyName: initialSubject.facultyName || "Dr. Anil Kumar",
    roomName: initialSubject.roomName || "A-301",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateSubject({
      id: subjectId,
      ...formData,
      type: initialSubject.type || "THEORY"
    }));
    toast.success("Subject details updated successfully!");

    const redirectUrl = searchParams.get("from");
    if (redirectUrl) {
      router.push(redirectUrl);
    } else {
      router.push(`/dashboard/academic-modules/${subjectId}/`);
    }
  };

  return (
    <AcademicModuleShell activeTab="settings" subjectId={subjectId}>
      <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-100 p-8 shadow-sm max-w-4xl mx-auto mt-2">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{formData.subjectName} Settings</h2>
            <p className="text-slate-500 text-sm mt-1">Configure module options and database synchronization.</p>
          </div>
          <span className="inline-block px-3 py-1 text-xs font-bold text-blue-600 bg-blue-50 rounded-full">
            {formData.code}
          </span>
        </div>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subject Name</label>
              <input 
                type="text" 
                value={formData.subjectName}
                onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#5A67D8] text-slate-800 text-[14px] font-semibold"
                required
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subject Code</label>
              <input 
                type="text" 
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#5A67D8] text-slate-800 text-[14px] font-semibold"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Faculty Name</label>
              <input 
                type="text" 
                value={formData.facultyName}
                onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#5A67D8] text-slate-800 text-[14px] font-semibold"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Room</label>
              <input 
                type="text" 
                value={formData.roomName}
                onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#5A67D8] text-slate-800 text-[14px] font-semibold"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 mt-4">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-slate-400" />
              <div>
                <h4 className="text-[14px] font-bold text-slate-700">Lock Allocation</h4>
                <p className="text-xs text-slate-400 mt-0.5">Prevent other faculty from editing this subject allocation in the builder.</p>
              </div>
            </div>
            <input type="checkbox" className="h-4 w-4 accent-[#5A67D8]" defaultChecked />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button 
              type="button"
              onClick={() => setFormData({
                subjectName: initialSubject.subjectName,
                code: initialSubject.code || `CS30${subjectId}`,
                facultyName: initialSubject.facultyName || "Dr. Anil Kumar",
                roomName: initialSubject.roomName || "A-301",
              })}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-[14px] font-bold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Reset Changes
            </button>
            <button 
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5A67D8] text-[14px] font-bold text-white shadow-sm hover:bg-[#5A67D8]/90 transition-colors"
            >
              <Save className="h-4 w-4" />
              Save Configuration
            </button>
          </div>
        </div>
      </form>
    </AcademicModuleShell>
  );
}
