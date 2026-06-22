import { Student, LectureInfo } from '../types';

export const MOCK_LECTURE_INFO: LectureInfo = {
  subject: 'Data Structures',
  faculty: 'Dr. Anil Kumar',
  date: 'October 24, 2025',
  time: '09:00 AM - 10:30 AM',
  section: 'CSE V A'
};

export const MOCK_STUDENTS: Student[] = [
  { id: '1', rollNo: '001', name: 'Adarsh S', status: 'Present' },
  { id: '2', rollNo: '002', name: 'Albin Jojo', status: 'Present' },
  { id: '3', rollNo: '003', name: 'Ardra S Nair', status: 'Late' },
  { id: '4', rollNo: '004', name: 'Ben Sijo', status: 'Absent' },
  { id: '5', rollNo: '005', name: 'Joshua Jomon', status: 'Present' },
  { id: '6', rollNo: '006', name: 'Joshua Varghese', status: 'Present' },
  { id: '7', rollNo: '007', name: 'Raymond Thomas', status: 'Present' },
];

// Generate remaining students to reach 62 total
for (let i = 8; i <= 62; i++) {
  MOCK_STUDENTS.push({
    id: i.toString(),
    rollNo: i.toString().padStart(3, '0'),
    name: `Student ${i}`,
    status: Math.random() > 0.1 ? 'Present' : (Math.random() > 0.5 ? 'Absent' : 'Late')
  });
}
