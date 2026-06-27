import { SubjectCardData, ScheduleEntry } from '@/types/timetable';
import { FacultyData } from '@/services/facultyService';
import { RoomData } from '@/services/roomService';
import { ValidationIssue } from '@/services/validationService';
import { isOverlap, parseTime, formatTime, hasIntersectingBreak } from '@/lib/timeEngine';


export interface ValidationContext {
  allocations: Record<string, ScheduleEntry>;
  subjects: Record<string, SubjectCardData>;
  faculty: Record<string, FacultyData>;
  rooms: Record<string, RoomData>;
  timeSlots: { id?: string; startTime: string; endTime: string }[];
  breaks: { afterPeriodId: string; durationMinutes: number; startTime?: string; endTime?: string }[];
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

    Object.values(context.allocations).forEach(alloc => {
      allBlocks.push({
        id: alloc.id,
        subjectId: alloc.subjectId,
        dayId: alloc.dayId,
        startTime: alloc.startTime,
        endTime: alloc.endTime,
        isMerged: alloc.rowSpan > 1
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
          const overlapStartMins = Math.max(parseTime(blockA.startTime), parseTime(blockB.startTime));
          const overlapEndMins = Math.min(parseTime(blockA.endTime), parseTime(blockB.endTime));
          const overlapTimeStr = `${formatTime(overlapStartMins)} - ${formatTime(overlapEndMins)}`;
          
          // FACULTY CONFLICT
          if (subjectA.facultyName && subjectA.facultyName === subjectB.facultyName) {
            conflicts.push({
              id: `conflict-faculty-${blockA.id}-${blockB.id}`,
              type: 'conflict',
              code: 'ERR_FACULTY_OVERLAP',
              message: `Faculty ${subjectA.facultyName} is double-booked on ${blockA.dayId} between ${formatTime(overlapStartMins)} and ${formatTime(overlapEndMins)}.`,
              cellIds: [blockA.id, blockB.id],
              conflictType: 'Faculty Conflict',
              affectedSubject: `${subjectA.subjectName} / ${subjectB.subjectName}`,
              affectedTeacher: subjectA.facultyName,
              affectedRoom: subjectA.roomName || 'Unknown',
              affectedTime: overlapTimeStr
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
              affectedTime: overlapTimeStr
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
              affectedTime: overlapTimeStr
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

    // BREAK VALIDATION & BOUNDS VALIDATION
    if (context.timeSlots.length > 0) {
      const gridStartTime = parseTime(context.timeSlots[0].startTime);
      const gridEndTime = parseTime(context.timeSlots[context.timeSlots.length - 1].endTime);
      
      // Calculate break absolute times
      const absoluteBreaks = context.breaks.map(b => {
         const slot = context.timeSlots.find(s => s.id === b.afterPeriodId) || context.timeSlots[context.timeSlots.length - 1];
         if (!slot) return { startTime: "", endTime: "" };
         const start = parseTime(slot.endTime);
         const end = start + b.durationMinutes;
         return { startTime: slot.endTime, endTime: formatTime(end) };
      }).filter(b => b.startTime !== "");

      for (const block of allBlocks) {
        const startMins = parseTime(block.startTime);
        const endMins = parseTime(block.endTime);
        const subject = context.subjects[block.subjectId];
        if (!subject) continue;

        // BOUNDS CHECK
        if (startMins < gridStartTime || endMins > gridEndTime) {
          conflicts.push({
            id: `err-bounds-${block.id}`,
            type: 'conflict',
            code: 'ERR_OUT_OF_BOUNDS',
            message: `${subject.subjectName} is scheduled outside the valid timetable hours.`,
            cellIds: [block.id],
            conflictType: 'Manual Edit Conflict',
          });
        }

        // BREAK CHECK
        if (hasIntersectingBreak(block.startTime, block.endTime, absoluteBreaks)) {
          conflicts.push({
            id: `err-break-${block.id}`,
            type: 'conflict',
            code: 'ERR_BREAK_OVERLAP',
            message: `${subject.subjectName} overlaps with a scheduled break.`,
            cellIds: [block.id],
            conflictType: 'Manual Edit Conflict',
          });
        }
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
