export default function CancelModal({ onKeepGoing, onConfirm }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="cancel-modal-title">
      <div className="modal-box">
        <div className="modal-icon-wrap warning">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
            <circle cx="12" cy="12" r="10"/>
          </svg>
        </div>
        <h2 className="modal-title" id="cancel-modal-title">Cancel Onboarding?</h2>
        <p className="modal-desc">
          All the information you&apos;ve entered will be lost. Are you sure you want to cancel?
        </p>
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onKeepGoing}>Keep Going</button>
          <button className="btn btn-danger"  onClick={onConfirm}>Yes, Cancel</button>
        </div>
      </div>
    </div>
  );
}
