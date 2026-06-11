import { SelectedCell } from "@/types/timetableSpan";
import { ScheduleEntry, TimetableData } from "@/types/timetable";
import { selectionEngine } from "./selectionEngine";
import { calculateDurationMinutes } from "./timeEngine";

export const mergeEngine = {
  calculateRowSpan: (startRow: number, endRow: number): number => {
    return endRow - startRow + 1;
  },

  findMergedGroupForCell: (dayId: string, rowIndex: number, groups: Record<string, ScheduleEntry>): ScheduleEntry | undefined => {
    return Object.values(groups).find(g => {
      return g.dayId === dayId && rowIndex >= g.rowStart && rowIndex < g.rowStart + g.rowSpan;
    });
  },

  canMerge: (cells: SelectedCell[]): boolean => {
    if (cells.length < 2) return false;
    
    // Check adjacency
    if (!selectionEngine.isAdjacent(cells)) return false;

    // Must be assigned to a subject to merge
    const firstSubjectId = cells[0].subjectId;
    if (!firstSubjectId) return false;

    // Strict Enterprise Validation: Same Day, Same Subject, Same Teacher, Same Room
    const firstDay = cells[0].day;
    // (Assuming teacherId and roomId logic will be integrated into the cells if needed, 
    // for now we enforce exact subjectId and day matching)
    if (cells.some(c => c.subjectId !== firstSubjectId || c.day !== firstDay)) {
      return false; 
    }

    return true;
  },

  suggestAutoMerge: (
    newCellIndex: number,
    dayId: string,
    subjectId: string,
    allCells: { id: string; rowIndex: number; day: string; assignment?: { subjectId: string } }[]
  ): string[] => {
    const dayCells = allCells.filter(c => c.day === dayId).sort((a, b) => a.rowIndex - b.rowIndex);
    const mergeGroup = [dayCells.find(c => c.rowIndex === newCellIndex)?.id].filter(Boolean) as string[];
    
    for (let i = newCellIndex - 1; i >= 0; i--) {
      const c = dayCells.find(x => x.rowIndex === i);
      if (c && c.assignment?.subjectId === subjectId) mergeGroup.unshift(c.id);
      else break;
    }
    
    for (let i = newCellIndex + 1; i < 20; i++) {
      const c = dayCells.find(x => x.rowIndex === i);
      if (c && c.assignment?.subjectId === subjectId) mergeGroup.push(c.id);
      else break;
    }
    
    return mergeGroup.length > 1 ? mergeGroup : [];
  },

  createMergeEntry: (cells: SelectedCell[], subjectId: string): ScheduleEntry | null => {
    if (!mergeEngine.canMerge(cells)) return null;

    const sorted = [...cells].sort((a, b) => a.rowIndex - b.rowIndex);
    const startCell = sorted[0];
    const endCell = sorted[sorted.length - 1];

    return {
      id: `merge-${startCell.id}-${Date.now()}`,
      subjectId: subjectId,
      dayId: startCell.day,
      startTime: startCell.startTime,
      endTime: endCell.endTime,
      duration: calculateDurationMinutes(startCell.startTime, endCell.endTime),
      rowStart: startCell.rowIndex,
      rowSpan: mergeEngine.calculateRowSpan(startCell.rowIndex, endCell.rowIndex),
      isEditable: true,
      isLocked: false,
    };
  },

  /**
   * Auto Merge on Edit:
   * Re-calculates rowSpan and rowStart based on strict time boundaries.
   */
  recalculateMergeBounds: (entry: ScheduleEntry, timetableData: TimetableData): ScheduleEntry => {
    const newRowStart = timetableData.timeSlots.findIndex(t => t.startTime === entry.startTime);
    const newRowEnd = timetableData.timeSlots.findIndex(t => t.endTime === entry.endTime);
    
    let newRowSpan = entry.rowSpan;
    if (newRowStart !== -1 && newRowEnd !== -1 && newRowEnd >= newRowStart) {
      newRowSpan = newRowEnd - newRowStart + 1;
    }

    return {
      ...entry,
      duration: calculateDurationMinutes(entry.startTime, entry.endTime),
      rowStart: newRowStart !== -1 ? newRowStart : entry.rowStart,
      rowSpan: newRowSpan
    };
  }
};
