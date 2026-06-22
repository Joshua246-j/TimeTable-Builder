import { SelectedCell } from '@/types/timetableSpan';
import { SubjectCardData } from '@/types/timetable';

export const timetableValidation = {
  isAdjacent: (cells: SelectedCell[]): boolean => {
    if (cells.length < 2) return true;
    
    const sorted = [...cells].sort((a, b) => a.rowIndex - b.rowIndex);
    const day = sorted[0].day;
    
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].day !== day) return false;
      if (sorted[i].rowIndex !== sorted[i - 1].rowIndex + 1) return false;
    }
    
    return true;
  },

  isSameDay: (cells: SelectedCell[]): boolean => {
    if (cells.length === 0) return true;
    const day = cells[0].day;
    return cells.every(c => c.day === day);
  },

  isSameSubject: (cells: SelectedCell[]): boolean => {
    if (cells.length === 0) return true;
    const firstSubjectId = cells[0].subjectId;
    if (!firstSubjectId) return false; // Must be assigned a subject
    return cells.every(c => c.subjectId === firstSubjectId);
  },

  // Note: we'd also want same faculty, same room, but right now
  // SelectedCell only has subjectId. In a real scenario, we check the subject's properties too.
  canMerge: (cells: SelectedCell[], subjectDataFn?: (subjectId: string) => SubjectCardData | undefined): boolean => {
    if (cells.length < 2) return false;
    
    if (!timetableValidation.isSameDay(cells)) return false;
    if (!timetableValidation.isAdjacent(cells)) return false;
    if (!timetableValidation.isSameSubject(cells)) return false;
    
    // Check same faculty and room if subject data resolver is provided
    if (subjectDataFn) {
      const subjectId = cells[0].subjectId;
      if (subjectId) {
         const subject = subjectDataFn(subjectId);
         if (subject) {
             // In full implementation, verify same faculty and room
             // For now we assume if same subjectId, it's the same subject class
         }
      }
    }

    return true;
  }
};
