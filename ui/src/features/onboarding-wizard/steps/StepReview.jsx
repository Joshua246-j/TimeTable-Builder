'use client';
import styles from './StepReview.module.css';

/* ─── Lookup Maps ─────────────────────────────────── */
const GENDER_MAP = { male:'Male', female:'Female', other:'Other', 'prefer-not':'Prefer not to say' };
const REL_MAP    = { parent:'Parent', sibling:'Sibling', spouse:'Spouse', other:'Other' };
const PROG_MAP   = { btech:'B.Tech', mtech:'M.Tech', mba:'MBA', bca:'BCA', mca:'MCA', bsc:'B.Sc' };
const DEPT_MAP   = { cse:'Computer Science & Engineering', ece:'Electronics & Communication', mech:'Mechanical Engineering', civil:'Civil Engineering', mgmt:'Management' };

/* ─── Helpers ─────────────────────────────────────── */
function fmt(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}
function today() {
  return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

/* ─── SVG Icons ───────────────────────────────────── */
const PersonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
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
const GradIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const KeyIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
  </svg>
);
const CheckIcon = ({ size = 12, color = '#15803d' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const BigCheckIcon = ({ size = 22, color = '#15803d' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

/* ─── Reusable Pieces ─────────────────────────────── */
function ReviewRow({ label, value, badge }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      {badge ? (
        <span>{badge}</span>
      ) : (
        <span className={`${styles.rowValue} ${!value ? styles.rowEmpty : ''}`}>
          {value || '—'}
        </span>
      )}
    </div>
  );
}

function Badge({ text, variant = 'green' }) {
  const cls = variant === 'gray' ? styles.badgeGray
    : variant === 'blue' ? styles.badgeBlue
    : variant === 'teal' ? styles.badgeTeal
    : styles.badgeGreen;
  return <span className={`${styles.badge} ${cls}`}>{text}</span>;
}

function ReviewCard({ icon, iconColor, title, stepNum, onEdit, children, fullWidth }) {
  return (
    <div className={`${styles.card} ${fullWidth ? styles.cardFull : ''}`}>
      <div className={styles.cardHead}>
        <div className={styles.cardTitleWrap}>
          <span className={`${styles.cardIcon} ${iconColor}`}>{icon}</span>
          <span className={styles.cardTitleText}>{title}</span>
        </div>
        <button className={styles.editBtn} onClick={() => onEdit(stepNum)}>
          ✏ Edit
        </button>
      </div>
      <div className={styles.cardBody}>{children}</div>
    </div>
  );
}

/* ─── Sidebar Components ──────────────────────────── */
function SummaryCard({ d }) {
  const className = d.className || 'Class 1';
  const section = d.section || 'A';
  const guardianStatus = d.gPrimary ? 'Linked (Primary)' : d.gName ? 'Linked' : 'Not linked';
  return (
    <div className={styles.sideCard}>
      <p className={styles.sideTitle}>
        <span className={styles.sideTitleIcon}>📋</span> Onboarding Summary
      </p>
      <div>
        <SummaryRow label="Person Type" badge={<Badge text="Student" />} />
        <SummaryRow label="Department" value={DEPT_MAP[d.department] || d.department || '—'} />
        <SummaryRow label="Program" value={PROG_MAP[d.program] || d.program || '—'} />
        <SummaryRow label="Class & Section" value={`${className} - ${section}`} />
        <SummaryRow label="Academic Year" value={d.academicYear || '2024-2025'} />
        <SummaryRow label="Guardian Status" badge={
          <Badge text={guardianStatus} variant={d.gName ? 'green' : 'gray'} />
        } />
        <SummaryRow label="Provisioning Date" value={today()} />
        <SummaryRow label="Provisioning By" value="Administrator" />
      </div>
    </div>
  );
}

function SummaryRow({ label, value, badge }) {
  return (
    <div className={styles.summaryRow}>
      <span className={styles.summaryLabel}>{label}</span>
      {badge ? badge : <span className={styles.summaryValue}>{value}</span>}
    </div>
  );
}

function AccountsCard() {
  return (
    <div className={styles.sideCard}>
      <p className={styles.sideTitle}>
        <span className={styles.sideTitleIcon}>👥</span> Accounts To Be Created
      </p>
      <div className={styles.accountRow}>
        <span className={styles.accountLabel}>
          <span className={styles.accountIcon}>🎓</span> Student Account
        </span>
        <span className={styles.accountValue}>1 account</span>
      </div>
      <div className={styles.accountRow}>
        <span className={styles.accountLabel}>
          <span className={styles.accountIcon}>👤</span> Guardian Account
        </span>
        <span className={styles.accountValue}>1 account</span>
      </div>
      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Total Accounts</span>
        <Badge text="2 accounts" />
      </div>
    </div>
  );
}

function ValidationCard() {
  const sections = [
    'Personal Information',
    'Guardian Information',
    'Qualifications',
    'Placement',
    'Credentials',
  ];
  return (
    <div className={styles.sideCard}>
      <p className={styles.validTitle}>Final Validation Status</p>
      <p className={styles.validSubtitle}>All sections must be valid to complete onboarding.</p>
      {sections.map(s => (
        <div key={s} className={styles.checkRow}>
          <span className={styles.checkCircle}>
            <CheckIcon size={12} />
          </span>
          <span className={styles.checkLabel}>{s}</span>
          <span className={styles.checkStatus}>Valid</span>
        </div>
      ))}
    </div>
  );
}

function ReadyBox() {
  return (
    <div className={styles.readyBox}>
      <div className={styles.readyIcon}>
        <BigCheckIcon />
      </div>
      <p className={styles.readyTitle}>Ready to Complete!</p>
      <p className={styles.readySubtitle}>
        All information is valid and ready for onboarding.
      </p>
      <p className={styles.readyHint}>
        Click &apos;Complete Onboarding&apos; to create the person record, provision accounts, and activate access.
      </p>
    </div>
  );
}

function SuccessPreview() {
  const steps = [
    { icon: <PersonIcon />, label: 'Person Successfully Onboarded' },
    { icon: <ShieldIcon />, label: 'Identity Created' },
    { icon: <UsersIcon />, label: 'Accounts Provisioned' },
    { icon: <GradIcon />,  label: 'Ready for Academic Assignment' },
  ];
  return (
    <div className={styles.sideCard}>
      <p className={styles.sideTitle}>
        <span className={styles.sideTitleIcon}>🚀</span> Success Preview
      </p>
      <div className={styles.pipeline}>
        {steps.map((s, idx) => (
          <div key={idx} className={styles.pipeStep}>
            <span className={styles.pipeIcon}>
              <span className={styles.pipeIconSvg}>{s.icon}</span>
            </span>
            <span className={styles.pipeLabel}>{s.label}</span>
            {idx < steps.length - 1 && (
              <span className={styles.pipeArrow}>
                <span className={styles.pipeArrowLine} />
                <span className={styles.pipeArrowHead} />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════ */
export default function StepReview({ formData: d, onEdit }) {
  const fullName = [d.firstName, d.lastName].filter(Boolean).join(' ');
  const className = d.className || 'Class 1';
  const section = d.section || 'A';
  const coreSubjects = d.coreSubjects || [];
  const electiveSubjects = d.electiveSubjects || [];

  return (
    <div className={styles.layout}>

      {/* ══════════ LEFT FORM AREA ══════════ */}
      <div className={styles.formCol}>
        <div className={styles.header}>
          <h2 className={styles.title}>Onboarding Summary</h2>
          <p className={styles.subtitle}>
            Review all information before completing the onboarding process.
          </p>
        </div>

        <div className={styles.cardGrid}>

          {/* ── Row 1: Personal + Guardian ── */}
          <ReviewCard
            icon={<PersonIcon />}
            iconColor={styles.cardIconBlue}
            title="Personal Information"
            stepNum={2}
            onEdit={onEdit}
          >
            <ReviewRow label="Full Name"      value={fullName} />
            <ReviewRow label="Gender"         value={GENDER_MAP[d.gender] || d.gender} />
            <ReviewRow label="Date of Birth"  value={fmt(d.dob)} />
            <ReviewRow label="Email"          value={d.email} />
            <ReviewRow label="Phone"          value={d.phone} />
            <ReviewRow label="Address"        value={d.permanentAddress} />
          </ReviewCard>

          <ReviewCard
            icon={<UsersIcon />}
            iconColor={styles.cardIconGreen}
            title="Guardian Information"
            stepNum={3}
            onEdit={onEdit}
          >
            <ReviewRow
              label="Guardian Name"
              value={d.gName ? `${d.gName}${d.gRelation ? ` (${REL_MAP[d.gRelation] || d.gRelation})` : ''}` : ''}
            />
            <ReviewRow label="Relationship"    value={REL_MAP[d.gRelation] || d.gRelation} />
            <ReviewRow label="Phone Number"    value={d.gPhone} />
            <ReviewRow label="Email"           value={d.gEmail} />
            <ReviewRow label="Address"         value={d.gAddress} />
            <ReviewRow
              label="Primary Guardian"
              badge={
                d.gPrimary
                  ? <Badge text="Yes" />
                  : <Badge text="No" variant="gray" />
              }
            />
          </ReviewCard>

          {/* ── Row 2: Qualifications + Placement ── */}
          <ReviewCard
            icon={<BookIcon />}
            iconColor={styles.cardIconAmber}
            title="Qualifications"
            stepNum={4}
            onEdit={onEdit}
          >
            <ReviewRow label="Highest Qualification" value={d.highestQual ? 'Higher Secondary (12th)' : '—'} />
            <ReviewRow label="Board"                 value={d.hsBoard || d.secBoard} />
            <ReviewRow label="Year of Passing"       value={d.hsYearOfPassing} />
            <ReviewRow label="Percentage"            value={d.hsPercentage} />
            <ReviewRow label="Entrance Exam"         value={d.examName} />
            <ReviewRow label="Specialization"        value={d.department ? (DEPT_MAP[d.department] || d.department) : 'Computer Science'} />
            <ReviewRow
              label="Other Qualification"
              value={d.secSchoolName ? `${d.secSchoolName}${d.secBoard ? ` — ${d.secBoard}` : ''}` : ''}
            />
          </ReviewCard>

          <ReviewCard
            icon={<GradIcon />}
            iconColor={styles.cardIconPurple}
            title="Placement"
            stepNum={5}
            onEdit={onEdit}
          >
            <ReviewRow label="Academic Year"   value={d.academicYear || '2024-2025'} />
            <ReviewRow label="Program"         value={PROG_MAP[d.program] || d.program} />
            <ReviewRow label="Department"      value={DEPT_MAP[d.department] || d.department} />
            <ReviewRow label="Class & Section" value={`${className} — ${section}`} />
            <ReviewRow label="Core Subjects"   value={`${coreSubjects.length} Subjects`} />
            <ReviewRow label="Electives"       value={`${electiveSubjects.length} Electives`} />
            <ReviewRow label="Faculty Advisor" value={d.facultyAdvisor} />
          </ReviewCard>

          {/* ── Row 3: Credentials (full width) ── */}
          <ReviewCard
            icon={<KeyIcon />}
            iconColor={styles.cardIconTeal}
            title="Credentials"
            stepNum={6}
            onEdit={onEdit}
            fullWidth
          >
            <ReviewRow label="Student Username"   value={d.username} />
            <ReviewRow label="Guardian Username"  value={d.gUsername} />
            <ReviewRow
              label="Auto Generate Credentials"
              badge={
                d.autoGenerate !== false
                  ? <Badge text="Enabled" />
                  : <Badge text="Disabled" variant="gray" />
              }
            />
            <ReviewRow
              label="Force Password Reset"
              badge={
                d.forcePasswordReset !== false
                  ? <Badge text="Enabled" />
                  : <Badge text="Disabled" variant="gray" />
              }
            />
            <ReviewRow
              label="Delivery Methods"
              badge={
                <span className={styles.deliveryRow}>
                  {(d.deliveryEmail !== false) && <span className={styles.deliveryTag}>✉ Email</span>}
                  {d.deliverySms && <span className={styles.deliveryTag}>💬 SMS</span>}
                  {d.deliveryWhatsapp && <span className={styles.deliveryTag}>📱 WhatsApp</span>}
                </span>
              }
            />
          </ReviewCard>

        </div>
      </div>

      {/* ══════════ RIGHT SIDEBAR ══════════ */}
      <aside className={styles.sidebar}>
        <SummaryCard d={d} />
        <AccountsCard />
        <ValidationCard />
        <ReadyBox />
        <SuccessPreview />
      </aside>

    </div>
  );
}
