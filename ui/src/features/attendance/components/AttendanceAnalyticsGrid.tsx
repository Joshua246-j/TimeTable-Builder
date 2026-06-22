import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, UserMinus, CalendarX } from 'lucide-react';

export function AttendanceAnalyticsGrid() {
  return (
    <Card className="mb-6 shadow-sm border-slate-200">
      <CardHeader className="pb-4 pt-5 px-6">
        <CardTitle className="text-sm font-semibold text-slate-800">Attendance analytics</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="grid grid-cols-2 gap-3">
          {/* Attendance Rate */}
          <div className="bg-[#F8FAFC] rounded-xl p-4 border border-slate-100 flex flex-col justify-between shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Attendance Rate</span>
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <svg className="w-10 h-10 transform -rotate-90">
                  <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-200" />
                  <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="100" strokeDashoffset="8" className="text-[#16A34A]" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-slate-800">92%</span>
                <span className="text-[10px] font-semibold text-[#16A34A] uppercase">Excellent</span>
              </div>
            </div>
          </div>

          {/* Weekly Trend */}
          <div className="bg-[#F8FAFC] rounded-xl p-4 border border-slate-100 flex flex-col justify-between shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Weekly Trend</span>
            <div className="flex items-center gap-2 mt-auto">
              <TrendingUp className="w-6 h-6 text-[#5A67D8]" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-slate-800">+4%</span>
                <span className="text-[9px] font-semibold text-slate-400 uppercase">VS LAST WEEK</span>
              </div>
            </div>
          </div>

          {/* Students At Risk */}
          <div className="bg-[#F8FAFC] rounded-xl p-4 border border-slate-100 flex flex-col justify-between shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Students At Risk</span>
            <div className="flex items-center gap-2 mt-auto">
              <UserMinus className="w-6 h-6 text-[#D97706]" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-slate-800">7</span>
                <span className="text-[9px] font-semibold text-slate-400 uppercase">BELOW 75%</span>
              </div>
            </div>
          </div>

          {/* Consecutive Absences */}
          <div className="bg-[#F8FAFC] rounded-xl p-4 border border-slate-100 flex flex-col justify-between shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Consecutive Absences</span>
            <div className="flex items-center gap-2 mt-auto">
              <CalendarX className="w-6 h-6 text-[#DC2626]" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-slate-800">3</span>
                <span className="text-[9px] font-semibold text-slate-400 uppercase">3+ IN A ROW</span>
              </div>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
