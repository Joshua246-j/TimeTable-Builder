"use client";

import React, { useState, useEffect } from 'react';
import { LectureInformationCard } from './LectureInformationCard';
import { AttendanceTable } from './AttendanceTable';
import { AttendanceSummaryCard } from './AttendanceSummaryCard';
import { AttendanceAnalyticsGrid } from './AttendanceAnalyticsGrid';
import { AttendanceInsightsCard } from './AttendanceInsightsCard';
import { AttendanceDistributionCard } from './AttendanceDistributionCard';
import { Student, AttendanceStatus } from '../types';
import { AttendanceService } from '@/services';

export function AttendanceContent() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await AttendanceService.getStudents();
        const records = await AttendanceService.getAttendanceRecords();
        
        // Merge records with student data
        const mergedStudents = data.map(student => {
          const record = records.find(r => r.studentId === student.id);
          return {
            ...student,
            status: (record?.status || null) as AttendanceStatus
          };
        });
        
        setStudents(mergedStudents);
      } catch (error) {
        console.error("Failed to load attendance", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleStatusChange = (id: string, status: AttendanceStatus) => {
    setStudents(students.map(s => s.id === id ? { ...s, status } : s));
  };

  const handleMarkAllPresent = () => {
    setStudents(students.map(s => ({ ...s, status: 'present' })));
  };

  const handleClearAttendance = () => {
    setStudents(students.map(s => ({ ...s, status: null })));
  };

  const handleSubmit = async () => {
    try {
      await AttendanceService.submitAttendance(students);
      alert('Attendance submitted successfully!');
    } catch {
      alert('Failed to submit attendance');
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5A67D8]"></div></div>;
  }

  const mockLectureInfo = {
    subject: 'Data Structures',
    faculty: 'Dr. Anil Kumar',
    date: 'October 24, 2025',
    time: '09:00 AM - 10:30 AM',
    section: 'CSE V A'
  };

  const mockSummary = {
    total: students.length,
    present: students.filter(s => s.status === 'present').length,
    absent: students.filter(s => s.status === 'absent').length,
    late: students.filter(s => s.status === 'late').length,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2.2fr_1fr] gap-6 xl:gap-8 mt-2">
      
      {/* Left Column (70%) */}
      <div className="flex flex-col gap-0 min-w-0">
        <LectureInformationCard info={mockLectureInfo} />
        <AttendanceTable 
          students={students}
          onStatusChange={handleStatusChange}
          onMarkAllPresent={handleMarkAllPresent}
          onClearAttendance={handleClearAttendance}
          onSubmit={handleSubmit}
        />
      </div>

      {/* Right Column (30%) */}
      <div className="flex flex-col gap-0 min-w-0">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">Attendance Insights</h2>
        </div>
        <AttendanceSummaryCard summary={mockSummary} />
        <AttendanceAnalyticsGrid />
        <AttendanceInsightsCard />
        <AttendanceDistributionCard />
      </div>

    </div>
  );
}
