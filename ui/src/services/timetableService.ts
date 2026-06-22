import { MOCK_DAYS, MOCK_TIME_SLOTS, MOCK_SUBJECTS, MOCK_CELLS } from "@/lib/mockData";

/**
 * Service to fetch timetable data.
 * Simulates an async backend call.
 */
export async function fetchTimetable() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        days: MOCK_DAYS,
        timeSlots: MOCK_TIME_SLOTS,
        subjects: MOCK_SUBJECTS,
        cells: MOCK_CELLS,
      });
    }, 500); // 500ms simulated delay
  });
}

/**
 * Service to update a timetable slot.
 * Simulates an async backend call.
 */
export async function updateSlot(cellId: string, subjectId: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would mutate backend state.
      // Here we just return success.
      resolve({ success: true, cellId, subjectId });
    }, 500);
  });
}
