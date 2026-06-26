export default function FormField({ label, required, error, hint, children, className }) {
  return (
    <div className={`form-group${className ? ` ${className}` : ''}`}>
      {label && (
        <label className="form-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      {children}
      {hint  && <span className="form-hint">{hint}</span>}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}
