import React, { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useProfile } from "../hooks"
import { LABELS, Lang } from "../components/profile/types"
import { AccountSection }  from "../components/profile/AccountSection"
import { SecuritySection } from "../components/profile/SecuritySection"
import { LanguageSection } from "../components/profile/LanguageSection"
import { ExportSection }   from "../components/profile/ExportSection"

const Profile: React.FC = () => {
  const { user, logout, updateUser } = useAuth()
  const {
    updateName,     loadingName, nameError,  nameSuccess,
    changePassword, loadingPw,   pwError,    pwSuccess,
  } = useProfile()

  const [lang, setLang] = useState<Lang>("en")
  const t = LABELS[lang]

  const handleSaveName = (name: string) => {
    updateName(name, (newName) => updateUser({ name: newName }))
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t.profile}</h1>
          <p className="page-sub">{t.profileSub}</p>
        </div>
        <button className="btn-ghost profile-logout-btn" onClick={logout}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          {t.logout}
        </button>
      </div>

      <AccountSection
        email={user?.email ?? ""}
        name={user?.name ?? ""}
        createdAt={user?.createdAt ?? new Date().toISOString()}
        lang={lang}
        loadingName={loadingName}
        nameError={nameError}
        nameSuccess={nameSuccess}
        onSave={handleSaveName}
      />

      <LanguageSection lang={lang} onChange={setLang} />

      <ExportSection lang={lang} />

      <SecuritySection
        lang={lang}
        loadingPw={loadingPw}
        pwError={pwError}
        pwSuccess={pwSuccess}
        onSubmit={changePassword}
      />
    </div>
  )
}

export default Profile