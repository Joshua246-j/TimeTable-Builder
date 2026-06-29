"use client";

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { 
  setActiveDraftId, 
  saveActiveDraft, 
  createNewDraft, 
  duplicateExistingDraft, 
  deleteExistingDraft
} from '@/store/timetableDraftSlice';
import { setAllocations } from '@/store/timetableEngineSlice';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Save, Plus, Copy, Trash2, CheckCircle2, History } from 'lucide-react';
import { toast } from 'sonner';

interface DraftManagerToolbarProps {
  onPublishClick: () => void;
}

export default function DraftManagerToolbar({ }: DraftManagerToolbarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { drafts, activeDraftId, publishedDraftId } = useSelector((state: RootState) => state.timetableDrafts);
  const { allocations, isDirty } = useSelector((state: RootState) => state.timetableEngine);
  
  const activeDraft = drafts.find(d => d.id === activeDraftId);
  const isPublished = activeDraftId === publishedDraftId;

  const handleDraftSelect = (id: string) => {
    // Check for unsaved changes before switching? 
    // For now, auto-save if dirty, or just switch and lose changes. Real app might ask.
    // Let's just switch and load allocations.
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
      dispatch(setAllocations({})); // Clear grid
      toast.success("Created new draft");
    } catch {
      toast.error("Failed to create draft");
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

  const handleDuplicate = async () => {
    if (!activeDraftId || !activeDraft) return;
    try {
      // First save current state
      await dispatch(saveActiveDraft({ id: activeDraftId, allocations })).unwrap();
      // Then duplicate
      await dispatch(duplicateExistingDraft({ id: activeDraftId, newName: `${activeDraft.name} (Copy)` })).unwrap();
      toast.success("Draft duplicated");
    } catch {
      toast.error("Failed to duplicate draft");
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
        // The slice handles selecting another draft. We just need to load its allocations.
        // Handled in a useEffect down below.
        toast.success("Draft deleted");
      } catch {
        toast.error("Failed to delete draft");
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-3 px-6 bg-white border-b border-slate-200">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="flex flex-col relative">
          <span className="text-[10px] font-bold text-[#4F6BFF] tracking-wider absolute -top-4 left-1 uppercase">ACTIVE DRAFT</span>
          <Select value={activeDraftId || ''} onValueChange={handleDraftSelect}>
            <SelectTrigger className="w-[260px] h-9 bg-white border-2 border-slate-200 rounded-full shadow-sm font-semibold text-slate-800 text-[13px] hover:border-slate-300 transition-colors">
              <SelectValue placeholder="Select a draft..." />
            </SelectTrigger>
            <SelectContent>
              {drafts.map(draft => (
                <SelectItem key={draft.id} value={draft.id} className="font-medium">
                  {draft.name} {draft.id === publishedDraftId && ' (LIVE)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {activeDraft && (
          <div className="flex items-center gap-2">
            {isPublished && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-[#E8F8F0] text-[#10B981] rounded-full text-[11px] font-bold border border-[#10B981]/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                LIVE
              </span>
            )}
            {isDirty && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-[#FFFBEB] text-[#F59E0B] rounded-full text-[11px] font-bold border border-[#F59E0B]/30">
                <History className="w-3.5 h-3.5" />
                UNSAVED
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
        <div className="flex items-center bg-slate-50 border border-slate-100 p-1 rounded-xl shadow-inner gap-1">
          <button className="h-7 w-7 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg transition-all" onClick={handleCreateNew} title="New Draft">
            <Plus className="w-4 h-4" />
          </button>
          <button className="h-7 w-7 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg transition-all" onClick={handleDuplicate} title="Duplicate Draft" disabled={!activeDraftId}>
            <Copy className="w-4 h-4" />
          </button>
          <button className="h-7 w-7 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-white rounded-lg transition-all" onClick={handleDelete} title="Delete Draft" disabled={!activeDraftId || isPublished}>
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <Button 
          variant="outline" 
          className="h-9 rounded-full px-5 font-bold text-slate-700 bg-white border-2 border-slate-200 hover:bg-slate-50 shadow-sm"
          onClick={handleSave}
          disabled={!activeDraftId || !isDirty}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Draft
        </Button>
      </div>
    </div>
  );
}
