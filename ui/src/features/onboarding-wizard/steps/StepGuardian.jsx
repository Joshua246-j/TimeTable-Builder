'use client';
import { useState, useCallback } from 'react';
import styles from './StepGuardian.module.css';

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

/* ─────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────── */
const PeopleIcon = ({ size = 15, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const SearchIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const ShieldIcon = ({ size = 15, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const UserPlusIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/>
    <line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
  </svg>
);

/* ─────────────────────────────────────────────────────
   SIDEBAR CARDS
───────────────────────────────────────────────────── */
function GuardianSummary({ fd }) {
  const hasLinked = !!fd.linkedGuardian;
  return (
    <div className={styles.card}>
      <p className={styles.cardTitle}>Guardian Summary</p>
      <p className={styles.cardSub}>Overview of linked guardians</p>
      <div className={styles.linkedHeader}>Linked Guardians ({hasLinked ? 1 : 0})</div>
      {hasLinked ? (
        <div className={styles.linkedCard}>
          <div className={styles.linkedAvatar}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div>
            <div className={styles.linkedName}>{fd.linkedGuardian.name}</div>
            <div className={styles.linkedRel}>{fd.linkedGuardian.relationship}</div>
          </div>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <PeopleIcon size={22} color="#9ca3af"/>
          </div>
          <p className={styles.emptyTitle}>No guardian linked yet.</p>
          <p className={styles.emptySub}>Search an existing guardian or add a new one below.</p>
        </div>
      )}
    </div>
  );
}

function PrimaryGuardianCard({ fd }) {
  const name = fd.gPrimary ? (fd.gName || 'Not named') : null;
  return (
    <div className={styles.card}>
      <div className={styles.primaryRow}>
        <span className={styles.primaryIcon}><ShieldIcon size={16} color="#4338ca"/></span>
        <span className={styles.primaryLabel}>Primary Guardian</span>
        <span className={name ? styles.primaryValSet : styles.primaryVal}>
          {name || 'Not assigned'}
        </span>
      </div>
    </div>
  );
}

function RelationshipDetails({ fd }) {
  const rows = [
    { lbl: 'Guardian Type',  val: fd.gPrimary ? 'Primary' : (fd.gName ? 'Secondary' : null) },
    { lbl: 'Relationship',   val: fd.gRelation },
    { lbl: 'Contact Number', val: fd.gPhone },
    { lbl: 'Email Address',  val: fd.gEmail },
    { lbl: 'Address',        val: fd.gAddress },
  ];
  return (
    <div className={styles.card}>
      <p className={styles.cardTitle}>Relationship Details</p>
      <div className={styles.detailList} style={{ marginTop: 10 }}>
        {rows.map(r => (
          <div key={r.lbl} className={styles.detailRow}>
            <span className={styles.detailLbl}>{r.lbl}</span>
            <span className={`${styles.detailVal} ${!r.val ? styles.notSet : ''}`}>
              {r.val || 'Not set'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   DEMO SEARCH DATA
───────────────────────────────────────────────────── */
const DEMO_RESULT = {
  name: 'Ramesh Kumar',
  phone: '+91 98765 43210',
  email: 'ramesh.kumar@email.com',
  relationship: 'Father',
};

/* ─────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────── */
export default function StepGuardian({ formData: fd, updateField: upd, errors }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) setShowResult(true);
  }, [searchQuery]);

  const handleLink = useCallback(() => {
    upd('linkedGuardian', DEMO_RESULT);
  }, [upd]);

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

  return (
    <div className={styles.layout}>

      {/* ══════════ LEFT FORM ══════════ */}
      <div className={styles.formCol}>

        {/* ── Existing Guardian Toggle ── */}
        <div className={styles.sec}>
          <div className={styles.toggleRow}>
            <span className={styles.secIcon}><PeopleIcon size={15} color="#4338ca"/></span>
            <label className={styles.toggleLabel}>
              <span className={styles.toggleText}>This family already has a guardian account</span>
              <input type="checkbox" className={styles.toggleChk}
                checked={!!fd.hasGuardian}
                onChange={e => upd('hasGuardian', e.target.checked)}/>
              <span className={styles.toggleTrack}/>
            </label>
          </div>
        </div>

        {/* ── Search Guardian (conditional) ── */}
        {fd.hasGuardian && (
          <div className={styles.sec}>
            <SecHead icon={<SearchIcon size={15}/>} title="Search Guardian" sub="Find an existing guardian by phone or email."/>

            {/* Radio Tabs */}
            <div className={styles.radioTabs}>
              <button type="button"
                className={`${styles.radioTab} ${(fd.searchMode || 'phone') === 'phone' ? styles.radioTabActive : ''}`}
                onClick={() => upd('searchMode', 'phone')}>
                Search by Phone
              </button>
              <button type="button"
                className={`${styles.radioTab} ${fd.searchMode === 'email' ? styles.radioTabActive : ''}`}
                onClick={() => upd('searchMode', 'email')}>
                Search by Email
              </button>
            </div>

            {/* Search Input */}
            <div className={styles.searchRow}>
              {(fd.searchMode || 'phone') === 'phone' ? (
                <div className={styles.searchPhone}>
                  <select className={styles.searchCode} defaultValue="+91">
                    <option>+91</option><option>+1</option><option>+44</option><option>+971</option>
                  </select>
                  <input className={styles.searchInput} type="tel"
                    placeholder="Enter phone number"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}/>
                </div>
              ) : (
                <input className={styles.inp} type="email" style={{ flex: 1 }}
                  placeholder="Enter email address"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}/>
              )}
              <button type="button" className={styles.searchBtn} onClick={handleSearch}>Search</button>
            </div>

            {/* Search Results */}
            {showResult && (
              <>
                <p style={{ fontSize: 11.5, fontWeight: 600, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.04em' }}>Search Results</p>
                <div className={styles.resultCard}>
                  <div className={styles.resultAvatar}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div className={styles.resultInfo}>
                    <div className={styles.resultName}>{DEMO_RESULT.name}</div>
                    <div className={styles.resultMeta}>
                      <span>📞 {DEMO_RESULT.phone}</span>
                      <span>✉ {DEMO_RESULT.email}</span>
                    </div>
                    <span className={styles.resultRelBadge}>Relationship: {DEMO_RESULT.relationship}</span>
                  </div>
                  <button type="button" className={styles.linkBtn} onClick={handleLink}>Link Guardian</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── OR Divider ── */}
        <div className={styles.orDivider}>
          <span className={styles.orLine}/>
          <span>OR</span>
          <span className={styles.orLine}/>
        </div>

        {/* ── Add Guardian ── */}
        <div className={styles.sec}>
          <SecHead icon={<UserPlusIcon size={15}/>}
            title="Add Guardian"
            sub="Create a new guardian profile for this person."/>

          {/* Row 1: Name, Relationship, Primary */}
          <div className={styles.g3}>
            <Fl label="Guardian Name" required error={errors.gName}>
              <input {...i('gName')} type="text" placeholder="Enter guardian name"/>
            </Fl>
            <Fl label="Relationship" required error={errors.gRelation}>
              <select {...s('gRelation')}>
                <option value="">Select relationship</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Sibling">Sibling</option>
                <option value="Spouse">Spouse</option>
                <option value="Uncle">Uncle</option>
                <option value="Aunt">Aunt</option>
                <option value="Grandparent">Grandparent</option>
                <option value="Other">Other</option>
              </select>
            </Fl>
            <Fl label={<>Primary Guardian <span className={styles.tooltipIcon} title="The primary guardian will be the main point of contact">?</span></>}>
              <label className={styles.toggleLabel} style={{ marginTop: 2 }}>
                <input type="checkbox" className={styles.toggleChk}
                  checked={!!fd.gPrimary}
                  onChange={e => upd('gPrimary', e.target.checked)}/>
                <span className={styles.toggleTrack}/>
                <span style={{ fontSize: 12, color: '#6b7280' }}>{fd.gPrimary ? 'Yes' : 'No'}</span>
              </label>
            </Fl>
          </div>

          {/* Row 2: Phone, Email, Occupation */}
          <div className={styles.g3}>
            <Fl label="Phone Number" required error={errors.gPhone}>
              <div className={`${styles.phoneWrap} ${errors.gPhone ? styles.phoneErr : ''}`}>
                <select className={styles.phoneCode}
                  value={fd.gPhoneCode || '+91'}
                  onChange={e => upd('gPhoneCode', e.target.value)}>
                  <option>+91</option><option>+1</option><option>+44</option><option>+971</option><option>+61</option>
                </select>
                <input className={styles.phoneNum} type="tel" placeholder="Enter phone number"
                  value={fd.gPhone || ''}
                  onChange={e => upd('gPhone', e.target.value)}/>
              </div>
            </Fl>
            <Fl label="Email Address">
              <input {...i('gEmail')} type="email" placeholder="Enter email address"/>
            </Fl>
            <Fl label="Occupation">
              <input {...i('gOccupation')} type="text" placeholder="Enter occupation"/>
            </Fl>
          </div>

          {/* Row 3: Address */}
          <div className={styles.g1}>
            <Fl label="Address" required error={errors.gAddress}>
              <textarea
                className={`${styles.inp} ${styles.ta} ${errors.gAddress ? styles.inpErr : ''}`}
                placeholder="Enter guardian address"
                value={fd.gAddress || ''}
                maxLength={300}
                onChange={e => upd('gAddress', e.target.value)}/>
              <span className={styles.charCount}>{(fd.gAddress || '').length}/300</span>
            </Fl>
          </div>
        </div>

      </div>

      {/* ══════════ RIGHT SIDEBAR ══════════ */}
      <aside className={styles.sidebar}>
        <GuardianSummary fd={fd}/>
        <PrimaryGuardianCard fd={fd}/>
        <RelationshipDetails fd={fd}/>
      </aside>

    </div>
  );
}
