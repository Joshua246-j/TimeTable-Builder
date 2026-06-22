import React from 'react';
import { useFormContext } from 'react-hook-form';
import { OnboardingFormData } from '../schema';
import { FormField } from '@/components/shared';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Users, Search, Link as LinkIcon, UserPlus, Phone, Mail } from 'lucide-react';

export function GuardianManagement() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<OnboardingFormData>();
  
  const gErrors = errors.guardian;
  const hasExisting = watch('guardian.hasExistingGuardian');
  const existingGuardianId = watch('guardian.existingGuardianId');
  const isPrimary = watch('guardian.isPrimary');

  return (
    <div className="flex flex-col">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-1">Guardian Management</h2>
        <p className="text-sm font-medium text-slate-500">Link an existing guardian or create a new profile.</p>
      </div>

      {/* Existing Guardian Toggle Card */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-5 mb-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#EEF2FF] flex items-center justify-center text-[#5A67D8]">
            <Users className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-slate-800">Existing Guardian</h3>
            <p className="text-[11px] font-medium text-slate-500">Link this person to an existing guardian in the system.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold text-slate-700">This family already has a guardian account</span>
          <Switch 
            checked={hasExisting}
            onCheckedChange={val => setValue('guardian.hasExistingGuardian', val)}
            className="data-[state=checked]:bg-[#5A67D8]"
          />
        </div>
      </div>

      {hasExisting ? (
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-sm">
          <h4 className="text-sm font-bold text-slate-800 mb-4">Search Guardian</h4>
          
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="searchType" className="text-[#5A67D8] focus:ring-[#5A67D8]" defaultChecked />
              <span className="text-[11px] font-semibold text-slate-700">Search by Phone</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="searchType" className="text-[#5A67D8] focus:ring-[#5A67D8]" />
              <span className="text-[11px] font-semibold text-slate-700">Search by Email</span>
            </label>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-1">
              <Select defaultValue="+91">
                <SelectTrigger className="w-20 rounded-r-none border-r-0 focus:z-10 bg-slate-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+91">+91</SelectItem>
                  <SelectItem value="+1">+1</SelectItem>
                </SelectContent>
              </Select>
              <Input className="rounded-l-none focus:z-10 flex-1" placeholder="Enter guardian phone number" />
            </div>
            <Button className="bg-[#5A67D8] hover:bg-[#4C51BF] text-white px-6">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          <div className="mt-8">
            <h5 className="text-[11px] font-bold text-slate-800 mb-3 uppercase tracking-wider">Search Results</h5>
            
            <div className="border border-slate-200 rounded-lg p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden text-slate-500">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 text-sm">Ramesh Kumar</span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3"/> +91 98765 43210</span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1"><Mail className="w-3 h-3"/> ramesh.kumar@email.com</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Relationship</span>
                  <span className="text-xs font-bold text-slate-800">Father</span>
                </div>
                {existingGuardianId === 'g1' ? (
                  <Button variant="outline" className="border-[#10B981] text-[#10B981] hover:bg-[#F0FDF4] hover:text-[#10B981] h-8 text-xs" onClick={() => setValue('guardian.existingGuardianId', undefined)}>
                    Linked
                  </Button>
                ) : (
                  <Button variant="outline" className="text-slate-600 h-8 text-xs" onClick={() => setValue('guardian.existingGuardianId', 'g1')}>
                    <LinkIcon className="w-3.5 h-3.5 mr-1.5" />
                    Link Guardian
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-center my-6">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">OR</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#EEF2FF] flex items-center justify-center text-[#5A67D8]">
                <UserPlus className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-bold text-slate-800">Add Guardian</h3>
                <p className="text-[11px] font-medium text-slate-500">Create a new guardian profile for this person.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormField label="Guardian Name" required error={gErrors?.guardianName?.message}>
                <Input {...register('guardian.guardianName')} placeholder="Enter guardian full name" />
              </FormField>

              <div className="flex gap-6">
                <FormField label="Relationship" required className="flex-1" error={gErrors?.relationship?.message}>
                  <Select onValueChange={val => setValue('guardian.relationship', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="father">Father</SelectItem>
                      <SelectItem value="mother">Mother</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Primary Guardian">
                  <div className="flex items-center h-10">
                    <Switch 
                      checked={isPrimary}
                      onCheckedChange={val => setValue('guardian.isPrimary', val)}
                      className="data-[state=checked]:bg-[#5A67D8]"
                    />
                  </div>
                </FormField>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <FormField label="Phone Number" required error={gErrors?.phone?.message}>
                <div className="flex">
                  <Select defaultValue="+91" onValueChange={val => setValue('guardian.phoneCode', val)}>
                    <SelectTrigger className="w-20 rounded-r-none border-r-0 focus:z-10 bg-slate-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+91">+91</SelectItem>
                      <SelectItem value="+1">+1</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input {...register('guardian.phone')} className="rounded-l-none focus:z-10 flex-1" placeholder="Enter phone number" />
                </div>
              </FormField>

              <FormField label="Email Address" error={gErrors?.email?.message}>
                <Input type="email" {...register('guardian.email')} placeholder="Enter email address" />
              </FormField>

              <FormField label="Occupation" error={gErrors?.occupation?.message}>
                <Input {...register('guardian.occupation')} placeholder="Enter occupation" />
              </FormField>
            </div>

            <FormField label="Address" required error={gErrors?.address?.message}>
              <textarea 
                {...register('guardian.address')} 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                placeholder="Enter full address"
              />
              <div className="text-[10px] text-slate-400 text-right mt-1">0/300</div>
            </FormField>
          </div>
        </>
      )}

    </div>
  );
}

