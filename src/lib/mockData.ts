export const MOCK_DAYS = [
  { id: "1", name: "Monday", shortName: "Mon" },
  { id: "2", name: "Tuesday", shortName: "Tue" },
  { id: "3", name: "Wednesday", shortName: "Wed" },
  { id: "4", name: "Thursday", shortName: "Thu" },
  { id: "5", name: "Friday", shortName: "Fri" },
];

export const MOCK_TIME_SLOTS = [
  { id: "1", startTime: "09:00 AM", endTime: "10:00 AM" },
  { id: "2", startTime: "10:00 AM", endTime: "11:00 AM" },
  { id: "3", startTime: "11:00 AM", endTime: "12:00 PM" },
  { id: "4", startTime: "12:00 PM", endTime: "01:00 PM" }, // Lunch
  { id: "5", startTime: "01:00 PM", endTime: "02:00 PM" },
  { id: "6", startTime: "02:00 PM", endTime: "03:00 PM" },
  { id: "7", startTime: "03:00 PM", endTime: "04:00 PM" },
];

export const MOCK_SUBJECTS: Record<string, any> = {
  "1": { id: "1", subjectName: "Data Structures", type: "THEORY", facultyName: "Dr. Anil Kumar", roomName: "A-301" },
  "2": { id: "2", subjectName: "Database Mgmt Systems", type: "THEORY", facultyName: "Dr. Priya Nair", roomName: "A-301" },
  "3": { id: "3", subjectName: "Software Engg.", type: "THEORY", facultyName: "Prof. Vivek Sharma", roomName: "A-351" },
  "4": { id: "4", subjectName: "Software Engg.", type: "THEORY", facultyName: "Prof. Vivek Sharma", roomName: "A-301" },
  "5": { id: "5", subjectName: "Computer Networks", type: "THEORY", facultyName: "Prof. Arjun Nair", roomName: "A-302" },
  "6": { id: "6", subjectName: "AI Fundamentals", type: "ELECTIVE", facultyName: "Dr. Sreedhar", roomName: "B-201" },
  "7": { id: "7", subjectName: "Maths IV", type: "ELECTIVE", facultyName: "Dr. Meena S", roomName: "B-101" },
  "8": { id: "8", subjectName: "Maths IV", type: "ELECTIVE", facultyName: "Dr. Meena S", roomName: "B-101", hasConflict: true },
  "dslab": { id: "dslab", subjectName: "DS Lab", type: "LAB", facultyName: "Dr. Anil Kumar", roomName: "CS Lab 1" },
  "mentoring": { id: "mentoring", subjectName: "Mentoring / Activity", type: "TUTORIAL", facultyName: "Dr. Sreelakshmi R", roomName: "Seminar Hall" },
};

export const MOCK_CELLS = [
  // Monday
  { id: "c1", day: "Monday", startTime: "09:00 AM", endTime: "10:00 AM", isAssigned: true, assignment: { subjectId: "1" } },
  { id: "c2", day: "Monday", startTime: "10:00 AM", endTime: "11:00 AM", isAssigned: true, assignment: { subjectId: "4" } },
  { id: "c3", day: "Monday", startTime: "11:00 AM", endTime: "12:00 PM", isAssigned: true, assignment: { subjectId: "1" } },
  { id: "c4", day: "Monday", startTime: "01:00 PM", endTime: "02:00 PM", isAssigned: true, assignment: { subjectId: "dslab" } },
  { id: "c4_b", day: "Monday", startTime: "03:00 PM", endTime: "04:00 PM", isAssigned: true, assignment: { subjectId: "mentoring" } },
  
  // Tuesday
  { id: "c5", day: "Tuesday", startTime: "09:00 AM", endTime: "10:00 AM", isAssigned: true, assignment: { subjectId: "2" } },
  { id: "c6", day: "Tuesday", startTime: "10:00 AM", endTime: "11:00 AM", isAssigned: true, assignment: { subjectId: "5" } },
  { id: "c7", day: "Tuesday", startTime: "11:00 AM", endTime: "12:00 PM", isAssigned: true, assignment: { subjectId: "6" } },

  // Wednesday
  { id: "c8", day: "Wednesday", startTime: "09:00 AM", endTime: "10:00 AM", isAssigned: true, assignment: { subjectId: "3" } },

  // Thursday
  { id: "c9", day: "Thursday", startTime: "09:00 AM", endTime: "10:00 AM", isAssigned: true, assignment: { subjectId: "5" } },
  { id: "c10", day: "Thursday", startTime: "10:00 AM", endTime: "11:00 AM", isAssigned: true, assignment: { subjectId: "1" } },
  { id: "c11", day: "Thursday", startTime: "11:00 AM", endTime: "12:00 PM", isAssigned: true, assignment: { subjectId: "2" } },

  // Friday
  { id: "c12", day: "Friday", startTime: "09:00 AM", endTime: "10:00 AM", isAssigned: true, assignment: { subjectId: "7" } },
  { id: "c13", day: "Friday", startTime: "10:00 AM", endTime: "11:00 AM", isAssigned: true, assignment: { subjectId: "8" } },
];
