import { MOCK_SUBJECTS, MOCK_CELLS } from "../lib/mockData";

export interface SubjectDetail {
  id: string;
  code: string;
  subjectName: string;
  credits: number;
  type: string;
  facultyName: string;
  roomName: string;
  department: string;
  semester: string;
  section: string;
  attendanceRate: number;
  totalLectures: number;
  presentations: number;
  notesCount: number;
  weeklySchedule: { day: string; time: string; room: string }[];
  assignments: { id: string; title: string; dueDate: string; status: "Graded" | "Pending" | "Upcoming" }[];
  resources: { id: string; title: string; type: "PDF" | "PPT" | "Link" | "DOC"; size?: string }[];
  analytics: {
    gradeDistribution: { grade: string; count: number; percentage: number }[];
    averageScore: number;
    engagementRate: number;
  };
  aiInsights: string[];
}

export const MOCK_SUBJECTS_DETAILS: Record<string, SubjectDetail> = {};

// Helper to generate details for all master subjects
const buildMockDetails = () => {
  Object.keys(MOCK_SUBJECTS).forEach((id) => {
    const base = MOCK_SUBJECTS[id];
    
    // Calculate deterministic stats based on id
    const charSum = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const credits = base.type === "LAB" ? 2 : base.type === "ELECTIVE" ? 3 : 4;
    const attendanceRate = 75 + (charSum % 21); // 75% to 95%
    const totalLectures = 24 + (charSum % 17); // 24 to 40
    const presentations = 2 + (charSum % 7); // 2 to 8
    const notesCount = 10 + (charSum % 16); // 10 to 25

    // Get weekly schedule from MOCK_CELLS
    const schedule = MOCK_CELLS.filter(c => c.assignment?.subjectId === id).map(c => ({
      day: c.day,
      time: `${c.startTime} - ${c.endTime}`,
      room: base.roomName || "TBD"
    }));

    // Dynamic AI Insights
    const aiInsights = [
      `Syllabus coverage is currently at ${Math.round(60 + (charSum % 31))}% of total curriculum.`,
      `Student engagement is high during practical classes.`,
      `${3 + (charSum % 5)} students are at risk of attendance shortage (< 75%).`,
      `Performance on the last assessment shows solid understanding of core concepts.`
    ];

    MOCK_SUBJECTS_DETAILS[id] = {
      id: base.id,
      code: base.code || `CS${100 + charSum % 400}`,
      subjectName: base.subjectName,
      credits,
      type: base.type || "THEORY",
      facultyName: base.facultyName || "Unassigned Faculty",
      roomName: base.roomName || "TBD",
      department: "Computer Science & Engineering",
      semester: "Semester V",
      section: "CSE V A",
      attendanceRate,
      totalLectures,
      presentations,
      notesCount,
      weeklySchedule: schedule.length ? schedule : [{ day: "Wednesday", time: "09:00 AM - 10:00 AM", room: base.roomName || "A-301" }],
      assignments: [
        { id: `a-${id}-1`, title: "Practical Assignment 1: Basic concepts & Implementation", dueDate: "July 05, 2026", status: "Upcoming" },
        { id: `a-${id}-2`, title: "Mid-Term Review & Problems Case Study", dueDate: "June 20, 2026", status: "Graded" },
        { id: `a-${id}-3`, title: "Comprehensive Mini Project & Report submission", dueDate: "July 15, 2026", status: "Upcoming" }
      ],
      resources: [
        { id: `r-${id}-1`, title: "Complete Lecture Slides & Lecture Notes Compilation", type: "PPT", size: "4.8 MB" },
        { id: `r-${id}-2`, title: "Recommended Reference Textbook & Reading Material", type: "PDF", size: "12.4 MB" },
        { id: `r-${id}-3`, title: "Interactive Visualizations Website Link", type: "Link" },
        { id: `r-${id}-4`, title: "Previous Year Question Papers & Mock Tests", type: "PDF", size: "2.1 MB" }
      ],
      analytics: {
        gradeDistribution: [
          { grade: "O (Outstanding)", count: Math.round(5 + charSum % 8), percentage: 15 },
          { grade: "A+ (Excellent)", count: Math.round(15 + charSum % 10), percentage: 35 },
          { grade: "A (Very Good)", count: Math.round(10 + charSum % 12), percentage: 25 },
          { grade: "B (Good)", count: Math.round(8 + charSum % 6), percentage: 15 },
          { grade: "C (Pass)", count: Math.round(2 + charSum % 4), percentage: 10 }
        ],
        averageScore: 72 + (charSum % 18),
        engagementRate: 80 + (charSum % 16)
      },
      aiInsights
    };
  });
};

buildMockDetails();
