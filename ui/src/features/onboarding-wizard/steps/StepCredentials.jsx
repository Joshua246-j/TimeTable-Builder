'use client';
import { useState, useMemo } from 'react';
import styles from './StepCredentials.module.css';

/* ── Password strength ─────────────────────────────── */
function getStrength(pwd) {
  if (!pwd || pwd.length < 6) return null;
  const hasUpper   = /[A-Z]/.test(pwd);
  const hasLower   = /[a-z]/.test(pwd);
  const hasDigit   = /[0-9]/.test(pwd);
  const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
  if (pwd.length >= 12 || (hasUpper && hasLower && hasDigit && hasSpecial))
    return { level: 3, label: 'Strong',  color: '#059669' };
  if (pwd.length >= 8)
    return { level: 2, label: 'Medium',  color: '#d97706' };
  return { level: 1, label: 'Weak', color: '#dc2626' };
}

/* ── Small helpers ─────────────────────────────────── */
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

function StrengthBar({ strength }) {
  if (!strength) return null;
  return (
    <div className={styles.strengthRow}>
      <div className={styles.strengthTrack}>
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className={styles.strengthSeg}
            style={i <= strength.level ? { background: strength.color } : undefined}
          />
        ))}
      </div>
      <span className={styles.strengthLabel} style={{ color: strength.color }}>
        {strength.label}
      </span>
    </div>
  );
}

/* ── SVG Icons ─────────────────────────────────────── */
const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const EyeOpen = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const GearIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.08a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.08a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const BellIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const KeyIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);
const ChatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
);

/* ── Sidebar Cards ─────────────────────────────────── */
function ProvisioningSummary({ fd }) {
  const name = [fd.firstName, fd.lastName].filter(Boolean).join(' ') || '—';
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  return (
    <div className={styles.card}>
      <p className={styles.cardTitle}>Provisioning Summary</p>
      <div className={styles.sumRows}>
        <div className={styles.sumRow}>
          <span className={styles.sumLabel}>Person Type</span>
          <span className={`${styles.badge} ${styles.badgeGreen}`}>Student</span>
        </div>
        <div className={styles.sumRow}>
          <span className={styles.sumLabel}>Student Name</span>
          <span className={styles.sumVal}>{name}</span>
        </div>
        <div className={styles.sumRow}>
          <span className={styles.sumLabel}>Guardian Name</span>
          <span className={styles.sumVal}>{fd.gName || '—'}</span>
        </div>
        <div className={styles.sumRow}>
          <span className={styles.sumLabel}>Provisioning Date</span>
          <span className={styles.sumVal}>{today}</span>
        </div>
        <div className={styles.sumRow}>
          <span className={styles.sumLabel}>Provisioning By</span>
          <span className={styles.sumVal}>Administrator</span>
        </div>
      </div>
    </div>
  );
}

function AccountsCard({ fd }) {
  const hasGuardian = !!fd.gName;
  const total = hasGuardian ? 2 : 1;
  return (
    <div className={styles.card}>
      <p className={styles.cardTitle}>Accounts To Be Created</p>
      <div className={styles.sumRows}>
        <div className={styles.sumRow}>
          <span className={styles.sumLabel}>Student Account</span>
          <span className={styles.sumVal}>1 account</span>
        </div>
        {hasGuardian && (
          <div className={styles.sumRow}>
            <span className={styles.sumLabel}>Guardian Account</span>
            <span className={styles.sumVal}>1 account</span>
          </div>
        )}
        <hr className={styles.sumDivider}/>
        <div className={styles.totalRow}>
          <span>Total Accounts</span>
          <span className={styles.totalBadge}>{total} accounts</span>
        </div>
      </div>
    </div>
  );
}

function DeliveryCard({ fd }) {
  const rows = [
    { icon: '✉️', label: fd.email || 'No email',  key: 'deliveryEmail' },
    { icon: '💬', label: fd.phone || 'No phone',  key: 'deliverySms'   },
    { icon: '📱', label: fd.phone || 'No phone',  key: 'deliveryWhatsapp' },
  ];
  return (
    <div className={styles.card}>
      <p className={styles.cardTitle}>Credential Delivery</p>
      {rows.map(r => (
        <div key={r.key} className={styles.deliverySideRow}>
          <span className={styles.deliverySideIcon}>{r.icon}</span>
          <span className={styles.deliverySideLabel}>{r.label}</span>
          <span className={styles.deliverySideStatus} style={{ color: fd[r.key] ? 'var(--success)' : 'var(--text-muted)' }}>
            {fd[r.key] ? '✓' : '—'}
          </span>
        </div>
      ))}
    </div>
  );
}

function IdentityStatus() {
  return (
    <div className={styles.card}>
      <p className={styles.cardTitle}>Identity Status</p>
      <div className={styles.readyBox}>
        <div className={styles.readyIcon}>✓</div>
        <div className={styles.readyTitle}>Ready for Provisioning</div>
        <div className={styles.readySub}>All credential information has been configured and is ready to be provisioned.</div>
      </div>
    </div>
  );
}

/* ── Password field with eye toggle ────────────────── */
function PassField({ label, required, error, value, onChange, show, onToggle, leftIcon }) {
  return (
    <Fl label={label} required={required} error={error}>
      <div className={styles.inputWrap}>
        {leftIcon && <span className={styles.inputIcon}>{leftIcon}</span>}
        <input
          className={`${styles.inp} ${error ? styles.inpErr : ''}`}
          type={show ? 'text' : 'password'}
          placeholder="Enter password"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          autoComplete="new-password"
          style={leftIcon ? undefined : { paddingLeft: 11 }}
        />
        <button type="button" className={styles.eyeBtn} onClick={onToggle} aria-label="Toggle visibility">
          {show ? <EyeOff/> : <EyeOpen/>}
        </button>
      </div>
    </Fl>
  );
}

/* ── MAIN COMPONENT ───────────────────────────────── */
export default function StepCredentials({ formData: fd, updateField: upd, errors }) {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showGPass, setShowGPass] = useState(false);
  const [showGConfirm, setShowGConfirm] = useState(false);

  const studentStrength  = useMemo(() => getStrength(fd.password),  [fd.password]);
  const guardianStrength = useMemo(() => getStrength(fd.gPassword), [fd.gPassword]);

  return (
    <div className={styles.layout}>

      {/* ══════════ LEFT FORM ══════════ */}
      <div className={styles.formCol}>

        {/* ── 1. Student Account ── */}
        <div className={styles.sec}>
          <SecHead
            icon={<UserIcon/>}
            iconCls={styles.secIconBrand}
            title="Student Account"
            subtitle="Configure login credentials for the student account."
          />
          <div className={styles.g3}>
            <Fl label="Username" required error={errors.username}>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}><UserIcon/></span>
                <input
                  className={`${styles.inp} ${errors.username ? styles.inpErr : ''}`}
                  type="text" placeholder="Enter username"
                  value={fd.username || ''}
                  onChange={e => upd('username', e.target.value)}
                  autoComplete="off"
                />
              </div>
            </Fl>
            <div>
              <PassField
                label="Password" required
                error={errors.password}
                value={fd.password}
                onChange={v => upd('password', v)}
                show={showPass}
                onToggle={() => setShowPass(p => !p)}
              />
              <StrengthBar strength={studentStrength}/>
            </div>
            <PassField
              label="Confirm Password" required
              error={errors.confirmPass}
              value={fd.confirmPass}
              onChange={v => upd('confirmPass', v)}
              show={showConfirm}
              onToggle={() => setShowConfirm(p => !p)}
            />
          </div>
        </div>

        {/* ── 2. Guardian Account ── */}
        <div className={styles.sec}>
          <SecHead
            icon={<UserIcon/>}
            iconCls={styles.secIconGreen}
            title="Guardian Account"
            subtitle="Configure login credentials for the guardian account."
          />
          <div className={styles.g3}>
            <Fl label="Username" required error={errors.gUsername}>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}><UserIcon/></span>
                <input
                  className={`${styles.inp} ${errors.gUsername ? styles.inpErr : ''}`}
                  type="text" placeholder="Enter username"
                  value={fd.gUsername || ''}
                  onChange={e => upd('gUsername', e.target.value)}
                  autoComplete="off"
                />
              </div>
            </Fl>
            <div>
              <PassField
                label="Password" required
                error={errors.gPassword}
                value={fd.gPassword}
                onChange={v => upd('gPassword', v)}
                show={showGPass}
                onToggle={() => setShowGPass(p => !p)}
              />
              <StrengthBar strength={guardianStrength}/>
            </div>
            <PassField
              label="Confirm Password" required
              error={errors.gConfirmPass}
              value={fd.gConfirmPass}
              onChange={v => upd('gConfirmPass', v)}
              show={showGConfirm}
              onToggle={() => setShowGConfirm(p => !p)}
            />
          </div>
        </div>

        {/* ── 3. Account Options ── */}
        <div className={styles.sec}>
          <SecHead
            icon={<GearIcon/>}
            iconCls={styles.secIconBrand}
            title="Account Options"
            subtitle="Configure account behavior and security options."
          />
          <div className={styles.optionRow}>
            {/* Auto Generate */}
            <div
              className={`${styles.optionCard} ${fd.autoGenerate ? styles.optionCardActive : ''}`}
              onClick={() => upd('autoGenerate', !fd.autoGenerate)}
            >
              <span className={`${styles.optionChk} ${fd.autoGenerate ? styles.optionChkActive : ''}`}>
                {fd.autoGenerate && '✓'}
              </span>
              <div className={styles.optionBody}>
                <div className={styles.optionTitle}>Auto Generate Credentials</div>
                <div className={styles.optionSub}>Automatically generate a secure username and password for the account.</div>
              </div>
              <span className={styles.optionIcon}><KeyIcon/></span>
            </div>

            {/* Force Password Reset */}
            <div
              className={`${styles.optionCard} ${fd.forcePasswordReset ? styles.optionCardActive : ''}`}
              onClick={() => upd('forcePasswordReset', !fd.forcePasswordReset)}
            >
              <span className={`${styles.optionChk} ${fd.forcePasswordReset ? styles.optionChkActive : ''}`}>
                {fd.forcePasswordReset && '✓'}
              </span>
              <div className={styles.optionBody}>
                <div className={styles.optionTitle}>Force Password Reset</div>
                <div className={styles.optionSub}>Require the user to change their password on first login.</div>
              </div>
              <span className={styles.optionIcon}><ShieldIcon/></span>
            </div>
          </div>
        </div>

        {/* ── 4. Credential Delivery Methods ── */}
        <div className={styles.sec} style={{ marginBottom: 0 }}>
          <SecHead
            icon={<BellIcon/>}
            iconCls={styles.secIconAmber}
            title="Credential Delivery Methods"
            subtitle="Select how credentials should be delivered to the user."
          />
          <div className={styles.deliveryRow}>
            {/* Email */}
            <div
              className={`${styles.deliveryCard} ${fd.deliveryEmail ? styles.deliveryCardActive : ''}`}
              onClick={() => upd('deliveryEmail', !fd.deliveryEmail)}
            >
              <span className={`${styles.deliveryChk} ${fd.deliveryEmail ? styles.deliveryChkActive : ''}`}>
                {fd.deliveryEmail && '✓'}
              </span>
              <span className={`${styles.deliveryIcon} ${styles.deliveryIconEmail}`}><MailIcon/></span>
              <span className={styles.deliveryTitle}>Email</span>
              <span className={styles.deliverySub}>Send credentials via email</span>
            </div>

            {/* SMS */}
            <div
              className={`${styles.deliveryCard} ${fd.deliverySms ? styles.deliveryCardActive : ''}`}
              onClick={() => upd('deliverySms', !fd.deliverySms)}
            >
              <span className={`${styles.deliveryChk} ${fd.deliverySms ? styles.deliveryChkActive : ''}`}>
                {fd.deliverySms && '✓'}
              </span>
              <span className={`${styles.deliveryIcon} ${styles.deliveryIconSms}`}><ChatIcon/></span>
              <span className={styles.deliveryTitle}>SMS</span>
              <span className={styles.deliverySub}>Send credentials via SMS</span>
            </div>

            {/* WhatsApp */}
            <div
              className={`${styles.deliveryCard} ${fd.deliveryWhatsapp ? styles.deliveryCardActive : ''}`}
              onClick={() => upd('deliveryWhatsapp', !fd.deliveryWhatsapp)}
            >
              <span className={`${styles.deliveryChk} ${fd.deliveryWhatsapp ? styles.deliveryChkActive : ''}`}>
                {fd.deliveryWhatsapp && '✓'}
              </span>
              <span className={`${styles.deliveryIcon} ${styles.deliveryIconWhatsapp}`}><PhoneIcon/></span>
              <span className={styles.deliveryTitle}>WhatsApp</span>
              <span className={styles.deliverySub}>Send credentials via WhatsApp</span>
            </div>
          </div>
        </div>

      </div>

      {/* ══════════ RIGHT SIDEBAR ══════════ */}
      <aside className={styles.sidebar}>
        <ProvisioningSummary fd={fd}/>
        <AccountsCard fd={fd}/>
        <DeliveryCard fd={fd}/>
        <IdentityStatus/>
      </aside>

    </div>
  );
}
