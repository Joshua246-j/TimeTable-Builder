export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | null;

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  status: AttendanceStatus;
}

export interface LectureInfo {
  subject: string;
  faculty: string;
  date: string;
  time: string;
  section: string;
}

export interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  late: number;
}
