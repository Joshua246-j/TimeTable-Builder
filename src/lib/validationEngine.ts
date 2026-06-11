import { AllocationData } from '@/services/allocationService';
import { SubjectCardData, ScheduleEntry } from '@/types/timetable';
import { FacultyData } from '@/services/facultyService';
import { RoomData } from '@/services/roomService';
import { ValidationIssue } from '@/services/validationService';
import { isOverlap } from '@/lib/timeEngine';
import { MOCK_TIME_SLOTS } from '@/lib/mockData';

export interface ValidationContext {
  allocations: Record<string, AllocationData>;
  mergedAllocations: Record<string, ScheduleEntry>;
  subjects: Record<string, SubjectCardData>;
  faculty: Record<string, FacultyData>;
  rooms: Record<string, RoomData>;
}

// Set to true to inject artificial conflicts for UI demonstration
const DEMO_CONFLICT_MODE = false;

interface ScheduledBlock {
  id: string; // cellId or mergedId
  subjectId: string;
  dayId: string;
  startTime: string;
  endTime: string;
  isMerged: boolean;
}

export const validationEngine = {
  validateAll: (context: ValidationContext): { isValid: boolean, conflicts: ValidationIssue[], warnings: ValidationIssue[] } => {
    const conflicts: ValidationIssue[] = [];
    const warnings: ValidationIssue[] = [];
    
    // Normalize all allocations into a single flat list of scheduled blocks with real start/end times
    const allBlocks: ScheduledBlock[] = [];

    // Helper to get time from mock slots based on cellId format "Day-SlotId"
    const getTimeForNormalCell = (cellId: string) => {
      const parts = cellId.split('-');
      const timeSlotId = parts[1];
      const slot = MOCK_TIME_SLOTS.find(t => t.id === timeSlotId);
      if (slot) {
        return { startTime: slot.startTime, endTime: slot.endTime, dayId: parts[0] };
      }
      return null;
    };

    // 1. Process normal allocations
    Object.values(context.allocations).forEach(alloc => {
      const timeInfo = getTimeForNormalCell(alloc.cellId);
      if (timeInfo) {
        allBlocks.push({
          id: alloc.cellId,
          subjectId: alloc.subjectId,
          dayId: timeInfo.dayId,
          startTime: timeInfo.startTime,
          endTime: timeInfo.endTime,
          isMerged: false
        });
      }
    });

    // 2. Process merged allocations
    Object.values(context.mergedAllocations).forEach(merged => {
      allBlocks.push({
        id: merged.id,
        subjectId: merged.subjectId,
        dayId: merged.dayId,
        startTime: merged.startTime,
        endTime: merged.endTime,
        isMerged: true
      });
    });

    // 3. Compare every block against every other block to find overlaps
    for (let i = 0; i < allBlocks.length; i++) {
      const blockA = allBlocks[i];
      const subjectA = context.subjects[blockA.subjectId];
      if (!subjectA) continue; // Skip if subject doesn't exist

      for (let j = i + 1; j < allBlocks.length; j++) {
        const blockB = allBlocks[j];
        const subjectB = context.subjects[blockB.subjectId];
        if (!subjectB) continue;

        // Conflicts only happen on the same day
        if (blockA.dayId !== blockB.dayId) continue;

        // Check if times overlap using timeEngine's isOverlap (minute based)
        if (isOverlap(blockA, blockB)) {
          
          // FACULTY CONFLICT
          if (subjectA.facultyName && subjectA.facultyName === subjectB.facultyName) {
            conflicts.push({
              id: `conflict-faculty-${blockA.id}-${blockB.id}`,
              type: 'conflict',
              code: 'ERR_FACULTY_OVERLAP',
              message: `Faculty ${subjectA.facultyName} is double-booked on ${blockA.dayId} between ${blockA.startTime} and ${blockB.endTime}.`,
              cellIds: [blockA.id, blockB.id],
              conflictType: 'Faculty Conflict',
              affectedSubject: `${subjectA.subjectName} / ${subjectB.subjectName}`,
              affectedTeacher: subjectA.facultyName,
              affectedRoom: subjectA.roomName || 'Unknown',
              affectedTime: `${blockA.startTime} - ${blockB.endTime}`
            });
          }

          // ROOM CONFLICT
          if (subjectA.roomName && subjectA.roomName === subjectB.roomName) {
            conflicts.push({
              id: `conflict-room-${blockA.id}-${blockB.id}`,
              type: 'conflict',
              code: 'ERR_ROOM_OVERLAP',
              message: `Room ${subjectA.roomName} is double-booked on ${blockA.dayId}.`,
              cellIds: [blockA.id, blockB.id],
              conflictType: 'Room Conflict',
              affectedSubject: `${subjectA.subjectName} / ${subjectB.subjectName}`,
              affectedTeacher: subjectA.facultyName || 'Unknown',
              affectedRoom: subjectA.roomName,
              affectedTime: `${blockA.startTime} - ${blockB.endTime}`
            });
          }

          // SECTION CONFLICT (Same section cannot be in two places at once)
          // Defaulting to "Section CSE V A" since that's what we have in mock data. 
          // Ideally, section is tracked per allocation or subject.
          const secA = subjectA.section || "Section CSE V A";
          const secB = subjectB.section || "Section CSE V A";
          if (secA === secB) {
            conflicts.push({
              id: `conflict-section-${blockA.id}-${blockB.id}`,
              type: 'conflict',
              code: 'ERR_SECTION_OVERLAP',
              message: `${secA} has multiple classes scheduled at the same time on ${blockA.dayId}.`,
              cellIds: [blockA.id, blockB.id],
              conflictType: 'Section Conflict',
              affectedSubject: `${subjectA.subjectName} / ${subjectB.subjectName}`,
              affectedTeacher: subjectA.facultyName || 'Unknown',
              affectedRoom: subjectA.roomName || 'Unknown',
              affectedTime: `${blockA.startTime} - ${blockB.endTime}`
            });
          }
        }
      }

      // WARNINGS (Missing details)
      if (!subjectA.facultyName) {
        warnings.push({
          id: `warn-missing-fac-${blockA.id}`,
          type: 'warning',
          code: 'WARN_NO_FACULTY',
          message: `Subject ${subjectA.subjectName} has no assigned faculty.`,
          cellIds: [blockA.id]
        });
      }
      if (!subjectA.roomName) {
        warnings.push({
          id: `warn-missing-room-${blockA.id}`,
          type: 'warning',
          code: 'WARN_NO_ROOM',
          message: `Subject ${subjectA.subjectName} has no assigned room.`,
          cellIds: [blockA.id]
        });
      }
    }

    // DEMO MODE: Inject artificial conflicts if enabled
    if (DEMO_CONFLICT_MODE) {
      // Find two random allocated cells to flag as conflicting for demo
      const allocatedCellIds = Object.keys(context.allocations);
      if (allocatedCellIds.length >= 2) {
        conflicts.push({
          id: 'demo-conflict-1',
          type: 'conflict',
          code: 'ERR_DEMO',
          message: 'Demo Faculty Conflict Generated',
          cellIds: [allocatedCellIds[0], allocatedCellIds[1]],
          conflictType: 'Faculty Conflict',
          affectedSubject: 'Data Structures / Computer Networks',
          affectedTeacher: 'Dr. Anil Kumar',
          affectedRoom: 'A-301',
          affectedTime: '09:00 AM - 10:00 AM'
        });
      }
    }

    return {
      isValid: conflicts.length === 0,
      conflicts,
      warnings
    };
  }
};
