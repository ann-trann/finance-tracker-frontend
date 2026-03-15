import React, { useState, useEffect } from "react"
import { Lang, LABELS, fmtDate } from "./types"
import { Section } from "./Section"

interface Props {
  email: string
  name: string
  createdAt: string
  lang: Lang
  loadingName: boolean
  nameError: string | null
  nameSuccess: boolean
  onSave: (name: string) => void
}

export const AccountSection: React.FC<Props> = ({
  email, name, createdAt, lang,
  loadingName, nameError, nameSuccess, onSave,
}) => {
  const t = LABELS[lang]
  const [displayName, setDisplayName] = useState(name)

  const getInitials = (e: string) => e ? e[0].toUpperCase() : "?"

  useEffect(() => {
    setDisplayName(name)
  }, [name])

  return (
    <Section title={t.account}>
      <div className="profile-account-row">
        <div className="profile-avatar-wrap">
          <div className="profile-avatar">{getInitials(email)}</div>
          <div className="profile-avatar-ring" />
        </div>

        <div className="profile-fields">
          <div className="field-group">
            <label className="field-label">{t.displayName}</label>
            <input
              className="field-input"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={t.namePlaceholder}
            />
          </div>
          <div className="field-group">
            <label className="field-label">{t.email}</label>
            <input
              className="field-input"
              value={email}
              disabled
              style={{ opacity: 0.6, cursor: "not-allowed" }}
            />
          </div>
          <p className="profile-member-since">
            {t.memberSince} {fmtDate(createdAt, lang)}
          </p>
        </div>
      </div>

      <div className="profile-save-row">
        {nameError && <p className="form-error">{nameError}</p>}
        <button
          className={`btn-primary btn-sm ${nameSuccess ? "btn-success" : ""}`}
          disabled={loadingName || nameSuccess}
          onClick={() => onSave(displayName)}
        >
          {loadingName ? "Saving…" : nameSuccess ? "✓ Saved" : t.save}
        </button>
      </div>
    </Section>
  )
}