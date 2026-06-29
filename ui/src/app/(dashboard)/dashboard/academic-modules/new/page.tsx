"use client";

import React, { useState } from "react";
import { Save, Plus, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { addSubject } from "@/store/subjectSlice";

export default function NewSubjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    subjectName: "",
    code: "",
    facultyName: "",
    roomName: "",
    credits: 3,
    type: "THEORY" as "THEORY" | "LAB" | "TUTORIAL" | "ELECTIVE",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subjectName || !formData.code) {
      toast.error("Subject Name and Code are required!");
      return;
    }

    const newId = `subj-${Date.now()}`;
    dispatch(addSubject({
      id: newId,
      ...formData,
      isEditable: true
    }));
    
    toast.success("New Subject created successfully!");

    const redirectUrl = searchParams.get("from");
    if (redirectUrl) {
      router.push(redirectUrl);
    } else {
      router.push("/dashboard/timetable/");
    }
  };

  return (
    <div className="h-full w-full overflow-x-hidden overflow-y-auto bg-[#F7F8FC] flex flex-col p-8 font-inter">
      <div className="w-full max-w-4xl mx-auto">
        {/* Back Link */}
        <div className="mb-6 flex items-center">
          <button 
            type="button"
            onClick={() => {
              const redirectUrl = searchParams.get("from");
              if (redirectUrl) router.push(redirectUrl);
              else router.push("/dashboard/timetable/");
            }} 
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to previous view
          </button>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-100 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5A67D8]/10 text-[#5A67D8]">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Create New Subject</h2>
              <p className="text-slate-500 text-sm mt-1">Configure the master metadata for a new academic subject.</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subject Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Data Structures"
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
                  placeholder="e.g. CS301"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#5A67D8] text-slate-800 text-[14px] font-semibold"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Default Faculty Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Dr. Anil Kumar"
                  value={formData.facultyName}
                  onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#5A67D8] text-slate-800 text-[14px] font-semibold"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Default Classroom / Lab</label>
                <input 
                  type="text" 
                  placeholder="e.g. A-301"
                  value={formData.roomName}
                  onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#5A67D8] text-slate-800 text-[14px] font-semibold"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Credits</label>
                <select 
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#5A67D8] text-slate-800 text-[14px] font-semibold bg-white"
                >
                  <option value={1}>1 Credit</option>
                  <option value={2}>2 Credits</option>
                  <option value={3}>3 Credits</option>
                  <option value={4}>4 Credits</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subject Type</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as "THEORY" | "LAB" | "TUTORIAL" | "ELECTIVE" })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#5A67D8] text-slate-800 text-[14px] font-semibold bg-white"
                >
                  <option value="THEORY">Theory</option>
                  <option value="LAB">Lab</option>
                  <option value="TUTORIAL">Tutorial</option>
                  <option value="ELECTIVE">Elective</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-4">
              <button 
                type="button"
                onClick={() => {
                  const redirectUrl = searchParams.get("from");
                  if (redirectUrl) router.push(redirectUrl);
                  else router.push("/dashboard/timetable/");
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-[14px] font-bold text-slate-500 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5A67D8] text-[14px] font-bold text-white shadow-sm hover:bg-[#5A67D8]/90 transition-colors"
              >
                <Save className="h-4 w-4" />
                Save & Register Subject
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
