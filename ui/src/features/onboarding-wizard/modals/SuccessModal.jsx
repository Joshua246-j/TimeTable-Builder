export default function SuccessModal({ onAddAnother, onDashboard }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="success-modal-title">
      <div className="modal-box">
        <div className="modal-icon-wrap success">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h2 className="modal-title" id="success-modal-title">Onboarding Complete!</h2>
        <p className="modal-desc">
          The person has been successfully onboarded into the institution. Their credentials have been created.
        </p>
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onAddAnother}>Add Another Person</button>
          <button className="btn btn-continue" onClick={onDashboard}>Go to Dashboard</button>
        </div>
      </div>
    </div>
  );
}
