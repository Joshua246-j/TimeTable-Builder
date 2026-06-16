import { z } from 'zod';

export const PersonTypeSchema = z.object({
  personType: z.enum(['student', 'staff'] as const, {
    message: 'Please select a person type to continue.',
  }),
});

export const PersonalInformationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  gender: z.string().min(1, 'Gender is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  
  email: z.string().email('Invalid email address'),
  phoneCode: z.string().default('+91'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  altPhoneCode: z.string().default('+91'),
  altPhone: z.string().optional(),
  
  permanentAddress: z.string().min(1, 'Permanent address is required').max(300),
  sameAsPermanent: z.boolean().default(false),
  currentAddress: z.string().min(1, 'Current address is required').max(300),
  
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  emergencyContactCode: z.string().default('+91'),
  emergencyContactPhone: z.string().min(10, 'Emergency contact is required'),
  
  profilePhoto: z.any().optional(), // File handling
});

export const GuardianSchema = z.object({
  hasExistingGuardian: z.boolean().default(false),
  existingGuardianId: z.string().optional(),
  
  // New Guardian Fields
  guardianName: z.string().optional(),
  relationship: z.string().optional(),
  isPrimary: z.boolean().default(false),
  phoneCode: z.string().default('+91'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  occupation: z.string().optional(),
  address: z.string().max(300).optional(),
});

export const QualificationsSchema = z.object({
  // Student Specific
  schoolInfo: z.object({
    schoolName: z.string(),
    board: z.string(),
    yearOfPassing: z.string(),
    percentage: z.string(),
  }).optional(),
  higherSecondaryInfo: z.object({
    schoolName: z.string(),
    board: z.string(),
    yearOfPassing: z.string(),
    percentage: z.string(),
  }).optional(),
  entranceExam: z.object({
    examName: z.string().optional(),
    authority: z.string().optional(),
    year: z.string().optional(),
    rankScore: z.string().optional(),
  }).optional(),
  
  // Staff Specific
  highestQualification: z.object({
    qualification: z.string(),
    institution: z.string(),
    specialization: z.string(),
    yearOfCompletion: z.string(),
  }).optional(),
  workExperience: z.object({
    organization: z.string(),
    role: z.string(),
    experienceYears: z.string(),
    experienceMonths: z.string(),
  }).optional(),
  reference: z.object({
    name: z.string(),
    designation: z.string(),
    organization: z.string(),
    contactNumber: z.string(),
  }).optional(),
  
  certificates: z.array(z.any()).optional(),
});

export const PlacementSchema = z.object({
  // Student
  academicYear: z.string().optional(),
  semester: z.string().optional(),
  department: z.string().optional(),
  program: z.string().optional(),
  class: z.string().optional(),
  section: z.string().optional(),
  coreSubjects: z.array(z.string()).optional(),
  electiveSubjects: z.array(z.string()).optional(),
  facultyAdvisor: z.string().optional(),
  
  // Staff
  primaryDepartment: z.string().optional(),
  secondaryDepartment: z.string().optional(),
  primaryRole: z.string().optional(),
  secondaryRole: z.string().optional(),
  assignedSubjects: z.array(z.string()).optional(),
  assignedClasses: z.array(z.string()).optional(),
});

// The master schema
export const OnboardingMasterSchema = z.object({
  personType: PersonTypeSchema,
  personalInfo: PersonalInformationSchema,
  guardian: GuardianSchema,
  qualifications: QualificationsSchema,
  placement: PlacementSchema,
});

export type OnboardingFormData = z.infer<typeof OnboardingMasterSchema>;
