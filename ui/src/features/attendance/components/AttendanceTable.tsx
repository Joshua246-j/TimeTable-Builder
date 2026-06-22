import { Student, AttendanceStatus } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, Trash2, Upload } from 'lucide-react';
import { AttendanceStatusSelector } from './AttendanceStatusSelector';

interface AttendanceTableProps {
  students: Student[];
  onStatusChange: (id: string, status: AttendanceStatus) => void;
  onMarkAllPresent: () => void;
  onClearAttendance: () => void;
  onSubmit: () => void;
}

export function AttendanceTable({
  students,
  onStatusChange,
  onMarkAllPresent,
  onClearAttendance,
  onSubmit
}: AttendanceTableProps) {
  return (
    <Card className="shadow-sm border-slate-200 flex flex-col h-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-4 pt-5 px-6 border-b border-slate-100">
        <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
          Student attendance <span className="text-slate-400 font-normal">({students.length} students)</span>
        </CardTitle>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onMarkAllPresent}
            className="text-[#16A34A] border-[#16A34A] bg-[#F0FDF4]/50 hover:bg-[#F0FDF4] hover:text-[#16A34A] h-8 px-3"
          >
            <Check className="w-4 h-4 mr-1.5" />
            Mark All Present
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearAttendance}
            className="text-[#DC2626] border-[#FCA5A5] bg-[#FEF2F2]/50 hover:bg-[#FEF2F2] hover:text-[#DC2626] h-8 px-3"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Clear Attendance
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 overflow-auto">
        <Table>
          <TableHeader className="bg-[#F8FAFC] sticky top-0 z-10 border-b border-slate-200">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[50px] px-6 py-3">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#5A67D8] focus:ring-[#5A67D8]" />
              </TableHead>
              <TableHead className="w-[120px] text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">Roll No</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">Student Name</TableHead>
              <TableHead className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3">Attendance Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id} className="hover:bg-[#F8FAFC]/50 transition-colors border-b border-slate-100 group">
                <TableCell className="px-6 py-3.5">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#5A67D8] focus:ring-[#5A67D8]" />
                </TableCell>
                <TableCell className="py-3.5 font-medium text-slate-500">{student.rollNo}</TableCell>
                <TableCell className="py-3.5 font-semibold text-slate-800">{student.name}</TableCell>
                <TableCell className="px-6 py-3.5 text-right flex justify-end">
                  <AttendanceStatusSelector 
                    status={student.status} 
                    onChange={(status) => onStatusChange(student.id, status)} 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <div className="p-6 border-t border-slate-100 bg-white mt-auto">
        <Button 
          className="w-full bg-[#5A67D8] hover:bg-[#4C51BF] text-white h-12 text-sm font-semibold shadow-md transition-all"
          onClick={onSubmit}
        >
          <Upload className="w-4 h-4 mr-2" />
          Submit attendance records
        </Button>
      </div>
    </Card>
  );
}
