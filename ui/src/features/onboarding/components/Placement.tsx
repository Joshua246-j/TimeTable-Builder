import React from 'react';
import { useFormContext } from 'react-hook-form';
import { OnboardingFormData } from '../schema';
import { FormField } from '@/components/shared';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, User, BookOpen, Users, Building2, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Placement() {
  const { watch, setValue, formState: { errors } } = useFormContext<OnboardingFormData>();
  
  const personType = watch('personType.personType');
  const pErrors = errors.placement;

  return (
    <div className="flex flex-col">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-1">Placement</h2>
        <p className="text-sm font-medium text-slate-500">Assign academic placement or departmental roles.</p>
      </div>

      {(personType === 'student' || !personType) && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#EEF2FF] flex items-center justify-center text-[#5A67D8]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-[15px] font-bold text-slate-800">Student Placement</h3>
              <p className="text-[11px] font-medium text-slate-500">Assign academic placement and subject preferences for the student.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <FormField label="Academic Year" required error={pErrors?.academicYear?.message}>
              <Select onValueChange={val => setValue('placement.academicYear', val)}>
                <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-25">2024-25</SelectItem>
                  <SelectItem value="2023-24">2023-24</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Semester" required error={pErrors?.semester?.message}>
              <Select onValueChange={val => setValue('placement.semester', val)}>
                <SelectTrigger><SelectValue placeholder="Select semester" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="odd">Odd Semester</SelectItem>
                  <SelectItem value="even">Even Semester</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Department" required error={pErrors?.department?.message}>
              <Select onValueChange={val => setValue('placement.department', val)}>
                <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cs">Computer Science</SelectItem>
                  <SelectItem value="it">Information Technology</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Program" required error={pErrors?.program?.message}>
              <Select onValueChange={val => setValue('placement.program', val)}>
                <SelectTrigger><SelectValue placeholder="Select program" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="btech">B.Tech</SelectItem>
                  <SelectItem value="mtech">M.Tech</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Class" required error={pErrors?.class?.message}>
              <Select onValueChange={val => setValue('placement.class', val)}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="second">Second Year</SelectItem>
                  <SelectItem value="third">Third Year</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Section" required error={pErrors?.section?.message}>
              <Select onValueChange={val => setValue('placement.section', val)}>
                <SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="border border-slate-200 rounded-xl p-5 flex items-start gap-4">
              <div className="w-8 h-8 rounded bg-[#EEF2FF] flex items-center justify-center text-[#5A67D8] shrink-0 mt-0.5">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="flex flex-col flex-1">
                <h4 className="text-xs font-bold text-slate-800 mb-0.5">Subject Selection</h4>
                <p className="text-[11px] text-slate-500 mb-3">Select core subjects for the class.</p>
                <Button variant="outline" className="w-full text-[#5A67D8] border-[#5A67D8] hover:bg-[#EEF2FF]">
                  <BookOpen className="w-3.5 h-3.5 mr-2" />
                  Select Subjects
                </Button>
                <span className="text-[10px] font-bold text-[#10B981] mt-2 text-center">8 subjects selected</span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 flex items-start gap-4">
              <div className="w-8 h-8 rounded bg-[#EEF2FF] flex items-center justify-center text-[#5A67D8] shrink-0 mt-0.5">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="flex flex-col flex-1">
                <h4 className="text-xs font-bold text-slate-800 mb-0.5">Elective Selection</h4>
                <p className="text-[11px] text-slate-500 mb-3">Select elective subjects for the student.</p>
                <Button variant="outline" className="w-full text-[#5A67D8] border-[#5A67D8] hover:bg-[#EEF2FF]">
                  <BookOpen className="w-3.5 h-3.5 mr-2" />
                  Select Electives
                </Button>
                <span className="text-[10px] font-bold text-[#10B981] mt-2 text-center">3 electives selected</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
             <div className="w-8 h-8 rounded bg-[#EEF2FF] flex items-center justify-center text-[#5A67D8] shrink-0 mt-0.5">
                <Users className="w-4 h-4" />
              </div>
              <div className="flex flex-col w-full max-w-xs">
                <h4 className="text-xs font-bold text-slate-800 mb-0.5">Faculty Advisor</h4>
                <p className="text-[11px] text-slate-500 mb-3">Assign a faculty advisor for academic guidance.</p>
                <Select onValueChange={val => setValue('placement.facultyAdvisor', val)}>
                  <SelectTrigger><SelectValue placeholder="Select faculty advisor" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rajesh">Dr. Rajesh Sharma</SelectItem>
                    <SelectItem value="anil">Dr. Anil Kumar</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-[10px] text-slate-400 mt-1">Professor, Computer Science</span>
              </div>
          </div>
        </div>
      )}

      {(personType === 'staff' || !personType) && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#EEF2FF] flex items-center justify-center text-[#5A67D8]">
              <User className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-[15px] font-bold text-slate-800">Staff Placement</h3>
              <p className="text-[11px] font-medium text-slate-500">Assign departmental role, responsibilities and teaching load.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-4 h-4 text-[#5A67D8]" />
                <span className="text-[11px] font-bold text-[#5A67D8] uppercase tracking-wider">Department Assignment</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Primary Department" required error={pErrors?.primaryDepartment?.message}>
                  <Select onValueChange={val => setValue('placement.primaryDepartment', val)}>
                    <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cs">Computer Science</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Secondary Department" error={pErrors?.secondaryDepartment?.message}>
                  <Select onValueChange={val => setValue('placement.secondaryDepartment', val)}>
                    <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="it">Information Technology</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-4 h-4 text-[#5A67D8]" />
                <span className="text-[11px] font-bold text-[#5A67D8] uppercase tracking-wider">Role Assignment</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Primary Role" required error={pErrors?.primaryRole?.message}>
                  <Select onValueChange={val => setValue('placement.primaryRole', val)}>
                    <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="assistant">Assistant Professor</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Secondary Role" error={pErrors?.secondaryRole?.message}>
                  <Select onValueChange={val => setValue('placement.secondaryRole', val)}>
                    <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coordinator">Coordinator</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-slate-200 rounded-xl p-5 flex items-start gap-4">
              <div className="w-8 h-8 rounded bg-[#EEF2FF] flex items-center justify-center text-[#5A67D8] shrink-0 mt-0.5">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="flex flex-col flex-1">
                <h4 className="text-xs font-bold text-slate-800 mb-0.5">Subject Assignment</h4>
                <p className="text-[11px] text-slate-500 mb-3">Assign subjects to be taught.</p>
                <Button variant="outline" className="w-full text-[#5A67D8] border-[#5A67D8] hover:bg-[#EEF2FF]">
                  <BookOpen className="w-3.5 h-3.5 mr-2" />
                  Select Subjects
                </Button>
                <span className="text-[10px] font-bold text-[#10B981] mt-2 text-center">5 subjects selected</span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 flex items-start gap-4">
              <div className="w-8 h-8 rounded bg-[#EEF2FF] flex items-center justify-center text-[#5A67D8] shrink-0 mt-0.5">
                <Users className="w-4 h-4" />
              </div>
              <div className="flex flex-col flex-1">
                <h4 className="text-xs font-bold text-slate-800 mb-0.5">Class Assignment</h4>
                <p className="text-[11px] text-slate-500 mb-3">Assign classes for this staff member.</p>
                <Button variant="outline" className="w-full text-[#5A67D8] border-[#5A67D8] hover:bg-[#EEF2FF]">
                  <Users className="w-3.5 h-3.5 mr-2" />
                  Select Classes
                </Button>
                <span className="text-[10px] font-bold text-[#10B981] mt-2 text-center">3 classes selected</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
