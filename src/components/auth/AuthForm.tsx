import React from "react"

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

const AuthForm: React.FC<AuthFormProps> = ({
  fields,
  error,
  loading,
  buttonText,
  loadingText,
  onSubmit,
}) => {
  return (
    // Form wrapper
    <form onSubmit={onSubmit} className="auth-form">

      {/* Display error message */}
      {error && <div className="auth-error">{error}</div>}

      {/* Render dynamic fields */}
      {fields.map((field, index) => (
        <div className="field-group" key={index}>
          <label className="field-label">{field.label}</label>

          <input
            type={field.type}
            className="field-input"
            placeholder={field.placeholder}
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            required
          />
        </div>
      ))}

      {/* Submit button */}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? (
          <span className="btn-loading">
            <span className="spinner" /> {loadingText}
          </span>
        ) : (
          buttonText
        )}
      </button>
    </form>
  )
}

export default AuthForm