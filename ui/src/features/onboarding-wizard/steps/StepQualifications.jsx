'use client';
import { useRef, useCallback, useMemo } from 'react';
import styles from './StepQualifications.module.css';

/* ─────────────────────────────────────────────────────
   SMALL REUSABLE PIECES
───────────────────────────────────────────────────── */
function Fl({ label, required, error, hint, children }) {
  return (
    <div className={styles.fl}>
      {label && <label className={styles.flLabel}>{label}{required && <span className={styles.ast}> *</span>}</label>}
      {children}
      {hint && <span className={styles.flHint}>{hint}</span>}
      {error && <span className={styles.flErr}>{error}</span>}
    </div>
  );
}

function SecHead({ icon, title, sub }) {
  return (
    <div className={styles.secHead}>
      <span className={styles.secIcon}>{icon}</span>
      <div>
        <div className={styles.secTitle}>{title}</div>
        {sub && <div className={styles.secSub}>{sub}</div>}
      </div>
    </div>
  );
}

function SubHead({ icon, title }) {
  return (
    <div className={styles.subHead}>
      <span className={styles.subIcon}>{icon}</span>
      <span className={styles.subTitle}>{title}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────── */
const BookIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

const DocIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
);

const FileUpIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const CheckCircle = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

/* ─────────────────────────────────────────────────────
   UPLOAD CARD COMPONENT
───────────────────────────────────────────────────── */
function UploadCard({ title, required, file, onFile }) {
  const ref = useRef(null);
  const handleChange = useCallback(e => {
    const f = e.target.files?.[0];
    if (f) onFile(f);
  }, [onFile]);
  const hasFile = !!file;

  return (
    <div className={`${styles.uploadCard} ${hasFile ? styles.uploadCardDone : ''}`}
      onClick={() => ref.current?.click()}>
      <div className={`${styles.uploadIcon} ${hasFile ? styles.uploadIconDone : ''}`}>
        {hasFile
          ? <CheckCircle size={18}/>
          : <FileUpIcon size={18}/>
        }
      </div>
      <span className={styles.uploadTitle}>{title}{required && <span className={styles.ast}> *</span>}</span>
      {hasFile ? (
        <span className={styles.uploadFileName}>{file.name || 'File selected'}</span>
      ) : (
        <>
          <span className={styles.uploadDrag}>Drag &amp; drop file here</span>
          <span className={styles.uploadOr}>or</span>
          <button type="button" className={styles.uploadBrowse} onClick={e => { e.stopPropagation(); ref.current?.click(); }}>
            Browse Files
          </button>
          <span className={styles.uploadHint}>PDF, JPG, PNG up to 5MB</span>
        </>
      )}
      <input ref={ref} type="file" accept=".pdf,.jpg,.jpeg,.png" className={styles.uploadInput} onChange={handleChange}/>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   DONUT RING
───────────────────────────────────────────────────── */
function DonutRing({ pct, size = 72 }) {
  const r = (size / 2) - 7;
  const c = 2 * Math.PI * r;
  const d = Math.min(c, (pct / 100) * c);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e5e7eb" strokeWidth="7"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#4338ca" strokeWidth="7"
        strokeDasharray={`${d} ${c - d}`} strokeLinecap="round"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────
   SIDEBAR CARDS
───────────────────────────────────────────────────── */
function AcademicSummary({ fd }) {
  const reqDocs = fd.requiredDocs || {};
  const optDocs = fd.optionalDocs || {};
  const reqCount = [reqDocs.class10, reqDocs.class12, reqDocs.transferCert].filter(Boolean).length;
  const optCount = [optDocs.entranceScorecard, optDocs.communityCert, optDocs.incomeCert, optDocs.migrationCert, optDocs.otherDocs].filter(Boolean).length;
  const totalUploaded = reqCount + optCount;
  const hasEntrance = !!fd.examName;

  // Simple completion estimate
  const acadFields = [fd.secSchoolName, fd.secBoard, fd.secYearOfPassing, fd.secPercentage,
                      fd.hsSchoolName, fd.hsBoard, fd.hsYearOfPassing, fd.hsPercentage];
  const acadFilled = acadFields.filter(Boolean).length;
  const pct = Math.round(((acadFilled + totalUploaded) / (acadFields.length + 8)) * 100);

  return (
    <div className={styles.card}>
      <p className={styles.cardTitle}>Academic Summary</p>
      <div className={styles.donutBox}>
        <DonutRing pct={pct}/>
        <span className={styles.donutPct}>{pct}%</span>
      </div>
      <div className={styles.sumRow}>
        <span className={styles.sumLbl}>Academic Profile Completion</span>
        <span className={styles.sumVal}>{pct}%</span>
      </div>
      <div className={styles.sumRow}>
        <span className={styles.sumLbl}>Documents Uploaded</span>
        <span className={styles.sumVal}>{totalUploaded}/8</span>
      </div>
      <div className={styles.sumRow}>
        <span className={styles.sumLbl}>Required Docs Pending</span>
        <span className={styles.sumVal}>{3 - reqCount}</span>
      </div>
      <div className={styles.sumRow}>
        <span className={styles.sumLbl}>Entrance Exam Status</span>
        <span className={`${styles.badge} ${hasEntrance ? styles.badgeGreen : styles.badgeYellow}`}>
          {hasEntrance ? 'Completed' : 'Pending'}
        </span>
      </div>
    </div>
  );
}

function DocUploadSummary({ fd }) {
  const reqDocs = fd.requiredDocs || {};
  const optDocs = fd.optionalDocs || {};
  const reqCount = [reqDocs.class10, reqDocs.class12, reqDocs.transferCert].filter(Boolean).length;
  const optCount = [optDocs.entranceScorecard, optDocs.communityCert, optDocs.incomeCert, optDocs.migrationCert, optDocs.otherDocs].filter(Boolean).length;
  return (
    <div className={styles.card}>
      <p className={styles.cardTitle}>Document Upload Summary</p>
      <div className={styles.sumRow}>
        <span className={styles.sumLbl}>Required Documents</span>
        <span className={styles.sumVal}>{reqCount}/3</span>
      </div>
      <div className={styles.sumRow}>
        <span className={styles.sumLbl}>Optional Documents</span>
        <span className={styles.sumVal}>{optCount}/5</span>
      </div>
      <div className={styles.sumRow}>
        <span className={styles.sumLbl}>Total Uploaded</span>
        <span className={styles.sumVal}>{reqCount + optCount}/8</span>
      </div>
    </div>
  );
}

function EntranceStatus({ fd }) {
  const rows = [
    { lbl: 'Exam Name', val: fd.examName },
    { lbl: 'Reg. Number', val: fd.examRegNo },
    { lbl: 'Rank', val: fd.examRank },
    { lbl: 'Score', val: fd.examScore },
    { lbl: 'Year', val: fd.examYear },
  ];
  return (
    <div className={styles.card}>
      <p className={styles.cardTitle}>Entrance Examination Status</p>
      <div className={styles.detailList}>
        {rows.map(r => (
          <div key={r.lbl} className={styles.detailRow}>
            <span className={styles.detailLbl}>{r.lbl}</span>
            <span className={`${styles.detailVal} ${!r.val ? styles.notSet : ''}`}>
              {r.val || 'Not set'}
            </span>
          </div>
        ))}
      </div>
      {fd.examName && (
        <div className={styles.verifiedLine}>
          <CheckCircle size={14}/> Entrance examination details verified.
        </div>
      )}
    </div>
  );
}

function ValidationStatus({ fd }) {
  const acadOk = !!(fd.secSchoolName && fd.secBoard && fd.secYearOfPassing && fd.secPercentage);
  const entranceOk = !!(fd.examName);
  const reqDocs = fd.requiredDocs || {};
  const docsOk = !!(reqDocs.class10 && reqDocs.class12 && reqDocs.transferCert);
  const allOk = acadOk && entranceOk && docsOk;
  return (
    <div className={styles.card}>
      <p className={styles.cardTitle}>Validation Status</p>
      <div className={styles.validList}>
        <div className={styles.validRow}>
          <span className={styles.validLbl}>Academic Details</span>
          <span className={acadOk ? styles.validOk : styles.validBad}>{acadOk ? '✓ Valid' : '✗ Invalid'}</span>
        </div>
        <div className={styles.validRow}>
          <span className={styles.validLbl}>Entrance Details</span>
          <span className={entranceOk ? styles.validOk : styles.validBad}>{entranceOk ? '✓ Valid' : '✗ Invalid'}</span>
        </div>
        <div className={styles.validRow}>
          <span className={styles.validLbl}>Documents</span>
          <span className={docsOk ? styles.validOk : styles.validBad}>{docsOk ? '✓ Valid' : '✗ Invalid'}</span>
        </div>
      </div>
      <div className={`${styles.overallRow} ${allOk ? styles.overallOk : styles.overallBad}`}>
        <span>Overall Status</span>
        <span>{allOk ? '✓ All Good' : '⚠ Issues'}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────── */
export default function StepQualifications({ formData: fd, updateField: upd, errors }) {

  const i = (key, rest = {}) => ({
    className: `${styles.inp} ${errors[key] ? styles.inpErr : ''}`,
    value: fd[key] || '',
    onChange: e => upd(key, e.target.value),
    ...rest,
  });

  const s = key => ({
    className: `${styles.inp} ${styles.sel} ${errors[key] ? styles.inpErr : ''}`,
    value: fd[key] || '',
    onChange: e => upd(key, e.target.value),
  });

  // Helpers for nested doc state
  const reqDocs = useMemo(() => fd.requiredDocs || {}, [fd.requiredDocs]);
  const optDocs = useMemo(() => fd.optionalDocs || {}, [fd.optionalDocs]);
  const setReq = useCallback((docKey, file) => {
    upd('requiredDocs', { ...reqDocs, [docKey]: file });
  }, [upd, reqDocs]);
  const setOpt = useCallback((docKey, file) => {
    upd('optionalDocs', { ...optDocs, [docKey]: file });
  }, [upd, optDocs]);

  const boardOptions = ['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge', 'Other'];

  return (
    <div className={styles.layout}>

      {/* ══════════ LEFT FORM ══════════ */}
      <div className={styles.formCol}>

        {/* ── Header Card ── */}
        <div className={styles.sec}>
          <SecHead icon={<BookIcon size={15}/>}
            title="Academic Qualifications"
            sub="Capture the student's educational background and supporting academic documents."/>
        </div>

        {/* ── ACADEMIC HISTORY ── */}
        <div className={styles.sec}>
          <p className={styles.catLabel}>Academic History</p>

          {/* Secondary School */}
          <div className={styles.subCard}>
            <SubHead icon={<DocIcon size={13}/>} title="Secondary School Details"/>
            <div className={styles.g4}>
              <Fl label="School Name" required error={errors.secSchoolName}>
                <input {...i('secSchoolName')} type="text" placeholder="Enter school name"/>
              </Fl>
              <Fl label="Board / University" required error={errors.secBoard}>
                <select {...s('secBoard')}>
                  <option value="">Select board</option>
                  {boardOptions.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </Fl>
              <Fl label="Year of Passing" required error={errors.secYearOfPassing}>
                <input {...i('secYearOfPassing')} type="number" placeholder="e.g. 2020" min="1990" max="2030"/>
              </Fl>
              <Fl label="Percentage / CGPA" required error={errors.secPercentage}>
                <div className={styles.pctWrap}>
                  <input {...i('secPercentage')} type="text" placeholder="e.g. 85"/>
                  <span className={styles.pctSuffix}>%</span>
                </div>
              </Fl>
            </div>
          </div>

          {/* Higher Secondary */}
          <div className={styles.subCard}>
            <SubHead icon={<DocIcon size={13}/>} title="Higher Secondary Details"/>
            <div className={styles.g4}>
              <Fl label="School Name" required error={errors.hsSchoolName}>
                <input {...i('hsSchoolName')} type="text" placeholder="Enter school name"/>
              </Fl>
              <Fl label="Board / University" required error={errors.hsBoard}>
                <select {...s('hsBoard')}>
                  <option value="">Select board</option>
                  {boardOptions.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </Fl>
              <Fl label="Year of Passing" required error={errors.hsYearOfPassing}>
                <input {...i('hsYearOfPassing')} type="number" placeholder="e.g. 2022" min="1990" max="2030"/>
              </Fl>
              <Fl label="Percentage / CGPA" required error={errors.hsPercentage}>
                <div className={styles.pctWrap}>
                  <input {...i('hsPercentage')} type="text" placeholder="e.g. 90"/>
                  <span className={styles.pctSuffix}>%</span>
                </div>
              </Fl>
            </div>
          </div>
        </div>

        {/* ── ENTRANCE EXAMINATION ── */}
        <div className={styles.sec}>
          <p className={`${styles.catLabel} ${styles.catLabelBlue}`}>Entrance Examination Details</p>
          <div className={styles.g5}>
            <Fl label="Exam Name">
              <select {...s('examName')}>
                <option value="">Select exam</option>
                <option value="JEE Main">JEE Main</option>
                <option value="KEAM">KEAM</option>
                <option value="CUET">CUET</option>
                <option value="NEET">NEET</option>
                <option value="Institution Entrance Test">Institution Entrance Test</option>
              </select>
            </Fl>
            <Fl label="Registration Number">
              <input {...i('examRegNo')} type="text" placeholder="Reg. number"/>
            </Fl>
            <Fl label="Rank">
              <input {...i('examRank')} type="text" placeholder="e.g. 1234"/>
            </Fl>
            <Fl label="Score">
              <input {...i('examScore')} type="text" placeholder="e.g. 280"/>
            </Fl>
            <Fl label="Year">
              <input {...i('examYear')} type="number" placeholder="e.g. 2024" min="2000" max="2030"/>
            </Fl>
          </div>
          <p className={styles.flHint} style={{ marginTop: 8 }}>
            Examples: JEE Main, KEAM, CUET, Institution Entrance Test
          </p>
        </div>

        {/* ── ACADEMIC DOCUMENTS ── */}
        <div className={styles.sec}>
          <p className={`${styles.catLabel} ${styles.catLabelBlue}`}>Academic Documents</p>

          {/* Required */}
          <p className={styles.subLabel}>
            Required Documents
          </p>
          <div className={styles.uploadGrid}>
            <UploadCard title="Class 10 Marksheet" required file={reqDocs.class10} onFile={f => setReq('class10', f)}/>
            <UploadCard title="Class 12 Marksheet" required file={reqDocs.class12} onFile={f => setReq('class12', f)}/>
            <UploadCard title="Transfer Certificate" required file={reqDocs.transferCert} onFile={f => setReq('transferCert', f)}/>
          </div>

          {/* Optional */}
          <p className={styles.subLabel}>
            Optional Documents
          </p>
          <div className={styles.uploadGridSmall}>
            <UploadCard title="Entrance Exam Scorecard" file={optDocs.entranceScorecard} onFile={f => setOpt('entranceScorecard', f)}/>
            <UploadCard title="Community Certificate" file={optDocs.communityCert} onFile={f => setOpt('communityCert', f)}/>
            <UploadCard title="Income Certificate" file={optDocs.incomeCert} onFile={f => setOpt('incomeCert', f)}/>
            <UploadCard title="Migration Certificate" file={optDocs.migrationCert} onFile={f => setOpt('migrationCert', f)}/>
            <UploadCard title="Other Supporting Documents" file={optDocs.otherDocs} onFile={f => setOpt('otherDocs', f)}/>
          </div>
        </div>

      </div>

      {/* ══════════ RIGHT SIDEBAR ══════════ */}
      <aside className={styles.sidebar}>
        <AcademicSummary fd={fd}/>
        <DocUploadSummary fd={fd}/>
        <EntranceStatus fd={fd}/>
        <ValidationStatus fd={fd}/>
      </aside>

    </div>
  );
}
