'use client';
import { useEffect } from 'react';
import styles from './StepPlacement.module.css';

/* ── Tiny helpers ──────────────────────────────────── */
function Fl({ label, required, error, children }) {
  return (
    <div className={styles.fl}>
      {label && <label className={styles.flLabel}>{label}{required && <span className={styles.ast}> *</span>}</label>}
      {children}
      {error && <span className={styles.flErr}>{error}</span>}
    </div>
  );
}

function SecHead({ icon, iconCls, title, subtitle }) {
  return (
    <>
      <div className={styles.secHead}>
        <span className={`${styles.secIcon} ${iconCls}`}>{icon}</span>
        <span className={styles.secTitle}>{title}</span>
      </div>
      {subtitle && <p className={styles.secSub}>{subtitle}</p>}
    </>
  );
}

/* ── Subject data ──────────────────────────────────── */
const CORE = [
  { name: 'Data Structures',              code: 'CSE301', dot: styles.dotBlue   },
  { name: 'Database Management Systems',  code: 'CSE302', dot: styles.dotGreen  },
  { name: 'Operating Systems',            code: 'CSE303', dot: styles.dotPurple },
  { name: 'Computer Networks',            code: 'CSE304', dot: styles.dotOrange },
  { name: 'Mathematics III',              code: 'MTH301', dot: styles.dotRed    },
  { name: 'Software Engineering',         code: 'CSE305', dot: styles.dotTeal   },
];
const ELECTIVES = [
  { name: 'Artificial Intelligence', code: 'CSE401', dot: styles.dotIndigo },
  { name: 'Cloud Computing',        code: 'CSE402', dot: styles.dotCyan   },
  { name: 'Cyber Security',         code: 'CSE403', dot: styles.dotRed    },
  { name: 'Machine Learning',       code: 'CSE434', dot: styles.dotPurple },
  { name: 'Internet of Things',     code: 'CSE405', dot: styles.dotOrange },
];

const ADVISORS = [
  { value: 'Dr. Anil Kumar',   title: 'Professor, Computer Science & Engineering' },
  { value: 'Dr. Rajesh Sharma', title: 'Associate Professor' },
  { value: 'Dr. Priya Menon',   title: 'Assistant Professor' },
];

/* ── Sidebar cards ─────────────────────────────────── */
function PlacementSummary({ fd }) {
  const coreCount = (fd.coreSubjects || []).length;
  const elecCount = (fd.electiveSubjects || []).length;
  const advisor = ADVISORS.find(a => a.value === fd.facultyAdvisor);
  const rows = [
    { lbl: 'Department',    val: fd.department },
    { lbl: 'Program',       val: fd.program },
    { lbl: 'Academic Year', val: fd.academicYear },
    { lbl: 'Semester',      val: fd.semester },
    { lbl: 'Class',         val: fd.className },
    { lbl: 'Section',       val: fd.section },
  ];
  return (
    <div className={styles.card}>
      <p className={styles.cardTitle}>Academic Placement Summary</p>
      <div className={styles.sumRows}>
        {rows.map(r => (
          <div key={r.lbl} className={styles.sumRow}>
            <span className={styles.sumLabel}>{r.lbl}</span>
            <span className={styles.sumVal}>{r.val || '—'}</span>
          </div>
        ))}
        <hr className={styles.sumDivider}/>
        <div className={styles.sumRow}>
          <span className={styles.sumLabel}>Subjects Assigned</span>
          <span className={styles.sumValGreen}>{coreCount} subjects</span>
        </div>
        <div className={styles.sumRow}>
          <span className={styles.sumLabel}>Electives Selected</span>
          <span className={styles.sumValGreen}>{elecCount} subjects</span>
        </div>
        <hr className={styles.sumDivider}/>
        <div className={styles.sumRow}>
          <span className={styles.sumLabel}>Faculty Advisor</span>
          <span className={styles.sumVal}>{advisor?.value || '—'}</span>
        </div>
      </div>
    </div>
  );
}

function ValidationStatus({ fd }) {
  const checks = [
    { lbl: 'Program Information',       ok: !!(fd.department && fd.program && fd.academicYear && fd.semester) },
    { lbl: 'Class Assignment',          ok: !!(fd.className && fd.section) },
    { lbl: 'Subject Enrollment',        ok: (fd.coreSubjects || []).length > 0 },
    { lbl: 'Elective Selection',        ok: (fd.electiveSubjects || []).length > 0 },
    { lbl: 'Faculty Advisor Assignment', ok: !!fd.facultyAdvisor },
    { lbl: 'Optional Services',         ok: true },
  ];
  const allOk = checks.every(c => c.ok);
  return (
    <div className={styles.card}>
      <p className={styles.cardTitle}>Validation Status</p>
      <div className={styles.valList}>
        {checks.map(c => (
          <div key={c.lbl} className={styles.valItem}>
            <span className={styles.valIcon} style={{ color: c.ok ? 'var(--success)' : 'var(--danger)' }}>
              {c.ok ? '✓' : '⚠'}
            </span>
            <span className={styles.valLabel}>{c.lbl}</span>
            {c.ok
              ? <span className={styles.valStatusOk}>Completed</span>
              : <span className={styles.valStatusWarn}>Required</span>}
          </div>
        ))}
      </div>
      {allOk && (
        <div className={styles.allSetBox}>
          <span className={styles.allSetIcon}>✓</span>
          <div>
            <div className={styles.allSetText}>All Set!</div>
            <div className={styles.allSetSub}>All required sections are completed.</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── SVG Icons ─────────────────────────────────────── */
const BuildingIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/>
  </svg>
);
const UsersIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const BookIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const SparklesIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.912 5.813L20 10l-6.088 1.187L12 17l-1.912-5.813L4 10l6.088-1.187z"/>
  </svg>
);
const UserCheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/>
  </svg>
);
const SettingsIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.08a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.08a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

/* ── MAIN COMPONENT ───────────────────────────────── */
export default function StepPlacement({ formData: fd, updateField: upd, errors }) {

  /* Auto-initialise core subjects if empty */
  useEffect(() => {
    if (!fd.coreSubjects || fd.coreSubjects.length === 0) {
      upd('coreSubjects', CORE.map(s => s.code));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleArr = (key, code) => {
    const arr = fd[key] || [];
    upd(key, arr.includes(code) ? arr.filter(c => c !== code) : [...arr, code]);
  };

  const sel = key => ({
    className: `${styles.inp} ${styles.sel} ${errors[key] ? styles.inpErr : ''}`,
    value: fd[key] || '',
    onChange: e => upd(key, e.target.value),
  });

  const inp = (key, rest = {}) => ({
    className: `${styles.inp} ${errors[key] ? styles.inpErr : ''}`,
    value: fd[key] || '',
    onChange: e => upd(key, e.target.value),
    ...rest,
  });

  const advisorInfo = ADVISORS.find(a => a.value === fd.facultyAdvisor);

  return (
    <div className={styles.layout}>

      {/* ══════════ LEFT FORM ══════════ */}
      <div className={styles.formCol}>

        {/* ── 1. Program Information ── */}
        <div className={styles.sec}>
          <SecHead
            icon={<BuildingIcon/>}
            iconCls={styles.secIconGreen}
            title="Program Information"
            subtitle="Select the academic program and semester details."
          />
          <span className={styles.secLabel}>PROGRAM INFORMATION</span>
          <div className={styles.g4}>
            <Fl label="Department" required error={errors.department}>
              <select {...sel('department')}>
                <option value="">Select department</option>
                <option value="Computer Science & Engineering">Computer Science &amp; Engineering</option>
                <option value="Electronics & Communication">Electronics &amp; Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Management">Management</option>
              </select>
            </Fl>
            <Fl label="Program" required error={errors.program}>
              <select {...sel('program')}>
                <option value="">Select program</option>
                <option value="B.Tech CSE">B.Tech CSE</option>
                <option value="M.Tech">M.Tech</option>
                <option value="MBA">MBA</option>
                <option value="BCA">BCA</option>
                <option value="MCA">MCA</option>
                <option value="B.Sc">B.Sc</option>
              </select>
            </Fl>
            <Fl label="Academic Year" required error={errors.academicYear}>
              <select {...sel('academicYear')}>
                <option value="">Select year</option>
                <option value="2024-25">2024-25</option>
                <option value="2023-24">2023-24</option>
                <option value="2025-26">2025-26</option>
              </select>
            </Fl>
            <Fl label="Semester" required error={errors.semester}>
              <select {...sel('semester')}>
                <option value="">Select semester</option>
                {['I','II','III','IV','V','VI','VII','VIII'].map(s => (
                  <option key={s} value={`Semester ${s}`}>Semester {s}</option>
                ))}
              </select>
            </Fl>
          </div>
        </div>

        {/* ── 2. Class Assignment ── */}
        <div className={styles.sec}>
          <SecHead
            icon={<UsersIcon/>}
            iconCls={styles.secIconBrand}
            title="Class Assignment"
            subtitle="Assign the student to class and section."
          />
          <span className={styles.secLabel}>CLASS ASSIGNMENT</span>
          <div className={styles.g2}>
            <Fl label="Class" required error={errors.className}>
              <select {...sel('className')}>
                <option value="">Select class</option>
                {['CSE I','CSE II','CSE III','CSE IV','CSE V'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Fl>
            <Fl label="Section" required error={errors.section}>
              <select {...sel('section')}>
                <option value="">Select section</option>
                {['A','B','C','D'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Fl>
          </div>
        </div>

        {/* ── 3. Subject Enrollment ── */}
        <div className={styles.sec}>
          <SecHead
            icon={<BookIcon/>}
            iconCls={styles.secIconTeal}
            title="Subject Enrollment"
            subtitle="Select the core subjects for this semester."
          />
          <span className={styles.secLabel}>SUBJECT ENROLLMENT</span>
          <div className={styles.subjectGrid}>
            {CORE.map(subj => {
              const active = (fd.coreSubjects || []).includes(subj.code);
              return (
                <div
                  key={subj.code}
                  className={`${styles.subjectCard} ${active ? styles.subjectCardActive : ''}`}
                  onClick={() => toggleArr('coreSubjects', subj.code)}
                >
                  <span className={`${styles.subjectDot} ${subj.dot}`}/>
                  <div className={styles.subjectInfo}>
                    <div className={styles.subjectName}>{subj.name}</div>
                    <div className={styles.subjectCode}>{subj.code}</div>
                  </div>
                  <span className={`${styles.subjectChk} ${active ? styles.subjectChkActive : ''}`}>
                    {active && '✓'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 4. Elective Selection ── */}
        <div className={styles.sec}>
          <SecHead
            icon={<SparklesIcon/>}
            iconCls={styles.secIconAmber}
            title="Elective Selection"
            subtitle="Select elective subjects (Choose any one or more)."
          />
          <span className={styles.secLabel}>ELECTIVE SELECTION</span>
          <div className={styles.electiveGrid}>
            {ELECTIVES.map(subj => {
              const active = (fd.electiveSubjects || []).includes(subj.code);
              return (
                <div
                  key={subj.code}
                  className={`${styles.subjectCard} ${active ? styles.subjectCardActive : ''}`}
                  onClick={() => toggleArr('electiveSubjects', subj.code)}
                >
                  <span className={`${styles.subjectDot} ${subj.dot}`}/>
                  <div className={styles.subjectInfo}>
                    <div className={styles.subjectName}>{subj.name}</div>
                    <div className={styles.subjectCode}>{subj.code}</div>
                  </div>
                  <span className={`${styles.subjectChk} ${active ? styles.subjectChkActive : ''}`}>
                    {active && '✓'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 5. Faculty Advisor + Optional Services ── */}
        <div className={styles.bottomRow}>

          {/* Faculty Advisor */}
          <div className={styles.sec} style={{ marginBottom: 0 }}>
            <SecHead
              icon={<UserCheckIcon/>}
              iconCls={styles.secIconBrand}
              title="Faculty Advisor Assignment"
              subtitle="Assign a faculty advisor to the student."
            />
            <Fl label="Faculty Advisor" required error={errors.facultyAdvisor}>
              <select {...sel('facultyAdvisor')}>
                <option value="">Select advisor</option>
                {ADVISORS.map(a => <option key={a.value} value={a.value}>{a.value}</option>)}
              </select>
            </Fl>
            {advisorInfo && <p className={styles.advisorDetail}>{advisorInfo.title}</p>}
          </div>

          {/* Optional Student Services */}
          <div className={styles.sec} style={{ marginBottom: 0 }}>
            <SecHead
              icon={<SettingsIcon/>}
              iconCls={styles.secIconAmber}
              title="Optional Student Services"
              subtitle="Configure hostel and transport details."
            />

            <div className={styles.subSec}>
              <div className={styles.subSecTitle}><span className={styles.subSecIcon}>🏨</span> Hostel Information</div>
              <div className={styles.g2}>
                <Fl label="Block">
                  <select {...sel('hostelBlock')}>
                    <option value="">Select block</option>
                    {['Block A','Block B','Block C','Block D','Block E'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </Fl>
                <Fl label="Room Number">
                  <input {...inp('hostelRoom')} type="text" placeholder="Room number"/>
                </Fl>
              </div>
            </div>

            <div className={styles.subSec}>
              <div className={styles.subSecTitle}><span className={styles.subSecIcon}>🚌</span> Transportation</div>
              <div className={styles.g2}>
                <Fl label="Bus Route">
                  <select {...sel('busRoute')}>
                    <option value="">Select route</option>
                    {['Route 1','Route 2','Route 3','Route 4','Route 5'].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </Fl>
                <Fl label="Boarding Point">
                  <input {...inp('boardingPoint')} type="text" placeholder="Boarding point"/>
                </Fl>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ══════════ RIGHT SIDEBAR ══════════ */}
      <aside className={styles.sidebar}>
        <PlacementSummary fd={fd}/>
        <ValidationStatus fd={fd}/>
      </aside>

    </div>
  );
}
