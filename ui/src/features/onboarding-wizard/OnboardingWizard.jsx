'use client';
import { useState, useCallback } from 'react';
import styles from './OnboardingWizard.module.css';
import AppHeader from './AppHeader';
import StepProgress from './StepProgress';
import StepPersonType from './steps/StepPersonType';
import StepPersonalInfo from './steps/StepPersonalInfo';
import StepGuardian from './steps/StepGuardian';
import StepQualifications from './steps/StepQualifications';
import StepPlacement from './steps/StepPlacement';
import StepCredentials from './steps/StepCredentials';
import StepReview from './steps/StepReview';
import SuccessModal from './modals/SuccessModal';
import CancelModal from './modals/CancelModal';

import './onboarding-wizard.css';

const TOTAL_STEPS = 7;

const STEP_NAMES = ['Person Type','Personal Information','Guardian','Academic Qualifications','Academic Placement','Credentials','Review'];

const initialFormData = {
  personType: 'student',

  // Step 2 — Personal Info
  firstName: '', middleName: '', lastName: '', gender: '', dob: '', bloodGroup: '',
  profilePhotoUrl: '',
  email: '', phone: '', phoneCode: '+91', alternatePhone: '', altCode: '+91',
  permanentAddress: '', currentAddress: '', sameAsPermAddress: false,
  fatherName: '', motherName: '', emergencyPhone: '', emergCode: '+91',

  // Step 3 — Guardian
  hasGuardian: true,
  searchMode: 'phone',      // 'phone' | 'email'
  linkedGuardian: null,      // { name, phone, email, relation, isPrimary }
  gName: '', gRelation: '', gEmail: '', gPhone: '', gPhoneCode: '+91',
  gOccupation: '', gAddress: '', gPrimary: false,

  // Step 4 — Qualifications
  secSchoolName: '', secBoard: '', secYearOfPassing: '', secPercentage: '',
  hsSchoolName: '', hsBoard: '', hsYearOfPassing: '', hsPercentage: '',
  examName: '', examRegNo: '', examRank: '', examScore: '', examYear: '',
  requiredDocs: { class10: null, class12: null, transferCert: null },
  optionalDocs: { entranceScore: null, community: null, income: null, migration: null, otherDocs: null },

  // Step 5 — Placement
  department: '', program: '', academicYear: '', semester: '',
  className: '', section: '',
  coreSubjects: [],
  electiveSubjects: [],
  facultyAdvisor: '',
  hostelBlock: '', hostelRoom: '',
  busRoute: '', boardingPoint: '',

  // Step 6 — Credentials
  username: '', password: '', confirmPass: '',
  gUsername: '', gPassword: '', gConfirmPass: '',
  autoGenerate: true, forcePasswordReset: true,
  deliveryEmail: true, deliverySms: true, deliveryWhatsapp: true,
};

export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState('forward');
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  }, []);

  const validate = useCallback((step) => {
    const errs = {};
    const d = formData;

    if (step === 2) {
      if (d.email && d.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) {
        errs.email = 'Enter a valid email';
      }
    }
    if (step === 6) {
      if (d.password && d.password.length < 8) errs.password = 'Min 8 characters';
      if (d.confirmPass && d.password !== d.confirmPass) errs.confirmPass = 'Passwords do not match';
      
      if (d.gName || d.hasGuardian) {
        if (d.gPassword && d.gPassword.length < 8) errs.gPassword = 'Min 8 characters';
        if (d.gConfirmPass && d.gPassword !== d.gConfirmPass) errs.gConfirmPass = 'Passwords do not match';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [formData]);

  const goToStep = useCallback((target, dir = 'forward') => {
    setDirection(dir);
    setErrors({});
    setCurrentStep(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleContinue = useCallback(() => {
    if (currentStep === TOTAL_STEPS) {
      setSubmitting(true);
      setTimeout(() => {
        setSubmitting(false);
        setShowSuccess(true);
      }, 1800);
      return;
    }
    if (!validate(currentStep)) return;
    goToStep(currentStep + 1, 'forward');
  }, [currentStep, validate, goToStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) goToStep(currentStep - 1, 'back');
  }, [currentStep, goToStep]);

  const handleReset = useCallback(() => {
    setCurrentStep(1);
    setFormData(initialFormData);
    setErrors({});
    setShowSuccess(false);
    setShowCancel(false);
  }, []);

  const stepProps = { formData, updateField, errors, currentStep, totalSteps: TOTAL_STEPS };

  const stepPanels = [
    <StepPersonType key={1} personType={formData.personType} onSelect={(t) => updateField('personType', t)} />,
    <StepPersonalInfo key={2} {...stepProps} />,
    <StepGuardian key={3} {...stepProps} />,
    <StepQualifications key={4} {...stepProps} />,
    <StepPlacement key={5} {...stepProps} />,
    <StepCredentials key={6} {...stepProps} />,
    <StepReview key={7} {...stepProps} onEdit={(s) => goToStep(s, 'back')} />,
  ];

  const isLastStep = currentStep === TOTAL_STEPS;

  return (
    <div className="onboarding-wrapper">
      <AppHeader />

      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <a href="#" className={styles.breadcrumbLink}>Dashboard</a>
        <span className={styles.breadcrumbSep}>›</span>
        <a href="#" className={styles.breadcrumbLink}>People</a>
        <span className={styles.breadcrumbSep}>›</span>
        {currentStep > 1 ? (
          <>
            <a href="#" className={styles.breadcrumbLink} onClick={(e) => { e.preventDefault(); goToStep(1, 'back'); }}>Person Onboarding</a>
            <span className={styles.breadcrumbSep}>›</span>
            <span className={styles.breadcrumbCurrent}>{STEP_NAMES[currentStep - 1]}</span>
          </>
        ) : (
          <span className={styles.breadcrumbCurrent}>Person Onboarding</span>
        )}
      </nav>

      <main className={styles.mainContainer}>
        <div className={styles.onboardingCard}>
          <StepProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} onStepClick={(s) => { if (s < currentStep) goToStep(s, 'back'); }} />

          <div className={`${styles.stepContentArea} ${currentStep === 1 ? styles.bgWhite : styles.bgGray}`}>
            <div
              key={currentStep}
              className={`${styles.stepPanel} ${direction === 'back' ? styles.slideBack : styles.slideForward}`}
            >
              {stepPanels[currentStep - 1]}
            </div>
          </div>

          {/* Footer */}
          <div className={styles.cardFooter}>
            <div className={styles.footerLeftBtns}>
              {currentStep > 1 && (
                <button className="btn btn-back" onClick={handleBack}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                  Back
                </button>
              )}
              {currentStep === 1 && (
                <button className="btn btn-cancel" onClick={() => setShowCancel(true)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  Cancel
                </button>
              )}
            </div>
            <div className={styles.footerRightBtns}>
              {currentStep > 1 && (
                <button className={`btn ${styles.btnDraft}`} onClick={() => alert('Draft saved!')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                  Save Draft
                </button>
              )}
              <button className={`btn ${isLastStep ? styles.btnComplete : 'btn-continue'}`} onClick={handleContinue} disabled={submitting}>
                {submitting ? (
                  <>
                    <svg className="spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    Submitting…
                  </>
                ) : isLastStep ? (
                  <>
                    Complete Onboarding
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </>
                ) : (
                  <>
                    Continue
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {showSuccess && <SuccessModal onAddAnother={handleReset} onDashboard={() => { setShowSuccess(false); }} />}
      {showCancel  && <CancelModal onKeepGoing={() => setShowCancel(false)} onConfirm={() => { setShowCancel(false); handleReset(); }} />}
    </div>
  );
}
