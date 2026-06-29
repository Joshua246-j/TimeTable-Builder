import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ScheduleEntry } from '@/types/timetable';
import * as draftService from '@/services/timetableDraftService';

export interface TimetableDraftState {
  drafts: draftService.TimetableDraft[];
  activeDraftId: string | null;
  publishedDraftId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TimetableDraftState = {
  drafts: [],
  activeDraftId: null,
  publishedDraftId: null,
  isLoading: false,
  error: null,
};

// Async Thunks for backend integration
export const fetchDrafts = createAsyncThunk('drafts/fetchAll', async () => {
  const drafts = await draftService.getDrafts();
  const published = await draftService.getPublishedTimetable();
  return { drafts, publishedDraftId: published?.id || null };
});

export const saveActiveDraft = createAsyncThunk('drafts/save', async ({ id, allocations, name }: { id: string, allocations: Record<string, ScheduleEntry>, name?: string }) => {
  return await draftService.saveDraft(id, allocations, name);
});

export const createNewDraft = createAsyncThunk('drafts/create', async ({ name, description, allocations }: { name: string, description: string, allocations?: Record<string, ScheduleEntry> }) => {
  return await draftService.createDraft(name, description, allocations);
});

export const publishActiveDraft = createAsyncThunk('drafts/publish', async (id: string) => {
  await draftService.publishDraft(id);
  return id;
});

export const duplicateExistingDraft = createAsyncThunk('drafts/duplicate', async ({ id, newName }: { id: string, newName: string }) => {
  return await draftService.duplicateDraft(id, newName);
});

export const deleteExistingDraft = createAsyncThunk('drafts/delete', async (id: string) => {
  await draftService.deleteDraft(id);
  return id;
});

export const renameExistingDraft = createAsyncThunk('drafts/rename', async ({ id, newName }: { id: string, newName: string }) => {
  return await draftService.renameDraft(id, newName);
});


export const timetableDraftSlice = createSlice({
  name: 'timetableDrafts',
  initialState,
  reducers: {
    setActiveDraftId: (state, action: PayloadAction<string | null>) => {
      state.activeDraftId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchDrafts.pending, (state) => { state.isLoading = true; })
      .addCase(fetchDrafts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.drafts = action.payload.drafts;
        state.publishedDraftId = action.payload.publishedDraftId;
      })
      // Save
      .addCase(saveActiveDraft.fulfilled, (state, action) => {
        const index = state.drafts.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.drafts[index] = action.payload;
        }
      })
      // Create
      .addCase(createNewDraft.fulfilled, (state, action) => {
        state.drafts.push(action.payload);
        state.activeDraftId = action.payload.id;
      })
      // Publish
      .addCase(publishActiveDraft.fulfilled, (state, action) => {
        state.publishedDraftId = action.payload;
      })
      // Duplicate
      .addCase(duplicateExistingDraft.fulfilled, (state, action) => {
        state.drafts.push(action.payload);
        state.activeDraftId = action.payload.id;
      })
      // Delete
      .addCase(deleteExistingDraft.fulfilled, (state, action) => {
        state.drafts = state.drafts.filter(d => d.id !== action.payload);
        if (state.activeDraftId === action.payload) {
          state.activeDraftId = state.publishedDraftId || (state.drafts[0]?.id || null);
        }
      })
      // Rename
      .addCase(renameExistingDraft.fulfilled, (state, action) => {
        const index = state.drafts.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.drafts[index] = action.payload;
        }
      });
  }
});

export const { setActiveDraftId } = timetableDraftSlice.actions;
export default timetableDraftSlice.reducer;
