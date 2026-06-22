import React from 'react';
import { useFormContext } from 'react-hook-form';
import { OnboardingFormData } from '../schema';
import { FormField } from '@/components/shared';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, Briefcase, FileText, UploadCloud, BookOpen, User, Users } from 'lucide-react';

export function Qualifications() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<OnboardingFormData>();
  
  const personType = watch('personType.personType');
  const qErrors = errors.qualifications;

  return (
    <div className="flex flex-col">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-1">Qualifications</h2>
        <p className="text-sm font-medium text-slate-500">Provide academic and educational qualifications.</p>
      </div>

      {(personType === 'student' || !personType) && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#EEF2FF] flex items-center justify-center text-[#5A67D8]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-[15px] font-bold text-slate-800">Student Section</h3>
              <p className="text-[11px] font-medium text-slate-500">Provide academic and educational qualifications.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-[#5A67D8]" />
            <span className="text-[11px] font-bold text-[#5A67D8] uppercase tracking-wider">School Information</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <FormField label="School Name" required error={qErrors?.schoolInfo?.schoolName?.message}>
              <Input {...register('qualifications.schoolInfo.schoolName')} placeholder="Enter school name" />
            </FormField>
            <FormField label="Board" required error={qErrors?.schoolInfo?.board?.message}>
              <Select onValueChange={val => setValue('qualifications.schoolInfo.board', val)}>
                <SelectTrigger><SelectValue placeholder="Select board" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cbse">CBSE</SelectItem>
                  <SelectItem value="icse">ICSE</SelectItem>
                  <SelectItem value="state">State Board</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Year of Passing" required error={qErrors?.schoolInfo?.yearOfPassing?.message}>
              <Select onValueChange={val => setValue('qualifications.schoolInfo.yearOfPassing', val)}>
                <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Percentage" required error={qErrors?.schoolInfo?.percentage?.message}>
              <div className="relative">
                <Input {...register('qualifications.schoolInfo.percentage')} placeholder="Enter percentage" className="pr-8" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">%</span>
              </div>
            </FormField>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-[#5A67D8]" />
            <span className="text-[11px] font-bold text-[#5A67D8] uppercase tracking-wider">Higher Secondary Information</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <FormField label="School Name" required error={qErrors?.higherSecondaryInfo?.schoolName?.message}>
              <Input {...register('qualifications.higherSecondaryInfo.schoolName')} placeholder="Enter school name" />
            </FormField>
            <FormField label="Board" required error={qErrors?.higherSecondaryInfo?.board?.message}>
              <Select onValueChange={val => setValue('qualifications.higherSecondaryInfo.board', val)}>
                <SelectTrigger><SelectValue placeholder="Select board" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cbse">CBSE</SelectItem>
                  <SelectItem value="icse">ICSE</SelectItem>
                  <SelectItem value="state">State Board</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Year of Passing" required error={qErrors?.higherSecondaryInfo?.yearOfPassing?.message}>
              <Select onValueChange={val => setValue('qualifications.higherSecondaryInfo.yearOfPassing', val)}>
                <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Percentage" required error={qErrors?.higherSecondaryInfo?.percentage?.message}>
              <div className="relative">
                <Input {...register('qualifications.higherSecondaryInfo.percentage')} placeholder="Enter percentage" className="pr-8" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">%</span>
              </div>
            </FormField>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-[#5A67D8]" />
            <span className="text-[11px] font-bold text-[#5A67D8] uppercase tracking-wider">Entrance Examination Details</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <FormField label="Exam Name" error={qErrors?.entranceExam?.examName?.message}>
              <Input {...register('qualifications.entranceExam.examName')} placeholder="Enter exam name" />
            </FormField>
            <FormField label="Conducting Authority" error={qErrors?.entranceExam?.authority?.message}>
              <Input {...register('qualifications.entranceExam.authority')} placeholder="Enter authority" />
            </FormField>
            <FormField label="Year" error={qErrors?.entranceExam?.year?.message}>
              <Select onValueChange={val => setValue('qualifications.entranceExam.year', val)}>
                <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Rank / Score" error={qErrors?.entranceExam?.rankScore?.message}>
              <Input {...register('qualifications.entranceExam.rankScore')} placeholder="Enter rank or score" />
            </FormField>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <UploadCloud className="w-4 h-4 text-[#5A67D8]" />
            <span className="text-[11px] font-bold text-[#5A67D8] uppercase tracking-wider">Certificate Uploads</span>
          </div>

          <div className="flex items-center justify-between border-2 border-dashed border-[#A5B4FC] bg-[#EEF2FF]/30 rounded-xl p-6">
            <span className="text-xs font-medium text-slate-500">Upload relevant academic certificates and mark sheets.</span>
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:bg-[#EEF2FF]/80 p-3 rounded-lg border border-[#C7D2FE] transition-colors">
              <div className="flex items-center gap-2 text-[#5A67D8] font-bold text-xs">
                <UploadCloud className="w-4 h-4" />
                Upload Certificates
              </div>
              <span className="text-[9px] font-medium text-slate-400">PDF, JPG, PNG up to 5MB</span>
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
              <h3 className="text-[15px] font-bold text-slate-800">Staff Section</h3>
              <p className="text-[11px] font-medium text-slate-500">Provide professional and experience details.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-4 h-4 text-[#5A67D8]" />
            <span className="text-[11px] font-bold text-[#5A67D8] uppercase tracking-wider">Highest Qualification</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <FormField label="Select qualification" required error={qErrors?.highestQualification?.qualification?.message}>
              <Select onValueChange={val => setValue('qualifications.highestQualification.qualification', val)}>
                <SelectTrigger><SelectValue placeholder="Select qualification" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="phd">Ph.D</SelectItem>
                  <SelectItem value="pg">Post Graduate</SelectItem>
                  <SelectItem value="ug">Under Graduate</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Institution" required error={qErrors?.highestQualification?.institution?.message}>
              <Input {...register('qualifications.highestQualification.institution')} placeholder="Enter institution name" />
            </FormField>
            <FormField label="Specialization" required error={qErrors?.highestQualification?.specialization?.message}>
              <Input {...register('qualifications.highestQualification.specialization')} placeholder="Enter specialization" />
            </FormField>
            <FormField label="Year of Completion" required error={qErrors?.highestQualification?.yearOfCompletion?.message}>
              <Select onValueChange={val => setValue('qualifications.highestQualification.yearOfCompletion', val)}>
                <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2020">2020</SelectItem>
                  <SelectItem value="2019">2019</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-4 h-4 text-[#5A67D8]" />
            <span className="text-[11px] font-bold text-[#5A67D8] uppercase tracking-wider">Work Experience</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <FormField label="Organization" required error={qErrors?.workExperience?.organization?.message}>
              <Input {...register('qualifications.workExperience.organization')} placeholder="Enter organization" />
            </FormField>
            <FormField label="Role / Designation" required error={qErrors?.workExperience?.role?.message}>
              <Input {...register('qualifications.workExperience.role')} placeholder="Enter role / designation" />
            </FormField>
            <FormField label="Experience Years" required error={qErrors?.workExperience?.experienceYears?.message}>
              <div className="relative">
                <Input {...register('qualifications.workExperience.experienceYears')} placeholder="Enter years" className="pr-12" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">Years</span>
              </div>
            </FormField>
            <FormField label="Experience Months" required error={qErrors?.workExperience?.experienceMonths?.message}>
              <div className="relative">
                <Input {...register('qualifications.workExperience.experienceMonths')} placeholder="Enter months" className="pr-14" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">Months</span>
              </div>
            </FormField>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-[#5A67D8]" />
            <span className="text-[11px] font-bold text-[#5A67D8] uppercase tracking-wider">References</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FormField label="Reference Name" required error={qErrors?.reference?.name?.message}>
              <Input {...register('qualifications.reference.name')} placeholder="Enter reference name" />
            </FormField>
            <FormField label="Designation" required error={qErrors?.reference?.designation?.message}>
              <Input {...register('qualifications.reference.designation')} placeholder="Enter designation" />
            </FormField>
            <FormField label="Organization" required error={qErrors?.reference?.organization?.message}>
              <Input {...register('qualifications.reference.organization')} placeholder="Enter organization" />
            </FormField>
            <FormField label="Contact Number" required error={qErrors?.reference?.contactNumber?.message}>
              <Input {...register('qualifications.reference.contactNumber')} placeholder="Enter contact number" />
            </FormField>
          </div>

        </div>
      )}

    </div>
  );
}

