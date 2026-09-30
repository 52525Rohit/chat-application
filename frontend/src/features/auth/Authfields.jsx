import React from "react";
import { Eye, EyeOff } from "lucide-react";

export function Field({
  label,
  id,
  name,
  icon: Icon,
  type = "text",
  style,
  children,
  ...rest
}) {
  return (
    <div className="auth-input animation" style={style}>
      <input id={id} name={name || id} type={type} placeholder=" " {...rest} />
      <label htmlFor={id}>{label}</label>
      {children || (Icon && <Icon size={18} className="auth-icon" />)}
    </div>
  );
}

export function PasswordToggle({ shown, onToggle }) {
  return (
    <button
      type="button"
      className="auth-icon auth-eye"
      onClick={onToggle}
      aria-label={shown ? "Hide password" : "Show password"}
    >
      {shown ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );
}

export function SubmitButton({ loading, loadingText, children, style }) {
  return (
    <div className="animation" style={style}>
      <button type="submit" className="auth-btn" disabled={loading}>
        {loading ? loadingText : children}
      </button>
    </div>
  );
}
