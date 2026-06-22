import React from 'react';
import { useWatch } from 'react-hook-form';
import { User, Mail, Phone, Calendar, MapPin } from 'lucide-react';

export function ProfilePreviewCard() {
  const [firstName, lastName, email, phone, dateOfBirth, currentAddress, personType] = useWatch({
    name: [
      'personalInfo.firstName',
      'personalInfo.lastName',
      'personalInfo.email',
      'personalInfo.phone',
      'personalInfo.dateOfBirth',
      'personalInfo.currentAddress',
      'personType.personType'
    ]
  });

  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'New Person';
  
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h4 className="text-sm font-bold text-slate-800 mb-5">Profile Preview</h4>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#5A67D8]">
          <User className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 leading-tight">{fullName}</span>
          <span className="text-[10px] font-bold text-[#5A67D8] bg-[#EEF2FF] px-2 py-0.5 rounded mt-1 w-fit uppercase tracking-wider">
            {personType || 'UNKNOWN'}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span className={`text-[11px] font-medium leading-tight ${email ? 'text-slate-700' : 'text-slate-400 italic'}`}>
            {email || 'Not provided'}
          </span>
        </div>
        
        <div className="flex items-start gap-3">
          <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span className={`text-[11px] font-medium leading-tight ${phone ? 'text-slate-700' : 'text-slate-400 italic'}`}>
            {phone || 'Not provided'}
          </span>
        </div>
        
        <div className="flex items-start gap-3">
          <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span className={`text-[11px] font-medium leading-tight ${dateOfBirth ? 'text-slate-700' : 'text-slate-400 italic'}`}>
            {dateOfBirth || 'Not provided'}
          </span>
        </div>
        
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span className={`text-[11px] font-medium leading-tight ${currentAddress ? 'text-slate-700' : 'text-slate-400 italic'}`}>
            {currentAddress || 'Not provided'}
          </span>
        </div>
      </div>
    </div>
  );
}
