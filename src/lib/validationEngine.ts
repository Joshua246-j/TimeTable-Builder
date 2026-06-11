import { AllocationData } from '@/services/allocationService';
import { SubjectCardData, ScheduleEntry } from '@/types/timetable';
import { FacultyData } from '@/services/facultyService';
import { RoomData } from '@/services/roomService';
import { ValidationIssue } from '@/services/validationService';

export interface ValidationContext {
  allocations: Record<string, AllocationData>;
  mergedAllocations: Record<string, ScheduleEntry>;
  subjects: Record<string, SubjectCardData>;
  faculty: Record<string, FacultyData>;
  rooms: Record<string, RoomData>;
}

export const validationEngine = {
  validateAll: (context: ValidationContext): { isValid: boolean, conflicts: ValidationIssue[], warnings: ValidationIssue[] } => {
    const conflicts: ValidationIssue[] = [];
    const warnings: ValidationIssue[] = [];
    
    // Maps to track assignments by time
    const facultyTimeMap: Record<string, string[]> = {}; // facultyId -> array of cellIds/mergedIds
    const roomTimeMap: Record<string, string[]> = {};    // roomId -> array of cellIds/mergedIds
    const sectionTimeMap: Record<string, string[]> = {}; // section -> array of cellIds/mergedIds (simplified to cellId here)
    
    // Helper to log time blocks
    const recordTime = (
      id: string, 
      subjectId: string, 
      isMerged: boolean,
      dayId: string,
      rowStart: number,
      rowSpan: number
    ) => {
      const subject = context.subjects[subjectId];
      if (!subject) return;

      const facultyId = subject.facultyName; // Assuming facultyName stores the ID for now, as per some legacy mock data
      const roomId = subject.roomName;

      for (let r = rowStart; r < rowStart + rowSpan; r++) {
        const timeKey = `${dayId}-${r}`;
        
        // Check Faculty
        if (facultyId) {
          const fKey = `${facultyId}-${timeKey}`;
          if (facultyTimeMap[fKey]) {
            conflicts.push({
              id: `conflict-faculty-${id}-${timeKey}`,
              type: 'conflict',
              code: 'ERR',
              message: `Faculty ${facultyId} is double-booked on ${dayId} at row ${r}.`,
              cellIds: [id]
            });
          } else {
            facultyTimeMap[fKey] = [id];
          }
        }

        // Check Room
        if (roomId) {
          const rKey = `${roomId}-${timeKey}`;
          if (roomTimeMap[rKey]) {
            conflicts.push({
              id: `conflict-room-${id}-${timeKey}`,
              type: 'conflict',
              code: 'ERR',
              message: `Room ${roomId} is double-booked on ${dayId} at row ${r}.`,
              cellIds: [id]
            });
          } else {
            roomTimeMap[rKey] = [id];
          }
        }
        
        // Check overlapping allocation in the exact same cell
        const sKey = `section-${timeKey}`;
        if (sectionTimeMap[sKey]) {
           conflicts.push({
              id: `conflict-overlap-${id}-${timeKey}`,
              type: 'conflict',
              code: 'ERR',
              message: `Multiple allocations found for the same slot on ${dayId} at row ${r}.`,
              cellIds: [id]
            });
        } else {
            sectionTimeMap[sKey] = [id];
        }
      }
    };

    // Process all single allocations
    Object.values(context.allocations).forEach(alloc => {
      // In a real app we'd parse cellId to get dayId and rowIndex
      // For now we assume cellId is formatted like "Monday-0"
      const [dayId, rowIndexStr] = alloc.cellId.split('-');
      const rowIndex = parseInt(rowIndexStr, 10);
      
      if (!isNaN(rowIndex)) {
        recordTime(alloc.cellId, alloc.subjectId, false, dayId, rowIndex, 1);
      }
      
      const subject = context.subjects[alloc.subjectId];
      if (!subject) {
        warnings.push({
           id: `warn-missing-subj-${alloc.cellId}`,
           type: 'warning',
           code: 'WARN',
           message: `Allocation references missing subject ID: ${alloc.subjectId}`,
           cellIds: [alloc.cellId]
        });
      } else {
        if (!subject.facultyName) {
           warnings.push({
             id: `warn-missing-fac-${alloc.cellId}`,
             type: 'warning',
           code: 'WARN',
             message: `Subject ${subject.subjectName} has no assigned faculty.`,
             cellIds: [alloc.cellId]
           });
        }
        if (!subject.roomName) {
           warnings.push({
             id: `warn-missing-room-${alloc.cellId}`,
             type: 'warning',
           code: 'WARN',
             message: `Subject ${subject.subjectName} has no assigned room.`,
             cellIds: [alloc.cellId]
           });
        }
      }
    });

    // Process all merged allocations
    Object.values(context.mergedAllocations).forEach(merged => {
       recordTime(merged.id, merged.subjectId, true, merged.dayId, merged.rowStart, merged.rowSpan);
    });

    return {
      isValid: conflicts.length === 0,
      conflicts,
      warnings
    };
  }
};
