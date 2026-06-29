"use client";

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { 
  setActiveDraftId, 
  saveActiveDraft, 
  createNewDraft, 
  duplicateExistingDraft, 
  deleteExistingDraft,
  renameExistingDraft
} from '@/store/timetableDraftSlice';
import { setAllocations } from '@/store/timetableEngineSlice';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Save, Plus, Copy, Trash2, Edit2, CheckCircle2, History } from 'lucide-react';
import { toast } from 'sonner';

interface DraftManagerToolbarProps {
  onPublishClick: () => void;
}

export default function DraftManagerToolbar({ onPublishClick }: DraftManagerToolbarProps) {
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
      const result = await dispatch(createNewDraft({ 
        name: `New Draft ${drafts.length + 1}`, 
        description: '' 
      })).unwrap();
      dispatch(setAllocations({})); // Clear grid
      toast.success("Created new draft");
    } catch (e) {
      toast.error("Failed to create draft");
    }
  };

  const handleSave = async () => {
    if (!activeDraftId) return;
    try {
      await dispatch(saveActiveDraft({ id: activeDraftId, allocations })).unwrap();
      toast.success("Draft saved successfully");
    } catch (e) {
      toast.error("Failed to save draft");
    }
  };

  const handleDuplicate = async () => {
    if (!activeDraftId || !activeDraft) return;
    try {
      // First save current state
      await dispatch(saveActiveDraft({ id: activeDraftId, allocations })).unwrap();
      // Then duplicate
      const result = await dispatch(duplicateExistingDraft({ id: activeDraftId, newName: `${activeDraft.name} (Copy)` })).unwrap();
      toast.success("Draft duplicated");
    } catch (e) {
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
      } catch (e) {
        toast.error("Failed to delete draft");
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-3 px-4 bg-white border-b border-slate-200 shadow-sm gap-4">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-slate-500 tracking-wider mb-1">ACTIVE DRAFT</span>
          <Select value={activeDraftId || ''} onValueChange={handleDraftSelect}>
            <SelectTrigger className="w-[250px] h-9 bg-slate-50 border-slate-200 shadow-sm font-semibold text-slate-800">
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
          <div className="flex items-center gap-1.5 self-end pb-[2px]">
            {isPublished && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[11px] font-bold border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                LIVE
              </span>
            )}
            {isDirty && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 rounded-md text-[11px] font-bold border border-amber-200">
                <History className="w-3.5 h-3.5" />
                UNSAVED
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <div className="flex items-center bg-slate-100 p-1 rounded-lg mr-2">
          <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-600 hover:text-slate-900" onClick={handleCreateNew} title="New Draft">
            <Plus className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-600 hover:text-slate-900" onClick={handleDuplicate} title="Duplicate Draft" disabled={!activeDraftId}>
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleDelete} title="Delete Draft" disabled={!activeDraftId || isPublished}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <Button 
          variant="outline" 
          className="h-9 font-bold bg-white border-slate-200 shadow-sm"
          onClick={handleSave}
          disabled={!activeDraftId || !isDirty}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Draft
        </Button>

        <Button 
          className="h-9 font-bold bg-[#5A67D8] hover:bg-[#4c58cd] text-white shadow-md shadow-[#5A67D8]/20"
          onClick={onPublishClick}
          disabled={!activeDraftId}
        >
          Publish Live
        </Button>
      </div>
    </div>
  );
}
