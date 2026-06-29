import TimetableInteractiveWorkspace from "@/features/timetable/components/TimetableInteractiveWorkspace";
import { fetchTimetable } from "@/services/timetableService";
import type { TimetableData } from "@/types/timetable";

export default async function TimetableBuilderPage() {
  const rawData = await fetchTimetable();
  const initialData = rawData as TimetableData;

  return (
    <div className="h-full w-full overflow-hidden bg-[#F8FAFC] flex flex-col">
      <TimetableInteractiveWorkspace initialData={initialData} isEditable={true} />
    </div>
  );
}
