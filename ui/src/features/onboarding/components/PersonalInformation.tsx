import React from 'react';
import { useFormContext } from 'react-hook-form';
import { OnboardingFormData } from '../schema';
import { FormSection, FormField } from '@/components/shared';
import { Input } from '@/components/ui/input';
import { User, Phone, MapPin, ShieldCheck, UploadCloud } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function PersonalInformation() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<OnboardingFormData>();
  
  const pErrors = errors.personalInfo;
  
  const sameAsPermanent = watch('personalInfo.sameAsPermanent');

  return (
    <div className="flex flex-col">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-1">Personal Information</h2>
        <p className="text-sm font-medium text-slate-500">Enter the basic personal details of the person.</p>
      </div>

      <FormSection title="Basic Information" icon={<User className="w-4 h-4" />}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField label="First Name" required error={pErrors?.firstName?.message}>
              <Input {...register('personalInfo.firstName')} placeholder="Enter first name" />
            </FormField>
            
            <FormField label="Middle Name" error={pErrors?.middleName?.message}>
              <Input {...register('personalInfo.middleName')} placeholder="Enter middle name" />
            </FormField>
            
            <FormField label="Last Name" required error={pErrors?.lastName?.message}>
              <Input {...register('personalInfo.lastName')} placeholder="Enter last name" />
            </FormField>

            <FormField label="Gender" required error={pErrors?.gender?.message}>
              <Select onValueChange={val => setValue('personalInfo.gender', val, { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Date of Birth" required error={pErrors?.dateOfBirth?.message}>
              <div className="relative">
                <Input type="date" {...register('personalInfo.dateOfBirth')} className="pr-10" />
                {/* <Calendar className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" /> */}
              </div>
            </FormField>

            <FormField label="Blood Group" required error={pErrors?.bloodGroup?.message}>
              <Select onValueChange={val => setValue('personalInfo.bloodGroup', val, { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>
          
          <div className="md:col-span-1">
            <FormField label="Profile Photo">
              <div className="h-full min-h-[120px] rounded-lg border-2 border-dashed border-[#A5B4FC] bg-[#EEF2FF]/30 flex flex-col items-center justify-center cursor-pointer hover:bg-[#EEF2FF]/60 transition-colors">
                <UploadCloud className="w-6 h-6 text-[#5A67D8] mb-2" />
                <span className="text-[11px] font-bold text-[#5A67D8]">Upload Photo</span>
                <span className="text-[9px] font-medium text-slate-400 mt-0.5">JPG, PNG up to 2MB</span>
              </div>
            </FormField>
          </div>
        </div>
      </FormSection>

      <hr className="border-slate-100 my-8" />

      <FormSection title="Contact Information" icon={<Phone className="w-4 h-4" />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField label="Email Address" required error={pErrors?.email?.message}>
            <Input type="email" {...register('personalInfo.email')} placeholder="Enter email address" />
          </FormField>
          
          <FormField label="Phone Number" required error={pErrors?.phone?.message}>
            <div className="flex">
              <Select defaultValue="+91" onValueChange={val => setValue('personalInfo.phoneCode', val)}>
                <SelectTrigger className="w-20 rounded-r-none border-r-0 focus:z-10 bg-slate-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+91">+91</SelectItem>
                  <SelectItem value="+1">+1</SelectItem>
                  <SelectItem value="+44">+44</SelectItem>
                </SelectContent>
              </Select>
              <Input {...register('personalInfo.phone')} className="rounded-l-none focus:z-10 flex-1" placeholder="Enter phone number" />
            </div>
          </FormField>
          
          <FormField label="Alternate Phone" error={pErrors?.altPhone?.message}>
            <div className="flex">
              <Select defaultValue="+91" onValueChange={val => setValue('personalInfo.altPhoneCode', val)}>
                <SelectTrigger className="w-20 rounded-r-none border-r-0 focus:z-10 bg-slate-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+91">+91</SelectItem>
                  <SelectItem value="+1">+1</SelectItem>
                  <SelectItem value="+44">+44</SelectItem>
                </SelectContent>
              </Select>
              <Input {...register('personalInfo.altPhone')} className="rounded-l-none focus:z-10 flex-1" placeholder="Enter alternate number" />
            </div>
          </FormField>
        </div>
      </FormSection>

      <hr className="border-slate-100 my-8" />

      <FormSection title="Address Information" icon={<MapPin className="w-4 h-4" />}>
        <div className="flex justify-end mb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="rounded border-slate-300 text-[#5A67D8] focus:ring-[#5A67D8]" 
              {...register('personalInfo.sameAsPermanent')}
            />
            <span className="text-[11px] font-bold text-slate-500">Same as permanent address</span>
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Permanent Address" required error={pErrors?.permanentAddress?.message}>
            <textarea 
              {...register('personalInfo.permanentAddress')} 
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              placeholder="Enter permanent address"
            />
            <div className="text-[10px] text-slate-400 text-right mt-1">0/300</div>
          </FormField>
          
          <FormField label="Current Address" required error={pErrors?.currentAddress?.message}>
            <textarea 
              {...register('personalInfo.currentAddress')} 
              disabled={sameAsPermanent}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              placeholder="Enter current address"
            />
            <div className="text-[10px] text-slate-400 text-right mt-1">0/300</div>
          </FormField>
        </div>
      </FormSection>

      <hr className="border-slate-100 my-8" />

      <FormSection title="Emergency Contact" icon={<ShieldCheck className="w-4 h-4" />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField label="Father's Name" error={pErrors?.fatherName?.message}>
            <Input {...register('personalInfo.fatherName')} placeholder="Enter father's name" />
          </FormField>
          
          <FormField label="Mother's Name" error={pErrors?.motherName?.message}>
            <Input {...register('personalInfo.motherName')} placeholder="Enter mother's name" />
          </FormField>
          
          <FormField label="Emergency Contact Number" required error={pErrors?.emergencyContactPhone?.message}>
            <div className="flex">
              <Select defaultValue="+91" onValueChange={val => setValue('personalInfo.emergencyContactCode', val)}>
                <SelectTrigger className="w-20 rounded-r-none border-r-0 focus:z-10 bg-slate-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+91">+91</SelectItem>
                  <SelectItem value="+1">+1</SelectItem>
                  <SelectItem value="+44">+44</SelectItem>
                </SelectContent>
              </Select>
              <Input {...register('personalInfo.emergencyContactPhone')} className="rounded-l-none focus:z-10 flex-1" placeholder="Enter emergency number" />
            </div>
          </FormField>
        </div>
      </FormSection>

    </div>
  );
}
