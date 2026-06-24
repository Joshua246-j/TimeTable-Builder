import styles from './StepProgress.module.css';

const STEP_LABELS = [
  'Person\nType',
  'Personal\nInformation',
  'Guardian',
  'Academic\nQualifications',
  'Academic\nPlacement',
  'Credentials',
  'Review',
];

export default function StepProgress({ currentStep, totalSteps, onStepClick }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.track}>
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isActive    = step === currentStep;
          const isCompleted = step < currentStep;

          return (
            <div key={step} className={styles.stepGroup}>
              <div
                className={`${styles.stepItem} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}
                onClick={() => onStepClick(step)}
                role="button"
                tabIndex={isCompleted ? 0 : -1}
                aria-label={`Step ${step}: ${STEP_LABELS[i].replace('\n', ' ')}`}
                onKeyDown={(e) => { if (e.key === 'Enter') onStepClick(step); }}
              >
                <div className={styles.circle}>
                  {isCompleted ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : step}
                </div>
                <span className={styles.label}>
                  {STEP_LABELS[i].split('\n').map((line, idx) => (
                    <span key={idx}>{line}{idx === 0 && STEP_LABELS[i].includes('\n') ? <br/> : ''}</span>
                  ))}
                </span>
              </div>
              {step < totalSteps && (
                <div className={`${styles.connector} ${isCompleted ? styles.filled : ''}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
