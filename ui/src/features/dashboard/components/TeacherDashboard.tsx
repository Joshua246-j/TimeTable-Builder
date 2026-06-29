import React from 'react';
import Link from 'next/link';
import { 
  Bell, ChevronDown, Download, LayoutDashboard, Calendar, Users, FileText, 
  BookOpen, CalendarDays, Clock, Check, 
  User, FileQuestion, Megaphone, BellRing, Upload
} from 'lucide-react';
import { TimetableRow } from './teacher-widgets/TimetableRow';
import { AttendanceItem } from './teacher-widgets/AttendanceItem';
import { EvaluationItem } from './teacher-widgets/EvaluationItem';
import { NotificationItem } from './teacher-widgets/NotificationItem';
import { WorkloadStat } from './teacher-widgets/WorkloadStat';
import { ExamItem } from './teacher-widgets/ExamItem';

export function TeacherDashboard() {
  return (
    <div className="flex flex-col h-full w-full bg-[#F8FAFC] font-inter overflow-y-auto">
      
      {/* Top Context Bar */}
      <div className="w-full flex items-center justify-end px-8 pt-6 pb-2 gap-3">
        <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[12px] font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-[#5A67D8]"></div>
          Odd Sem 2024-25 <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>
        <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[12px] font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
          CSE Department <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>
        <button className="flex items-center justify-center bg-white border border-slate-200 rounded-lg w-8 h-8 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors shadow-sm relative">
          <Bell className="w-4 h-4" />
          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></div>
        </button>
      </div>

      <div className="px-8 pb-10 w-full flex flex-col gap-6 max-w-[1600px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2">
          <div>
            <h1 className="text-[24px] font-[800] text-slate-900 tracking-tight leading-tight">Teacher Dashboard</h1>
            <p className="text-[13px] font-[500] text-slate-500 mt-1">Get a complete overview of today&apos;s teaching schedule, classroom activities, pending academic tasks, and workload.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard/academic-modules"
              className="flex items-center justify-center px-4 py-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl text-[13px] font-[700] transition-colors shadow-sm whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4 mr-2 text-[#5A67D8]" />
              Academic Modules
            </Link>
            <button className="flex items-center justify-center px-4 py-2 bg-[#4F46E5] text-white hover:bg-[#4338CA] rounded-xl text-[13px] font-[700] transition-colors shadow-[0_2px_10px_rgba(79,70,229,0.2)] whitespace-nowrap">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Generate Dashboard Report
            </button>
            <button className="flex items-center justify-center px-4 py-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl text-[13px] font-[700] transition-colors shadow-sm whitespace-nowrap">
              <Download className="w-4 h-4 mr-2 text-slate-400" />
              Export Details
            </button>
          </div>
        </div>

        {/* Row 1: Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Classes Scheduled */}
          <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-[#5A67D8]" />
              </div>
              <span className="text-[10px] font-[800] text-slate-400 uppercase tracking-wider">TODAY&apos;S TIMETABLE</span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[32px] font-[800] text-slate-900 leading-none">5</span>
              <span className="text-[13px] font-[600] text-slate-500">Classes Scheduled</span>
            </div>
            <div className="mt-4">
              <span className="inline-flex px-2 py-1 rounded bg-emerald-50 text-emerald-600 text-[10px] font-[800] uppercase tracking-wider">ON TRACK</span>
            </div>
          </div>

          {/* Classes Awaiting */}
          <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <span className="text-[10px] font-[800] text-slate-400 uppercase tracking-wider">ATTENDANCE REMINDERS</span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[32px] font-[800] text-slate-900 leading-none">3</span>
              <span className="text-[13px] font-[600] text-slate-500">Classes Awaiting</span>
            </div>
            <div className="mt-4">
              <span className="inline-flex px-2 py-1 rounded bg-orange-50 text-orange-600 text-[10px] font-[800] uppercase tracking-wider">ATTENTION</span>
            </div>
          </div>

          {/* Submissions Pending */}
          <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-[10px] font-[800] text-slate-400 uppercase tracking-wider">PENDING EVALUATIONS</span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[32px] font-[800] text-slate-900 leading-none">12</span>
              <span className="text-[13px] font-[600] text-slate-500">Submissions Pending</span>
            </div>
            <div className="mt-4">
              <span className="inline-flex px-2 py-1 rounded bg-red-50 text-red-600 text-[10px] font-[800] uppercase tracking-wider">PENDING</span>
            </div>
          </div>

          {/* Examinations Scheduled */}
          <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-[10px] font-[800] text-slate-400 uppercase tracking-wider">UPCOMING EXAMINATIONS</span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[32px] font-[800] text-slate-900 leading-none">2</span>
              <span className="text-[13px] font-[600] text-slate-500">Examinations Scheduled</span>
            </div>
            <div className="mt-4">
              <span className="inline-flex px-2 py-1 rounded bg-blue-50 text-blue-600 text-[10px] font-[800] uppercase tracking-wider">UPCOMING</span>
            </div>
          </div>
        </div>

        {/* Row 2: Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Today's Timetable (Left Col - ~40%) */}
          <div className="lg:col-span-5 bg-white rounded-[24px] shadow-sm border border-slate-100 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-[#5A67D8]" />
                <h3 className="text-[16px] font-[800] text-slate-900 tracking-tight">Today&apos;s Timetable</h3>
              </div>
              <Link href="/dashboard/timetable" className="text-[12px] font-[700] text-[#5A67D8] hover:underline">
                View Full Timetable
              </Link>
            </div>
            
            <div className="flex flex-col relative mt-2 pl-4">
              {/* Timeline Connector Line */}
              <div className="absolute left-[83px] top-4 bottom-4 w-px bg-slate-100"></div>

              <TimetableRow 
                time="09:00 AM" endTime="10:00 AM"
                subject="Data Structures" code="CS301 • Lecture"
                room="A-301" status="completed"
              />
              
              <TimetableRow 
                time="10:00 AM" endTime="11:00 AM"
                subject="Computer Networks" code="CS304 • Lecture"
                room="A-202" status="ongoing"
              />
              
              <TimetableRow 
                time="11:00 AM" endTime="12:00 PM"
                subject="Mathematics III" code="MA301 • Lecture"
                room="A-205" status="upcoming" dotColor="bg-emerald-500"
              />
              
              {/* Lunch Break */}
              <div className="flex items-center gap-6 py-4 relative group z-10">
                <div className="w-[60px] shrink-0 text-right">
                  <span className="block text-[11px] font-[800] text-slate-600">12:00 PM</span>
                  <span className="block text-[9px] font-[600] text-slate-400 mt-0.5">01:00 PM</span>
                </div>
                <div className="relative shrink-0 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-300 bg-white relative z-10"></div>
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <span className="text-[13px] font-[700] text-slate-500">Lunch Break</span>
                </div>
                <div className="w-[80px] text-right">
                  <span className="text-[11px] font-[700] text-slate-300">--</span>
                </div>
              </div>

              <TimetableRow 
                time="01:00 PM" endTime="02:00 PM"
                subject="DBMS" code="CS302 • Lecture"
                room="A-302" status="upcoming" dotColor="bg-[#5A67D8]"
              />
            </div>
          </div>

          {/* Attendance Reminders (Middle Col - ~35%) */}
          <div className="lg:col-span-4 bg-white rounded-[24px] shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  <h3 className="text-[16px] font-[800] text-slate-900 tracking-tight">Attendance Reminders</h3>
                </div>
                <Link href="#" className="text-[12px] font-[700] text-[#5A67D8] hover:underline">
                  View All
                </Link>
              </div>

              {/* Classes Awaiting */}
              <div className="mb-6">
                <span className="block text-[10px] font-[800] text-slate-400 uppercase tracking-wider mb-3">CLASSES AWAITING ATTENDANCE</span>
                <div className="flex flex-col gap-3">
                  <AttendanceItem title="Mathematics III (MA301)" time="A-205 • 11:00 AM" label="Today" type="warning" icon={<User className="w-3.5 h-3.5" />} />
                  <AttendanceItem title="DBMS (CS302)" time="A-302 • 01:00 PM" label="Today" type="warning" icon={<Clock className="w-3.5 h-3.5" />} />
                  <AttendanceItem title="Software Engineering (CS303)" time="A-201 • Tomorrow" label="Tomorrow" type="upcoming" icon={<Calendar className="w-3.5 h-3.5" />} />
                </div>
              </div>

              {/* Recently Completed */}
              <div>
                <span className="block text-[10px] font-[800] text-slate-400 uppercase tracking-wider mb-3">RECENTLY COMPLETED ATTENDANCE</span>
                <div className="flex flex-col gap-3">
                  <AttendanceItem title="Data Structures (CS301)" time="A-301 • 10:00 AM" label="Today" type="success" icon={<Check className="w-3.5 h-3.5" />} />
                  <AttendanceItem title="Computer Networks (CS304)" time="A-202 • 09:00 AM" label="Today" type="success" icon={<Check className="w-3.5 h-3.5" />} />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#5A67D8] flex items-center justify-center text-white shadow-sm">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-[12px] font-[700] text-[#5A67D8]">Next Attendance Deadline</span>
              </div>
              <span className="text-[12px] font-[800] text-slate-900">Today, 01:00 PM</span>
            </div>
          </div>

          {/* Pending Evaluations (Right Col - ~25%) */}
          <div className="lg:col-span-3 bg-white rounded-[24px] shadow-sm border border-slate-100 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-500" />
                <h3 className="text-[16px] font-[800] text-slate-900 tracking-tight">Pending Evaluations</h3>
              </div>
              <Link href="#" className="text-[12px] font-[700] text-[#5A67D8] hover:underline">
                View All
              </Link>
            </div>
            
            <div className="flex flex-col gap-2">
              <EvaluationItem icon={<FileText className="w-4 h-4" />} title="Assignments" count="5" label="SUBMISSIONS" />
              <EvaluationItem icon={<FileQuestion className="w-4 h-4" />} title="Quiz Evaluations" count="3" label="SUBMISSIONS" />
              <EvaluationItem icon={<User className="w-4 h-4" />} title="Lab Records" count="2" label="RECORDS" />
              <EvaluationItem icon={<Clock className="w-4 h-4" />} title="Internal Marks" count="2" label="BATCHES" />
              <EvaluationItem icon={<Upload className="w-4 h-4" />} title="Project Evaluations" count="0" label="SUBMISSIONS" opacity="opacity-50" />
            </div>
          </div>

        </div>

        {/* Row 3: Bottom Analytics & Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Student Notifications */}
          <div className="lg:col-span-5 bg-white rounded-[24px] shadow-sm border border-slate-100 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <BellRing className="w-5 h-5 text-[#5A67D8]" />
                <h3 className="text-[16px] font-[800] text-slate-900 tracking-tight">Student Notifications</h3>
              </div>
              <button className="flex items-center gap-1 text-[12px] font-[700] text-[#5A67D8]">
                View All <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            
            <div className="flex flex-col gap-1">
              <NotificationItem icon={<User className="w-3 h-3" />} text="New message from Rahul S. regarding Assignment 2" time="10 min ago" unread />
              <NotificationItem icon={<User className="w-3 h-3" />} text="Parent meeting request from Mrs. Divya Nair" time="1 hour ago" unread />
              <NotificationItem icon={<Clock className="w-3 h-3" />} text="Query on DBMS project submission from Anjali M." time="2 hours ago" unread />
              <NotificationItem icon={<Megaphone className="w-3 h-3" />} text="Department announcement: Workshop on AI Tools" time="3 hours ago" unread />
              <NotificationItem icon={<Clock className="w-3 h-3" />} text="Class reminder: DBMS Internal test on Friday" time="5 hours ago" unread />
            </div>
          </div>

          {/* Personal Workload */}
          <div className="lg:col-span-7 bg-white rounded-[24px] shadow-sm border border-slate-100 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-[#5A67D8]" />
                <h3 className="text-[16px] font-[800] text-slate-900 tracking-tight">Personal Workload</h3>
              </div>
              <button className="flex items-center gap-1 text-[11px] font-[700] text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                This Week <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-10">
              <WorkloadStat label="LECTURES TODAY" value="4" sub="Classes" />
              <WorkloadStat label="TEACHING HOURS" value="4.0" sub="Hours" />
              <WorkloadStat label="REMAINING CLASSES" value="1" sub="Today" />
              <WorkloadStat label="PENDING TASKS" value="6" sub="Tasks" />
            </div>

            <div className="mt-auto">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[12px] font-[700] text-slate-700">Weekly Workload Overview</span>
                <span className="text-[14px] font-[800] text-slate-900">78%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-gradient-to-r from-[#4F46E5] to-[#818CF8] rounded-full" style={{ width: '78%' }}></div>
              </div>
              <div className="flex justify-between items-center text-[10px] font-[600] text-slate-400">
                <span>16 / 20 Hours Completed</span>
                <span>4 Hours Remaining</span>
              </div>
            </div>
          </div>

        </div>

        {/* Row 4: Upcoming Exams */}
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-6 flex flex-col w-full">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#5A67D8]" />
              <h3 className="text-[16px] font-[800] text-slate-900 tracking-tight">Upcoming Examinations</h3>
            </div>
            <button className="flex items-center gap-1 text-[12px] font-[700] text-[#5A67D8]">
              View More <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          
          <div className="flex flex-wrap items-center gap-8 justify-between w-full">
            <ExamItem month="NOV" day="28" subject="DBMS Internal Test" code="CS302 • Internal" room="A-302 • 09:00 AM" />
            <ExamItem month="DEC" day="05" subject="Data Structures Internal" code="CS301 • Internal" room="A-301 • 11:00 AM" />
            <ExamItem month="DEC" day="12" subject="End Semester Examination" code="CS304 • University" room="Main Hall • 09:30 PM" />
            <ExamItem month="DEC" day="18" subject="Mathematics III University Exam" code="MA301 • University" room="Main Hall • 09:00 AM" />
          </div>
        </div>

      </div>
    </div>
  );
}
