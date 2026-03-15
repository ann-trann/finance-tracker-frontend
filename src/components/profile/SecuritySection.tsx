import React, { useState } from "react"
import { Lang, LABELS } from "./types"
import { Section } from "./Section"

interface Props {
  lang: Lang
  loadingPw: boolean
  pwError: string | null
  pwSuccess: boolean
  onSubmit: (currentPw: string, newPw: string) => void
}

export const SecuritySection: React.FC<Props> = ({
  lang, loadingPw, pwError, pwSuccess, onSubmit,
}) => {
  const t = LABELS[lang]
  const [showForm, setShowForm]   = useState(false)
  const [currentPw, setCurrentPw] = useState("")
  const [newPw, setNewPw]         = useState("")
  const [confirmPw, setConfirmPw] = useState("")
  const [matchError, setMatchError] = useState<string | null>(null)

  const handleSubmit = () => {
    if (newPw !== confirmPw) {
      setMatchError("Passwords do not match")
      return
    }
    setMatchError(null)
    onSubmit(currentPw, newPw)
  }

  const handleCancel = () => {
    setShowForm(false)
    setCurrentPw(""); setNewPw(""); setConfirmPw("")
    setMatchError(null)
  }

  // Close form on success
  React.useEffect(() => {
    if (pwSuccess) {
      setShowForm(false)
      setCurrentPw(""); setNewPw(""); setConfirmPw("")
    }
  }, [pwSuccess])

  return (
    <Section title={t.security} subtitle={t.securitySub}>
      {!showForm ? (
        <button className="btn-ghost change-pw-btn" onClick={() => setShowForm(true)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          {t.changePassword}
        </button>
      ) : (
        <div className="pw-form">
          <div className="field-group">
            <label className="field-label">{t.currentPassword}</label>
            <input className="field-input" type="password"
              value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} autoFocus />
          </div>
          <div className="field-group">
            <label className="field-label">{t.newPassword}</label>
            <input className="field-input" type="password"
              value={newPw} onChange={(e) => setNewPw(e.target.value)} />
          </div>
          <div className="field-group">
            <label className="field-label">{t.confirmPassword}</label>
            <input className="field-input" type="password"
              value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
          </div>

          {matchError && <p className="form-error">{matchError}</p>}
          {pwError    && <p className="form-error">{pwError}</p>}
          {pwSuccess  && <p className="form-success">Password updated!</p>}

          <div className="pw-form-actions">
            <button className="btn-ghost" onClick={handleCancel}>{t.cancel}</button>
            <button className="btn-primary" onClick={handleSubmit} disabled={loadingPw}>
              {loadingPw ? "Updating…" : t.updatePassword}
            </button>
          </div>
        </div>
      )}
    </Section>
  )
}