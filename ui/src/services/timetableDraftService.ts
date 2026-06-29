import { ScheduleEntry } from "@/types/timetable";
import { MOCK_CELLS } from "@/lib/mockData";

export interface TimetableDraft {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  lastModified: string;
  allocations: Record<string, ScheduleEntry>;
}

// In-memory mock database to simulate real backend
let draftsDb: TimetableDraft[] = [
  {
    id: "draft-1",
    name: "Semester Regular Schedule",
    description: "The core timetable for the entire semester.",
    createdBy: "Admin",
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    allocations: MOCK_CELLS.reduce((acc, cell) => {
      acc[cell.id] = {
        id: cell.id,
        dayId: cell.day,
        startTime: cell.startTime,
        endTime: cell.endTime,
        subjectId: cell.assignment?.subjectId || "",
        rowSpan: 1,
        rowStart: 0,
        isLocked: false,
        isEditable: false,
      };
      return acc;
    }, {} as Record<string, ScheduleEntry>),
  },
  {
    id: "draft-2",
    name: "Internal Exam Week",
    description: "Modified schedule for mid-term exams.",
    createdBy: "Admin",
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    allocations: {},
  }
];

let liveTimetable: TimetableDraft | null = { ...draftsDb[0] }; // Start with draft-1 published

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getDrafts(): Promise<TimetableDraft[]> {
  await delay(300);
  return [...draftsDb];
}

export async function getDraftById(id: string): Promise<TimetableDraft | null> {
  await delay(100);
  const draft = draftsDb.find(d => d.id === id);
  return draft ? { ...draft } : null;
}

export async function createDraft(name: string, description: string, allocations: Record<string, ScheduleEntry> = {}): Promise<TimetableDraft> {
  await delay(300);
  const newDraft: TimetableDraft = {
    id: `draft-${Date.now()}`,
    name,
    description,
    createdBy: "Current User", // Mock user
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    allocations: { ...allocations }
  };
  draftsDb.push(newDraft);
  return { ...newDraft };
}

export async function saveDraft(id: string, allocations: Record<string, ScheduleEntry>, name?: string): Promise<TimetableDraft> {
  await delay(300);
  const index = draftsDb.findIndex(d => d.id === id);
  if (index === -1) throw new Error("Draft not found");
  
  draftsDb[index] = {
    ...draftsDb[index],
    allocations: { ...allocations },
    lastModified: new Date().toISOString(),
    name: name || draftsDb[index].name
  };
  return { ...draftsDb[index] };
}

export async function renameDraft(id: string, newName: string): Promise<TimetableDraft> {
  await delay(200);
  const index = draftsDb.findIndex(d => d.id === id);
  if (index === -1) throw new Error("Draft not found");
  
  draftsDb[index].name = newName;
  draftsDb[index].lastModified = new Date().toISOString();
  return { ...draftsDb[index] };
}

export async function duplicateDraft(id: string, newName: string): Promise<TimetableDraft> {
  await delay(300);
  const draft = draftsDb.find(d => d.id === id);
  if (!draft) throw new Error("Draft not found");
  
  return createDraft(newName, `Copy of ${draft.name}`, draft.allocations);
}

export async function deleteDraft(id: string): Promise<void> {
  await delay(300);
  // It's safe to delete drafts now since live is a detached snapshot
  draftsDb = draftsDb.filter(d => d.id !== id);
}

export async function publishDraft(id: string): Promise<string> {
  await delay(400);
  const draft = draftsDb.find(d => d.id === id);
  if (!draft) throw new Error("Draft not found");
  
  // Clone to live
  liveTimetable = { ...draft, allocations: { ...draft.allocations } };
  return draft.id;
}

export async function getPublishedTimetable(): Promise<TimetableDraft | null> {
  await delay(300);
  return liveTimetable ? { ...liveTimetable } : null;
}
