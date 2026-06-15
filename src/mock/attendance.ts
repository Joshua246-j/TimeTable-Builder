import { mockStudents } from './students';

export const mockAttendanceRecords = mockStudents.map(student => ({
  studentId: student.id,
  status: 'present' as 'present' | 'absent' | 'late',
}));

export const mockAttendanceInsights = {
  todaySummary: { total: 62, present: 54, absent: 5, late: 3 },
  analytics: {
    rate: 92,
    rateText: 'EXCELLENT',
    weeklyTrend: '+4%',
    studentsAtRisk: 7,
    consecutiveAbsences: 3,
  },
  aiInsights: [
    '7 students have attendance below 75%.',
    'Attendance increased by 4% compared to last week.',
    '3 students are at risk of shortage.',
    'Consider reaching out to students with low attendance.'
  ],
  distribution: [
    { label: 'Present', count: 54, percentage: 87.1, color: '#5A67D8' },
    { label: 'Absent', count: 5, percentage: 8.1, color: '#EF4444' },
    { label: 'Late', count: 3, percentage: 4.8, color: '#F59E0B' },
  ]
};
