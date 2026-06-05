import TimetableNavbar from "@/features/timetable/components/TimetableNavbar";
import TimetableInteractiveWorkspace from "@/features/timetable/components/TimetableInteractiveWorkspace";
import { fetchTimetable } from "@/services/timetableService";

export default async function TimetableBuilderPage() {
  const initialData = await fetchTimetable();

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F8FAFC] flex flex-col">
      {/* Server Component Navbar */}
      <TimetableNavbar />

      {/* Client Component for Interactive Features */}
      <TimetableInteractiveWorkspace initialData={initialData} />
    </div>
  );
}