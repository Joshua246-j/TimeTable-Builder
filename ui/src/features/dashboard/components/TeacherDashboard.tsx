import React from 'react';
import Link from 'next/link';
import { 
  BookOpen, Clock, CalendarDays, Users, BookMarked, MonitorPlay, 
  ArrowUpRight, Target, ClipboardList, Megaphone, Calendar
} from 'lucide-react';

export function TeacherDashboard() {
  return (
    <div className="flex flex-col h-full w-full bg-[#F7F8FC] p-8 font-inter overflow-y-auto">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl border border-slate-100 shadow-sm gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Teacher Dashboard</h1>
            <p className="text-[14px] text-slate-500 mt-1">Monitor your classes, student engagement, subject performance, and upcoming academic activities.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard/timetable"
              className="flex items-center justify-center px-4 py-2 bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 rounded-lg text-sm font-semibold transition-colors shadow-sm whitespace-nowrap"
            >
              View Timetable
            </Link>
            <Link 
              href="/dashboard/academic-modules"
              className="flex items-center justify-center px-4 py-2 bg-[#5A67D8] text-white hover:bg-indigo-700 rounded-lg text-sm font-semibold transition-colors shadow-sm whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Academic Modules
            </Link>
          </div>
        </div>

        {/* Row 1: Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricWidget 
            icon={<MonitorPlay className="w-5 h-5 text-[#5A67D8]" />}
            iconBg="bg-[#5A67D8]/10"
            title="Next Class"
            value="10:30 AM"
            subtitle="Data Structures - CS301"
            pillText="In 45 mins"
            pillColor="text-[#5A67D8] bg-[#5A67D8]/10"
          />
          <MetricWidget 
            icon={<Target className="w-5 h-5 text-emerald-500" />}
            iconBg="bg-emerald-500/10"
            title="Today's Attendance"
            value="88.4%"
            subtitle={
              <span className="flex items-center text-emerald-600 font-semibold text-xs">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> 2.1% vs last week
              </span>
            }
            pillText="Excellent"
            pillColor="text-emerald-600 bg-emerald-100"
          />
          <MetricWidget 
            icon={<ClipboardList className="w-5 h-5 text-orange-500" />}
            iconBg="bg-orange-500/10"
            title="Pending Tasks"
            value="14"
            subtitle="Assignments to grade"
            pillText="Action Needed"
            pillColor="text-orange-600 bg-orange-100"
          />
          <MetricWidget 
            icon={<Users className="w-5 h-5 text-cyan-500" />}
            iconBg="bg-cyan-500/10"
            title="Total Students"
            value="342"
            subtitle={
              <span className="flex items-center text-emerald-600 font-semibold text-xs">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> 12 vs last sem
              </span>
            }
            pillText="Active"
            pillColor="text-cyan-600 bg-cyan-100"
          />
        </div>

        {/* Row 2: Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Today's Schedule (Matches "Academic Calendar Timeline" card) */}
          <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
            <h3 className="text-[16px] font-bold text-slate-900 tracking-tight">Today's Schedule</h3>
            <p className="text-[13px] text-slate-500 mb-6">Upcoming classes and labs</p>
            
            <div className="relative border-l border-slate-200 ml-3 flex flex-col gap-8 flex-grow">
              <TimelineItem time="09:00 AM" title="Software Engineering" room="Room 402" status="completed" />
              <TimelineItem time="10:30 AM" title="Data Structures" room="Room 301" status="current" />
              <TimelineItem time="01:30 PM" title="DS Lab Batch A" room="Lab 1" status="upcoming" />
              <TimelineItem time="03:00 PM" title="Mentoring Session" room="Room 301" status="upcoming" />
            </div>
          </div>

          {/* Attendance Trends (Matches "Attendance Trends" card) */}
          <div className="lg:col-span-5 bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-[16px] font-bold text-slate-900 tracking-tight">Class Attendance Trends</h3>
              <select className="text-[12px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-[#5A67D8]">
                <option>This Week</option>
                <option>Last Week</option>
                <option>This Month</option>
              </select>
            </div>
            
            <div className="bg-slate-50/50 rounded-xl p-5 flex flex-col mt-4 flex-grow border border-slate-100/50">
              <div className="mb-2">
                <span className="text-[12px] font-semibold text-slate-500">Average Attendance</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900">88.4%</span>
                  <span className="flex items-center text-emerald-600 font-semibold text-[11px]">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" /> 2.1% vs last week
                  </span>
                </div>
              </div>
              
              {/* Fake SVG Line Chart */}
              <div className="flex-grow w-full relative mt-4 min-h-[100px]">
                <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  {/* Subtle Grid Lines */}
                  <line x1="0" y1="20" x2="400" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="50" x2="400" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="80" x2="400" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                  
                  {/* Gradient for fill */}
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5A67D8" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#5A67D8" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Filled Area */}
                  <polygon points="0,100 0,60 80,40 160,70 240,30 320,50 400,20 400,100" fill="url(#blueGradient)" />
                  
                  {/* Line */}
                  <polyline 
                    points="0,60 80,40 160,70 240,30 320,50 400,20" 
                    fill="none" 
                    stroke="#5A67D8" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  
                  {/* Dots */}
                  <circle cx="80" cy="40" r="4" fill="#fff" stroke="#5A67D8" strokeWidth="2" />
                  <circle cx="240" cy="30" r="4" fill="#fff" stroke="#5A67D8" strokeWidth="2" />
                  <circle cx="400" cy="20" r="4" fill="#fff" stroke="#5A67D8" strokeWidth="2" />
                </svg>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-6 bg-slate-50 px-4 py-3 rounded-lg border border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span className="text-[12px] font-semibold text-slate-600">Health Indicator: <span className="text-slate-900 font-bold">Excellent</span></span>
              </div>
              <div className="w-px h-3 bg-slate-300"></div>
              <span className="text-[12px] font-semibold text-slate-600">Target: <span className="text-slate-900 font-bold">&gt;85%</span></span>
            </div>
          </div>

          {/* Workload Status (Matches "Faculty Status" card) */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
            <h3 className="text-[16px] font-bold text-slate-900 tracking-tight mb-6">Workload Status</h3>
            
            <div className="flex gap-3 mb-8">
              <div className="flex-1 bg-slate-50 border border-slate-100 rounded-lg p-3 text-center">
                <span className="block text-[10px] font-bold text-[#5A67D8] uppercase tracking-wider mb-1">Assigned</span>
                <span className="block text-2xl font-bold text-slate-900">14 <span className="text-sm text-slate-400 font-semibold">hrs</span></span>
              </div>
              <div className="flex-1 bg-orange-50 border border-orange-100 rounded-lg p-3 text-center">
                <span className="block text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-1">Max Cap</span>
                <span className="block text-2xl font-bold text-orange-900">18 <span className="text-sm text-orange-400 font-semibold">hrs</span></span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 flex flex-col gap-4 border border-slate-100">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[12px] font-semibold text-slate-600">Theory Classes</span>
                  <span className="text-[12px] font-bold text-slate-900">8 hrs</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#5A67D8] rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[12px] font-semibold text-slate-600">Lab Sessions</span>
                  <span className="text-[12px] font-bold text-slate-900">6 hrs</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="mt-auto pt-6 flex justify-between items-center">
              <span className="text-[12px] font-semibold text-slate-500">Utilization Rate</span>
              <span className="text-[14px] font-bold text-slate-900">77%</span>
            </div>
          </div>
          
        </div>

        {/* Row 3: Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Active Subjects List (Matches "Student Statistics" card proportions but different content) */}
          <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <BookMarked className="w-5 h-5 text-[#5A67D8]" />
              <h3 className="text-[16px] font-bold text-slate-900 tracking-tight">Active Subjects</h3>
            </div>
            
            <div className="flex flex-col gap-4">
              <SubjectSummaryCard code="CS301" name="Data Structures" students="120" type="Theory" color="bg-[#5A67D8]" />
              <SubjectSummaryCard code="CS302" name="Software Eng." students="120" type="Theory" color="bg-emerald-500" />
              <SubjectSummaryCard code="CS301L" name="DS Lab" students="60" type="Lab" color="bg-orange-500" />
              <SubjectSummaryCard code="MN101" name="Mentoring" students="30" type="Other" color="bg-cyan-500" />
            </div>
          </div>

          {/* Subject Performance (Matches "Department Performance" table) */}
          <div className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
            <h3 className="text-[16px] font-bold text-slate-900 tracking-tight mb-6">Subject Performance</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject</th>
                    <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Avg Attendance</th>
                    <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Performance</th>
                    <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Pass Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100 last:border-0">
                    <td className="py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#5A67D8]/10 text-[#5A67D8] flex items-center justify-center font-bold text-[10px]">CS</div>
                      <span className="font-semibold text-[13px] text-slate-900">Data Structures</span>
                    </td>
                    <td className="py-4 text-center text-[13px] font-semibold text-slate-900">92%</td>
                    <td className="py-4 text-center text-[12px] font-bold text-emerald-600">High</td>
                    <td className="py-4 text-right text-[13px] font-semibold text-slate-900">95%</td>
                  </tr>
                  <tr className="border-b border-slate-100 last:border-0">
                    <td className="py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-[10px]">SE</div>
                      <span className="font-semibold text-[13px] text-slate-900">Software Engineering</span>
                    </td>
                    <td className="py-4 text-center text-[13px] font-semibold text-slate-900">85%</td>
                    <td className="py-4 text-center text-[12px] font-bold text-emerald-600">High</td>
                    <td className="py-4 text-right text-[13px] font-semibold text-slate-900">92%</td>
                  </tr>
                  <tr className="border-b border-slate-100 last:border-0">
                    <td className="py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-[10px]">LB</div>
                      <span className="font-semibold text-[13px] text-slate-900">DS Lab Batch A</span>
                    </td>
                    <td className="py-4 text-center text-[13px] font-semibold text-slate-900">98%</td>
                    <td className="py-4 text-center text-[12px] font-bold text-emerald-600">High</td>
                    <td className="py-4 text-right text-[13px] font-semibold text-slate-900">100%</td>
                  </tr>
                  <tr className="border-b border-slate-100 last:border-0">
                    <td className="py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 flex items-center justify-center font-bold text-[10px]">MN</div>
                      <span className="font-semibold text-[13px] text-slate-900">Mentoring</span>
                    </td>
                    <td className="py-4 text-center text-[13px] font-semibold text-slate-900">75%</td>
                    <td className="py-4 text-center text-[12px] font-bold text-orange-500">Medium</td>
                    <td className="py-4 text-right text-[13px] font-semibold text-slate-900">88%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Row 4: Lists */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ListCard 
            icon={<ClipboardList className="w-4 h-4 text-[#5A67D8]" />}
            title="Pending Actions"
            items={[
              { label: "Assignment Grading", value: "14" },
              { label: "Leave Approvals", value: "2" },
              { label: "Student Requests", value: "5" }
            ]}
          />
          <ListCard 
            icon={<Megaphone className="w-4 h-4 text-[#5A67D8]" />}
            title="Department Announcements"
            items={[
              { label: "HOD Message: Exam Prep", value: "" },
              { label: "Circular: Revised Timetable", value: "" },
              { label: "Notice: Tech Fest Duties", value: "" }
            ]}
          />
          <ListCard 
            icon={<Calendar className="w-4 h-4 text-[#5A67D8]" />}
            title="Upcoming Events"
            items={[
              { label: "First Internal Exams", value: "Oct 12" },
              { label: "Tech Fest 2024", value: "Oct 25" },
              { label: "Project Reviews", value: "Nov 5" }
            ]}
          />
        </div>

      </div>
    </div>
  );
}

// Subcomponents

function MetricWidget({ icon, iconBg, title, value, subtitle, pillText, pillColor }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        <span className="text-[13px] font-bold text-slate-600">{title}</span>
      </div>
      
      <div className="mb-1">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
      </div>
      
      <div className="text-[12px] text-slate-500 font-medium">
        {subtitle}
      </div>

      <div className={`absolute bottom-5 right-5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${pillColor}`}>
        {pillText}
      </div>
    </div>
  );
}

function TimelineItem({ time, title, room, status }: any) {
  const isCompleted = status === 'completed';
  const isCurrent = status === 'current';
  
  return (
    <div className="relative pl-6">
      {/* Circle Indicator */}
      <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full border-2 bg-white ${
        isCompleted ? 'border-slate-300' : 
        isCurrent ? 'border-[#5A67D8] ring-4 ring-[#5A67D8]/20' : 
        'border-[#5A67D8]'
      }`}></div>
      
      <div className="flex flex-col">
        <span className={`text-[11px] font-bold mb-1 uppercase tracking-wider ${isCompleted ? 'text-slate-400' : isCurrent ? 'text-[#5A67D8]' : 'text-slate-500'}`}>
          {time}
        </span>
        <span className={`text-[14px] font-bold leading-tight ${isCompleted ? 'text-slate-500' : 'text-slate-900'}`}>
          {title}
        </span>
        <span className={`text-[12px] font-semibold mt-1 ${isCompleted ? 'text-slate-400' : 'text-slate-500'}`}>
          {room}
        </span>
      </div>
    </div>
  );
}

function SubjectSummaryCard({ code, name, students, type, color }: any) {
  return (
    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex items-center justify-between group hover:border-slate-200 hover:bg-slate-100/50 transition-colors cursor-pointer">
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-2">
          {code}
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          {type}
        </span>
        <span className="text-[14px] font-bold text-slate-900">{name}</span>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[18px] font-bold text-slate-900">{students}</span>
        <span className="text-[10px] font-semibold text-slate-500">Students</span>
      </div>
    </div>
  );
}

function ListCard({ icon, title, items }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#5A67D8]/10 flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-[14px] font-bold text-slate-900">{title}</h3>
        </div>
        <button className="text-[12px] font-bold text-[#5A67D8] flex items-center gap-1 hover:gap-2 transition-all">
          View More <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item: any, idx: number) => (
          <div key={idx} className="flex justify-between items-center bg-slate-50 px-4 py-3 rounded-lg border border-slate-100/50">
            <span className="text-[13px] font-semibold text-slate-700 truncate mr-4">{item.label}</span>
            <span className="text-[13px] font-bold text-slate-900 whitespace-nowrap">{item.value || (
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            )}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
