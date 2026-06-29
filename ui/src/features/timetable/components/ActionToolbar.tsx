"use client";

import {
  Pencil,
  TriangleAlert,
  LayoutGrid,
  Plus,
  Trash2,
  CheckCircle2,
  History,
  Save
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { runValidation, undoAction, redoAction } from "@/store/syntheticActions";
import { 
  setActiveDraftId, 
  saveActiveDraft, 
  createNewDraft, 
  deleteExistingDraft 
} from "@/store/timetableDraftSlice";
import { setAllocations } from "@/store/timetableEngineSlice";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RootState, AppDispatch } from "@/store/store";
import { toast } from "sonner";

interface ActionToolbarProps {
  onOpenConflicts?: () => void;
  onPublish?: () => void;
  onCancelEdit?: () => void;
}

export default function ActionToolbar({
  onOpenConflicts,
  onPublish,
  onCancelEdit,
}: ActionToolbarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { conflicts } = useSelector((state: RootState) => state.validation);
  const { allocations, isDirty } = useSelector((state: RootState) => state.timetableEngine);
  const { drafts, activeDraftId, publishedDraftId } = useSelector((state: RootState) => state.timetableDrafts);
  
  const hasAllocations = Object.keys(allocations).length > 0;
  const hasConflicts = conflicts.length > 0;
  const canPublish = hasAllocations && !hasConflicts && isDirty;

  const isPublished = activeDraftId === publishedDraftId;

  const handleDraftSelect = (id: string) => {
    const draft = drafts.find(d => d.id === id);
    if (draft) {
      dispatch(setActiveDraftId(id));
      dispatch(setAllocations(draft.allocations));
      toast.info(`Loaded draft: ${draft.name}`);
    }
  };

  const handleCreateNew = async () => {
    try {
      await dispatch(createNewDraft({ 
        name: `New Draft ${drafts.length + 1}`, 
        description: '' 
      })).unwrap();
      dispatch(setAllocations({}));
      toast.success("Created new draft");
    } catch {
      toast.error("Failed to create draft");
    }
  };

  const handleDelete = async () => {
    if (!activeDraftId) return;
    if (activeDraftId === publishedDraftId) {
      toast.error("Cannot delete the published draft!");
      return;
    }
    if (confirm("Are you sure you want to delete this draft?")) {
      try {
        await dispatch(deleteExistingDraft(activeDraftId)).unwrap();
        toast.success("Draft deleted");
      } catch {
        toast.error("Failed to delete draft");
      }
    }
  };

  const handleSave = async () => {
    if (!activeDraftId) return;
    try {
      await dispatch(saveActiveDraft({ id: activeDraftId, allocations })).unwrap();
      toast.success("Draft saved successfully");
    } catch {
      toast.error("Failed to save draft");
    }
  };

  return (
    <div className="flex w-full flex-col gap-5 py-4">
      {/* Top Row: Actions */}
      <div className="flex w-full flex-wrap items-center justify-between gap-4">
        
        {/* Left Actions */}
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          
          {/* Auto Allocate */}
          <button className="flex shrink-0 items-center gap-3 rounded-[16px] border border-slate-200 bg-white px-4 py-3 text-left transition-all hover:border-[#4F6BFF] hover:bg-[#F8FAFF] min-w-[170px] shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0F4FF]">
              <Pencil className="h-5 w-5 text-[#4F6BFF]" />
            </div>
            <div className="whitespace-nowrap">
              <h3 className="text-[13px] font-extrabold text-[#0D2463]">Auto Allocate</h3>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5">Smart resource mapping</p>
            </div>
          </button>

          {/* Detect Conflicts */}
          <button 
            onClick={() => {
              dispatch(runValidation());
              if (onOpenConflicts) onOpenConflicts();
            }}
            className={`flex shrink-0 items-center gap-3 rounded-[16px] border ${hasConflicts ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'} px-4 py-3 text-left transition-all hover:border-red-300 hover:bg-red-50 min-w-[170px] shadow-sm`}
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${hasConflicts ? 'bg-red-100 text-red-600' : 'bg-slate-50 text-slate-400'}`}>
              <TriangleAlert className="h-5 w-5" />
            </div>
            <div className="whitespace-nowrap">
              <h3 className={`text-[13px] font-extrabold ${hasConflicts ? 'text-red-700' : 'text-[#0D2463]'}`}>Detect Conflicts</h3>
              <p className={`text-[11px] font-medium ${hasConflicts ? 'text-red-500' : 'text-slate-500'} mt-0.5`}>
                {hasConflicts ? `${conflicts.length} Conflicts Detected` : 'Verify constraints'}
              </p>
            </div>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Undo / Redo */}
          <div className="flex items-center bg-white border-2 border-slate-200 rounded-full h-10 px-1 shadow-sm">
            <button
              onClick={() => dispatch(undoAction())}
              className="flex items-center justify-center w-8 h-8 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all"
              title="Undo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
            </button>
            <div className="w-[1px] h-4 bg-slate-200 mx-1"></div>
            <button
              onClick={() => dispatch(redoAction())}
              className="flex items-center justify-center w-8 h-8 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all"
              title="Redo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>
            </button>
          </div>
          
          {/* Cancel */}
          {onCancelEdit && (
             <Button variant="outline" className="h-10 rounded-full px-5 text-[13px] font-bold text-slate-600 border-2 border-slate-200 hover:bg-slate-50 shadow-sm" onClick={onCancelEdit}>
               Cancel
             </Button>
          )}

          {/* Publish */}
          <Button 
            className={`h-10 rounded-full px-6 text-[13px] font-bold text-white transition-all ${
              canPublish 
                ? "bg-[#4F6BFF] hover:bg-[#435CE5] shadow-md shadow-[#4F6BFF]/20" 
                : "bg-slate-300 cursor-not-allowed text-slate-500 opacity-70"
            }`}
            onClick={canPublish ? onPublish : undefined}
            disabled={!canPublish}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            Publish Timetable
          </Button>
        </div>
      </div>

      {/* Bottom Row: Context & Drafts */}
      <div className="flex w-full flex-wrap items-center justify-between gap-4 pt-2">
        
        {/* Left: Selected Unit */}
        <div className="flex items-center shrink-0">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm whitespace-nowrap">
             <LayoutGrid className="h-4 w-4 shrink-0 text-slate-400" />
             <span className="text-[11px] font-bold text-indigo-400 tracking-wider">SELECTED UNIT</span>
             <select className="bg-transparent text-[13px] font-extrabold text-slate-700 outline-none cursor-pointer max-w-[140px] truncate">
               <option>Section CSE V A</option>
               <option>Section CSE V B</option>
             </select>
          </div>
        </div>

        {/* Right: Draft Management */}
        <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-3 shrink-0">
          
          {/* Draft Selection Group */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline-block whitespace-nowrap">DRAFT:</span>
            
            <Select value={activeDraftId || ''} onValueChange={handleDraftSelect}>
              <SelectTrigger className="w-[170px] md:w-[190px] shrink-0 h-9 bg-white border-slate-200 rounded-xl shadow-sm font-bold text-slate-700 text-[13px] focus:ring-0 focus:ring-offset-0 focus:border-slate-300">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {drafts.map(draft => (
                  <SelectItem key={draft.id} value={draft.id} className="font-medium text-[13px]">
                    {draft.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Add / Delete Draft Icons */}
            <div className="flex items-center bg-white p-1 rounded-xl gap-1 shadow-sm border border-slate-200 shrink-0">
               <button title="New Draft" onClick={handleCreateNew} className="p-1 h-7 w-7 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors"><Plus size={15}/></button>
               <button title="Delete Draft" onClick={handleDelete} disabled={!activeDraftId || isPublished} className="p-1 h-7 w-7 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"><Trash2 size={15}/></button>
            </div>
          </div>

          <div className="w-[1px] h-6 bg-slate-200 hidden lg:block shrink-0"></div>

          {/* Badges Group */}
          <div className="flex items-center gap-2 shrink-0">
            {isPublished && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-extrabold border border-emerald-200 uppercase tracking-wide whitespace-nowrap">
                <CheckCircle2 size={12} strokeWidth={3} /> LIVE
              </span>
            )}
            {isDirty && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-extrabold border border-amber-200 uppercase tracking-wide whitespace-nowrap">
                <History size={12} strokeWidth={3} /> UNSAVED
              </span>
            )}
          </div>

          <div className="w-[1px] h-6 bg-slate-200 hidden lg:block shrink-0"></div>

          {/* Save Draft */}
          <Button variant="outline" className="h-9 px-4 shrink-0 text-[13px] rounded-xl font-bold text-slate-700 bg-white border-slate-200 hover:bg-slate-50 shadow-sm whitespace-nowrap" onClick={handleSave} disabled={!activeDraftId || !isDirty}>
            <Save size={15} className="mr-2 text-slate-400" /> Save Draft
          </Button>

        </div>
      </div>
    </div>
  );
}