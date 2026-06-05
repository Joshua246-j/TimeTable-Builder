import TimetableNavbar from "@/features/timetable/components/TimetableNavbar";
import TimetableInteractiveWorkspace from "@/features/timetable/components/TimetableInteractiveWorkspace";
import { fetchTimetable } from "@/services/timetableService";
import type { TimetableData } from "@/types/timetable";

export default async function TimetableBuilderPage() {
  const rawData = await fetchTimetable();
  const initialData = rawData as TimetableData;

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F8FAFC] flex flex-col">
      {/* Top Navbar */}
      <TimetableNavbar />

      {/* Client Component for Interactive Features */}
      <TimetableInteractiveWorkspace initialData={initialData} />
    </div>
  );
}