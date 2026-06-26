import styles from './Step.module.css';

export default function StepPersonType({ personType, onSelect }) {
  const cards = [
    {
      type: 'staff',
      name: 'Staff Onboarding',
      desc: 'Create and provision a staff member.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="8.5" cy="7" r="4"/>
          <polyline points="17 11 19 13 23 9"/>
        </svg>
      ),
    },
    {
      type: 'student',
      name: 'Student Onboarding',
      desc: 'Create a student profile with optional guardian linkage.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      ),
    },
  ];

  return (
    <div className={styles.stepOneContent}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>Select Person Type</h2>
        <p className={styles.stepDesc}>Choose the type of person you want to onboard.</p>
      </div>
      <div className={styles.typeGrid}>
        {cards.map(({ type, name, desc, icon }) => {
          const selected = personType === type;
          return (
            <div
              key={type}
              className={`${styles.typeCard} ${selected ? styles.selected : ''}`}
              onClick={() => onSelect(type)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(type); } }}
              tabIndex={0}
              role="button"
              aria-pressed={selected}
            >
              {/* Check badge */}
              <div className={`${styles.checkBadge} ${selected ? styles.checkVisible : ''}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div className={`${styles.iconBox} ${selected ? styles.iconActive : ''}`}>{icon}</div>
              <h3 className={styles.typeName}>{name}</h3>
              <p className={styles.typeDesc}>{desc}</p>
              <div className={`${styles.radio} ${selected ? styles.radioSelected : ''}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
