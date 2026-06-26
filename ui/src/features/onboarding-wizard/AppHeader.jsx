import styles from './AppHeader.module.css';

export default function AppHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        </div>
        <div>
          <h1 className={styles.title}>Person Onboarding</h1>
          <p className={styles.subtitle}>Create and onboard a new person into the institution.</p>
        </div>
      </div>
      <div className={styles.avatar}>AK</div>
    </header>
  );
}
