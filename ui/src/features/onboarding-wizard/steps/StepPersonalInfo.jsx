/* eslint-disable @next/next/no-img-element */
'use client';
import { useRef, useCallback } from 'react';
import styles from './StepPersonalInfo.module.css';

/* ─────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────── */
const IcoMail = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const IcoPhone = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const IcoCake = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IcoMapPin = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IcoUser = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IcoShield = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;

/* ─────────────────────────────────────────────────────
   SMALL REUSABLE PIECES
───────────────────────────────────────────────────── */
function Fl({ label, required, error, children }) {
  return (
    <div className={styles.fl}>
      {label && <label className={styles.flLabel}>{label}{required && <span className={styles.ast}> *</span>}</label>}
      {children}
      {error && <span className={styles.flErr}>{error}</span>}
    </div>
  );
}

function SecHead({ icon, title }) {
  return (
    <div className={styles.secHead}>
      <span className={styles.secIcon}>{icon}</span>
      <span className={styles.secTitle}>{title}</span>
    </div>
  );
}

function PhoneFld({ value, onChange, code, onCode, error }) {
  return (
    <div className={`${styles.phoneWrap} ${error ? styles.phoneErr : ''}`}>
      <select className={styles.phoneCode} value={code} onChange={e => onCode(e.target.value)}>
        <option>+91</option><option>+1</option><option>+44</option><option>+971</option><option>+61</option>
      </select>
      <input className={styles.phoneNum} type="tel" placeholder="Enter phone number"
        value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   SIDEBAR CARDS
───────────────────────────────────────────────────── */
function ProfilePreview({ fd }) {
  const name = [fd.firstName, fd.lastName].filter(Boolean).join(' ') || 'New Person';
  const rows = [
    { ico: <IcoMail />, lbl: 'Email',         val: fd.email },
    { ico: <IcoPhone />, lbl: 'Phone',         val: fd.phone },
    { ico: <IcoCake />, lbl: 'Date of Birth', val: fd.dob   },
    { ico: <IcoMapPin />, lbl: 'Address',       val: fd.permanentAddress },
  ];
  return (
    <div className={styles.card}>
      <p className={styles.cardTitle}>Profile Preview</p>
      <div className={styles.ppAvatar}>
        {fd.profilePhotoUrl
          ? <img src={fd.profilePhotoUrl} alt="" className={styles.ppImg}/>
          : <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        }
      </div>
      <p className={styles.ppName}>{name}</p>
      <span className={styles.ppBadge}>{fd.personType === 'student' ? 'Student' : 'Staff'}</span>
      <div className={styles.ppRows}>
        {rows.map(r => (
          <div key={r.lbl} className={styles.ppRow}>
            <span className={styles.ppIco}>{r.ico}</span>
            <span className={styles.ppLbl}>{r.lbl}</span>
            <span className={`${styles.ppVal} ${!r.val ? styles.ppNone : ''}`}>{r.val || 'Not provided'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DonutRing({ pct }) {
  const r = 27; const c = 2 * Math.PI * r;
  const d = Math.min(c, (pct / 100) * c);
  return (
    <svg width="68" height="68" viewBox="0 0 68 68" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="34" cy="34" r={r} fill="none" stroke="#e5e7eb" strokeWidth="8"/>
      <circle cx="34" cy="34" r={r} fill="none" stroke="var(--success)" strokeWidth="8"
        strokeDasharray={`${d} ${c - d}`} strokeLinecap="round"/>
    </svg>
  );
}

function CompletionCard({ currentStep, totalSteps }) {
  const done = currentStep - 1, prog = 1, pend = totalSteps - currentStep;
  const pct  = Math.round((done / totalSteps) * 100);
  return (
    <div className={styles.card}>
      <p className={styles.cardTitle}>Completion Status</p>
      <div className={styles.compRow}>
        <div className={styles.donutBox}>
          <DonutRing pct={pct}/>
          <span className={styles.donutPct}>{pct}%</span>
        </div>
        <div className={styles.compList}>
          {[
            { dot: styles.dotDone, lbl: 'Completed',   val: `${done}/${totalSteps}` },
            { dot: styles.dotProg, lbl: 'In-Progress', val: `${prog}/${totalSteps}` },
            { dot: styles.dotPend, lbl: 'Pending',     val: `${pend}/${totalSteps}` },
          ].map(i => (
            <div key={i.lbl} className={styles.compItem}>
              <span className={`${styles.dot} ${i.dot}`}/>
              <span className={styles.compLbl}>{i.lbl}</span>
              <span className={styles.compVal}>{i.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ValidationCard({ errors }) {
  const bad = Object.keys(errors).length > 0;
  return (
    <div className={styles.card}>
      <p className={styles.cardTitle}>Validation Status</p>
      <div className={`${styles.vBox} ${bad ? styles.vBad : styles.vOk}`}>
        <span className={styles.vIco}>{bad ? '⚠' : '✓'}</span>
        <span className={styles.vTxt}>
          {bad ? `${Object.keys(errors).length} error(s) in current step.` : 'All good! No validation errors in current step.'}
        </span>
      </div>
    </div>
  );
}

function FieldSummaryCard({ fd }) {
  const secs = [
    { ico: <IcoUser />, lbl: 'Basic Information',   keys: ['firstName','lastName','gender','dob'] },
    { ico: <IcoPhone />, lbl: 'Contact Information',  keys: ['email','phone'] },
    { ico: <IcoMapPin />, lbl: 'Address Information',  keys: ['permanentAddress'] },
    { ico: <IcoShield />, lbl: 'Emergency Contact',    keys: ['emergencyPhone'] },
  ];
  const total = secs.reduce((s, x) => s + x.keys.length, 0);
  const filledTotal = secs.reduce((s, x) => s + x.keys.filter(k => !!fd[k]).length, 0);
  
  return (
    <div className={styles.card}>
      <div className={styles.reqHead}>
        <p className={styles.cardTitle} style={{ marginBottom: 0 }}>Fields Completed</p>
        <span className={styles.reqBadge}>{filledTotal}/{total} Filled</span>
      </div>
      <div className={styles.reqList}>
        {secs.map(s => {
          const filled = s.keys.filter(k => !!fd[k]).length;
          const totalKeys = s.keys.length;
          return (
            <div key={s.lbl} className={styles.reqItem}>
              <span className={styles.reqIco}>{s.ico}</span>
              <span className={styles.reqLbl}>{s.lbl}</span>
              {filled === totalKeys
                ? <span className={styles.reqDone}>✓ Done</span>
                : <span className={styles.reqMiss}>{filled}/{totalKeys} filled</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────── */
export default function StepPersonalInfo({ formData: fd, updateField: upd, errors, currentStep, totalSteps }) {
  const photoRef = useRef(null);

  const handlePhoto = useCallback(e => {
    const f = e.target.files?.[0];
    if (f) upd('profilePhotoUrl', URL.createObjectURL(f));
  }, [upd]);

  const onSame = useCallback(checked => {
    upd('sameAsPermAddress', checked);
    if (checked) upd('currentAddress', fd.permanentAddress);
  }, [upd, fd.permanentAddress]);

  const i = (key, rest = {}) => ({
    className: `${styles.inp} ${errors[key] ? styles.inpErr : ''} ${!fd[key] && rest.type === 'date' ? styles.inpPlaceholder : ''}`,
    value: fd[key] || '',
    onChange: e => upd(key, e.target.value),
    ...rest,
  });

  const s = key => ({
    className: `${styles.inp} ${styles.sel} ${errors[key] ? styles.inpErr : ''} ${!fd[key] ? styles.inpPlaceholder : ''}`,
    value: fd[key] || '',
    onChange: e => upd(key, e.target.value),
  });

  return (
    <div className={styles.layout}>

      {/* ══════════ LEFT FORM ══════════ */}
      <div className={`${styles.formCol} ${styles.sec}`}>

        <div className={styles.formHead} style={{ marginBottom: '24px' }}>
          <h2 className={styles.formTitle}>Personal Information</h2>
          <p className={styles.formSub}>Enter the basic personal details of the person.</p>
        </div>

        {/* ── Basic Information ── */}
        <div style={{ marginBottom: '24px' }}>
          <SecHead icon={
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          } title="Basic Information"/>

          <div className={styles.basicInfoLayout}>
            <div className={styles.basicInfoFields}>
              <div className={styles.g3}>
                <Fl label="First Name" error={errors.firstName}>
                  <input {...i('firstName')} type="text" placeholder="Enter first name"/>
                </Fl>
                <Fl label="Middle Name">
                  <input {...i('middleName')} type="text" placeholder="Enter middle name"/>
                </Fl>
                <Fl label="Last Name" error={errors.lastName}>
                  <input {...i('lastName')} type="text" placeholder="Enter last name"/>
                </Fl>
              </div>
              <div className={styles.g3} style={{ marginBottom: 0 }}>
                <Fl label="Gender" error={errors.gender}>
                  <select {...s('gender')}>
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not">Prefer not to say</option>
                  </select>
                </Fl>
                <Fl label="Date of Birth" error={errors.dob}>
                  <input {...i('dob')} type="date"/>
                </Fl>
                <Fl label="Blood Group">
                  <select {...s('bloodGroup')}>
                    <option value="">Select blood group</option>
                    {['A+','A−','B+','B−','AB+','AB−','O+','O−'].map(b => <option key={b}>{b}</option>)}
                  </select>
                </Fl>
              </div>
            </div>
            
            <div className={styles.basicInfoPhotoBox}>
              <Fl label="Profile Photo">
                <div className={styles.photoBox} onClick={() => photoRef.current?.click()} tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && photoRef.current?.click()}>
                  {fd.profilePhotoUrl
                    ? <img src={fd.profilePhotoUrl} alt="" className={styles.photoImg}/>
                    : <>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                        </svg>
                        <span className={styles.photoLabel}>Upload Photo</span>
                        <span className={styles.photoSub}>PNG, JPG up to 5MB</span>
                      </>
                  }
                </div>
                <input ref={photoRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handlePhoto}/>
              </Fl>
            </div>
          </div>
        </div>

        {/* ── Contact Information ── */}
        <div style={{ marginBottom: '24px' }}>
          <SecHead icon={
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.37 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.29 6.29l.98-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          } title="Contact Information"/>
          <div className={styles.g3}>
            <Fl label="Email Address" error={errors.email}>
              <input {...i('email')} type="email" placeholder="Enter email address"/>
            </Fl>
            <Fl label="Phone Number" error={errors.phone}>
              <PhoneFld value={fd.phone} onChange={v => upd('phone', v)}
                code={fd.phoneCode || '+91'} onCode={v => upd('phoneCode', v)} error={errors.phone}/>
            </Fl>
            <Fl label="Alternate Phone">
              <PhoneFld value={fd.alternatePhone} onChange={v => upd('alternatePhone', v)}
                code={fd.altCode || '+91'} onCode={v => upd('altCode', v)} error={false}/>
            </Fl>
          </div>
        </div>

        {/* ── Address Information ── */}
        <div style={{ marginBottom: '24px' }}>
          <div className={styles.secHeadRow}>
            <SecHead icon={
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            } title="Address Information"/>
            <label className={styles.sameLabel}>
              <input type="checkbox" className={styles.sameChk}
                checked={fd.sameAsPermAddress}
                onChange={e => onSame(e.target.checked)}/>
              <span className={styles.sameBox}>{fd.sameAsPermAddress && '✓'}</span>
              <span className={styles.sameTxt}>Same as permanent address</span>
            </label>
          </div>
          <div className={styles.g2}>
            <Fl label="Permanent Address" error={errors.permanentAddress}>
              <textarea className={`${styles.inp} ${styles.ta} ${errors.permanentAddress ? styles.inpErr : ''}`}
                placeholder="Enter permanent address" value={fd.permanentAddress}
                onChange={e => { upd('permanentAddress', e.target.value); if (fd.sameAsPermAddress) upd('currentAddress', e.target.value); }}/>
            </Fl>
            <Fl label="Current Address">
              <textarea className={`${styles.inp} ${styles.ta} ${fd.sameAsPermAddress ? styles.inpDis : ''}`}
                placeholder="Enter current address" value={fd.currentAddress}
                disabled={fd.sameAsPermAddress}
                onChange={e => upd('currentAddress', e.target.value)}/>
            </Fl>
          </div>
        </div>

        {/* ── Emergency Contact ── */}
        <div>
          <SecHead icon={
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          } title="Emergency Contact"/>
          <div className={styles.g3}>
            <Fl label="Father's Name">
              <input {...i('fatherName')} type="text" placeholder="Enter father's name"/>
            </Fl>
            <Fl label="Mother's Name">
              <input {...i('motherName')} type="text" placeholder="Enter mother's name"/>
            </Fl>
            <Fl label="Emergency Contact Number" error={errors.emergencyPhone}>
              <PhoneFld value={fd.emergencyPhone} onChange={v => upd('emergencyPhone', v)}
                code={fd.emergCode || '+91'} onCode={v => upd('emergCode', v)} error={errors.emergencyPhone}/>
            </Fl>
          </div>
        </div>

      </div>

      {/* ══════════ RIGHT SIDEBAR ══════════ */}
      <aside className={styles.sidebar}>
        <ProfilePreview fd={fd}/>
        <CompletionCard currentStep={currentStep} totalSteps={totalSteps}/>
        <ValidationCard errors={errors}/>
        <FieldSummaryCard fd={fd}/>
      </aside>

    </div>
  );
}
