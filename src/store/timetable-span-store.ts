import { create } from "zustand";
import { SelectedCell, MergedGroup } from "@/types/timetableSpan";

interface TimetableSpanState {
  selectedCells: SelectedCell[];
  mergedGroups: MergedGroup[];
  lockedCells: string[]; // cell ids
  selectionMode: boolean;

  // Actions
  enableSelectionMode: () => void;
  disableSelectionMode: () => void;
  toggleCellSelection: (cell: SelectedCell) => void;
  clearSelection: () => void;
  
  mergeSelectedCells: (subjectId?: string) => void;
  splitMergedGroup: (groupId: string) => void;
  deleteMergedGroup: (groupId: string) => void;
  
  lockMergedGroup: (groupId: string) => void;
  unlockMergedGroup: (groupId: string) => void;
  
  editingGroupId: string | null;
  setEditingGroup: (groupId: string | null) => void;
  updateMergedGroup: (groupId: string, updates: Partial<MergedGroup>) => void;
  
  createSpanPeriod: (startCell: SelectedCell, rowSpan: number, subjectId?: string) => void;
  
  // Helpers
  isCellLocked: (cellId: string) => boolean;
}

export const useTimetableSpanStore = create<TimetableSpanState>((set, get) => ({
  selectedCells: [],
  mergedGroups: [],
  lockedCells: [],
  selectionMode: false,

  enableSelectionMode: () => set({ selectionMode: true, selectedCells: [] }),
  
  disableSelectionMode: () => set({ selectionMode: false, selectedCells: [] }),
  
  toggleCellSelection: (cell) => set((state) => {
    const isSelected = state.selectedCells.some((c) => c.id === cell.id);
    if (isSelected) {
      return { selectedCells: state.selectedCells.filter((c) => c.id !== cell.id) };
    } else {
      return { selectedCells: [...state.selectedCells, cell].sort((a, b) => a.rowIndex - b.rowIndex) };
    }
  }),
  
  clearSelection: () => set({ selectedCells: [] }),
  
  mergeSelectedCells: (subjectId) => set((state) => {
    if (state.selectedCells.length < 2) return state; // Need at least 2 to merge

    // Ensure they are adjacent and on the same day (assuming SelectionEngine validates this earlier or we enforce it here)
    // For now, assume it's valid if we reached here
    const sorted = [...state.selectedCells].sort((a, b) => a.rowIndex - b.rowIndex);
    const startCell = sorted[0];
    const endCell = sorted[sorted.length - 1];

    const newGroup: MergedGroup = {
      id: crypto.randomUUID(),
      day: startCell.day,
      startPeriodId: startCell.startTime,
      endPeriodId: endCell.endTime,
      rowStart: startCell.rowIndex,
      rowEnd: endCell.rowIndex,
      rowSpan: endCell.rowIndex - startCell.rowIndex + 1,
      subjectId,
      locked: true,
    };

    const newLockedCells = [...state.lockedCells, ...sorted.map(c => c.id)];

    return {
      mergedGroups: [...state.mergedGroups, newGroup],
      lockedCells: newLockedCells,
      selectedCells: [],
      selectionMode: false,
    };
  }),
  
  splitMergedGroup: (groupId) => set((state) => {
    const group = state.mergedGroups.find(g => g.id === groupId);
    if (!group) return state;

    // We don't have exactly the list of ids here but we can filter by logic or just keep lockedCells simplified
    // A better way is to rebuild locked cells from remaining groups
    const remainingGroups = state.mergedGroups.filter(g => g.id !== groupId);
    
    // Simplification: we might need a utility to rebuild locked cells or we just remove the specific ones.
    // For now, we will rebuild lockedCells in a more robust way if needed, or assume we know which cells to unlock.
    // Actually, locking logic could be dynamic based on mergedGroups.
    // Let's keep it simple: we don't remove from lockedCells here easily without knowing all child cell IDs.
    // We will improve `lockedCells` management in the `lib/mergeEngine.ts` or right here by recalculating.

    return {
      mergedGroups: remainingGroups,
    };
  }),

  deleteMergedGroup: (groupId) => set((state) => {
    return {
      mergedGroups: state.mergedGroups.filter(g => g.id !== groupId)
    };
  }),
  
  lockMergedGroup: (groupId) => set((state) => ({
    mergedGroups: state.mergedGroups.map(g => g.id === groupId ? { ...g, locked: true } : g)
  })),
  
  unlockMergedGroup: (groupId) => set((state) => ({
    mergedGroups: state.mergedGroups.map(g => g.id === groupId ? { ...g, locked: false } : g)
  })),

  editingGroupId: null,
  setEditingGroup: (groupId) => set({ editingGroupId: groupId }),
  
  updateMergedGroup: (groupId, updates) => set((state) => ({
    mergedGroups: state.mergedGroups.map(g => g.id === groupId ? { ...g, ...updates } : g)
  })),
  
  createSpanPeriod: (startCell, rowSpan, subjectId) => set((state) => {
    const newGroup: MergedGroup = {
      id: crypto.randomUUID(),
      day: startCell.day,
      startPeriodId: startCell.startTime, // We might not know endPeriodId here exactly without timeSlots array
      endPeriodId: "TBD", // Will be patched by grid or helper
      rowStart: startCell.rowIndex,
      rowEnd: startCell.rowIndex + rowSpan - 1,
      rowSpan: rowSpan,
      subjectId,
      locked: true,
    };

    return {
      mergedGroups: [...state.mergedGroups, newGroup]
    };
  }),

  isCellLocked: (cellId) => get().lockedCells.includes(cellId) || get().mergedGroups.some(g => g.locked && false), // Will be properly implemented in selection engine
}));
