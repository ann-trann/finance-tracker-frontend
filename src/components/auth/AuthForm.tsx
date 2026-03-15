import React, { useState } from "react"

// Single form field structure
interface Field {
  label: string
  type: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}

// Props for reusable auth form
interface AuthFormProps {
  fields: Field[]
  error?: string
  loading?: boolean
  buttonText: string
  loadingText: string
  onSubmit: (e: React.FormEvent) => void
}

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

const AuthForm: React.FC<AuthFormProps> = ({
  fields, error, loading, buttonText, loadingText, onSubmit,
}) => {
  const [shown, setShown] = useState<Record<number, boolean>>({})

  const toggle = (i: number) =>
    setShown((prev) => ({ ...prev, [i]: !prev[i] }))

  return (
    // Form wrapper
    <form onSubmit={onSubmit} className="auth-form">

      {/* Display error message */}
      {error && <div className="auth-error">{error}</div>}

      {/* Render dynamic fields */}
      {fields.map((field, i) => {
        const isPassword = field.type === "password"
        const inputType  = isPassword && shown[i] ? "text" : field.type

        return (
          <div className="field-group" key={i}>
            <label className="field-label">{field.label}</label>
            <div style={{ position: "relative" }}>
              <input
                type={inputType}
                className="field-input"
                placeholder={field.placeholder}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                style={isPassword ? { paddingRight: 40 } : undefined}
                required
              />
              {isPassword && (
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  style={{
                    position: "absolute", right: 10, top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none",
                    color: "var(--text-muted)", cursor: "pointer",
                    display: "flex", alignItems: "center", padding: 2,
                  }}
                  tabIndex={-1}
                >
                  {shown[i] ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              )}
            </div>
          </div>
        )
      })}

      {/* Submit button */}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading
          ? <span className="btn-loading"><span className="spinner" /> {loadingText}</span>
          : buttonText
        }
      </button>
    </form>
  )
}

export default AuthForm