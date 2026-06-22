import { SelectedCell } from "@/types/timetableSpan";
import { isAdjacentSlot, compareTimeSlots } from "./timeEngine";

export const selectionEngine = {
  isAdjacent: (cells: SelectedCell[]): boolean => {
    if (cells.length <= 1) return true;
    
    // Check if they are all on the same day
    const day = cells[0].day;
    if (!cells.every(c => c.day === day)) return false;

    // Sort by startTime
    const sorted = [...cells].sort((a, b) => {
      if (a.startTime && b.startTime) {
        return compareTimeSlots(a.startTime, b.startTime);
      }
      return a.rowIndex - b.rowIndex;
    });

    for (let i = 1; i < sorted.length; i++) {
      const prev = { startTime: sorted[i-1].startTime, endTime: sorted[i-1].endTime };
      const curr = { startTime: sorted[i].startTime, endTime: sorted[i].endTime };
      
      if (!isAdjacentSlot(prev, curr)) {
        return false;
      }
    }
    
    return true;
  },

  validateSelection: (newCell: SelectedCell, currentSelection: SelectedCell[]): boolean => {
    if (currentSelection.length === 0) return true;
    
    if (currentSelection[0].day !== newCell.day) return false;

    const testSelection = [...currentSelection, newCell];
    return selectionEngine.isAdjacent(testSelection);
  }
};
