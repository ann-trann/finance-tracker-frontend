import React, { useState } from "react"
import { useProfile } from "../hooks"
import { useAuth } from "../context/AuthContext"

// ── Types ──────────────────────────────────────────
type Lang = "en" | "vi"

const LABELS: Record<Lang, Record<string, string>> = {
  en: {
    profile:         "Profile",
    profileSub:      "Manage your account settings",
    account:         "Account",
    displayName:     "Display Name",
    email:           "Email",
    memberSince:     "Member since",
    language:        "Language",
    languageSub:     "Choose your preferred language",
    english:         "English",
    vietnamese:      "Vietnamese",
    exportData:      "Export Data",
    exportSub:       "Download your transactions",
    exportCSV:       "Export as CSV",
    exportExcel:     "Export as Excel",
    exportCSVDesc:   "Comma-separated values, compatible with any spreadsheet app",
    exportExcelDesc: "Microsoft Excel format (.xlsx)",
    security:        "Security",
    securitySub:     "Update your password",
    currentPassword: "Current Password",
    newPassword:     "New Password",
    confirmPassword: "Confirm New Password",
    updatePassword:  "Update Password",
    cancel:          "Cancel",
    changePassword:  "Change Password",
    logout:          "Log out",
    save:            "Save Changes",
    namePlaceholder: "Your name",
    preparing:       "Preparing…",
  },
  vi: {
    profile:         "Hồ sơ",
    profileSub:      "Quản lý cài đặt tài khoản của bạn",
    account:         "Tài khoản",
    displayName:     "Tên hiển thị",
    email:           "Email",
    memberSince:     "Thành viên từ",
    language:        "Ngôn ngữ",
    languageSub:     "Chọn ngôn ngữ ưa thích",
    english:         "Tiếng Anh",
    vietnamese:      "Tiếng Việt",
    exportData:      "Xuất dữ liệu",
    exportSub:       "Tải xuống các giao dịch của bạn",
    exportCSV:       "Xuất CSV",
    exportExcel:     "Xuất Excel",
    exportCSVDesc:   "Định dạng CSV, tương thích với mọi ứng dụng bảng tính",
    exportExcelDesc: "Định dạng Microsoft Excel (.xlsx)",
    security:        "Bảo mật",
    securitySub:     "Cập nhật mật khẩu của bạn",
    currentPassword: "Mật khẩu hiện tại",
    newPassword:     "Mật khẩu mới",
    confirmPassword: "Xác nhận mật khẩu mới",
    updatePassword:  "Cập nhật mật khẩu",
    cancel:          "Hủy",
    changePassword:  "Đổi mật khẩu",
    logout:          "Đăng xuất",
    save:            "Lưu thay đổi",
    namePlaceholder: "Tên của bạn",
    preparing:       "Đang chuẩn bị…",
  },
}

// ── Helpers ────────────────────────────────────────
const getInitials = (email: string) =>
  email ? email[0].toUpperCase() : "?"

const fmtDate = (d: string | Date, lang: Lang) =>
  new Date(d).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", {
    day: "numeric", month: "long", year: "numeric",
  })

// ── Section wrapper ────────────────────────────────
const Section: React.FC<{
  title: string
  subtitle?: string
  children: React.ReactNode
}> = ({ title, subtitle, children }) => (
  <div className="profile-section">
    <div className="profile-section-header">
      <div>
        <h2 className="profile-section-title">{title}</h2>
        {subtitle && <p className="profile-section-sub">{subtitle}</p>}
      </div>
    </div>
    <div className="profile-section-body">{children}</div>
  </div>
)

// ── Main component ─────────────────────────────────
const Profile: React.FC = () => {
  const { user, logout } = useAuth() as any

  const {
    updateName,    loadingName, nameError,  nameSuccess,
    changePassword, loadingPw,  pwError,    pwSuccess,
  } = useProfile()

  const [lang, setLang]         = useState<Lang>("en")
  const [displayName, setDisplayName] = useState(user?.name ?? "")
  const [showPwForm, setShowPwForm]   = useState(false)
  const [currentPw, setCurrentPw]     = useState("")
  const [newPw, setNewPw]             = useState("")
  const [confirmPw, setConfirmPw]     = useState("")
  const [exporting, setExporting]     = useState<"csv" | "excel" | null>(null)

  const t = LABELS[lang]

  const handleExport = (type: "csv" | "excel") => {
    setExporting(type)
    setTimeout(() => setExporting(null), 1800) // simulate
  }

  const handlePasswordSubmit = async () => {
    if (newPw !== confirmPw) {
      return
    }
    await changePassword(currentPw, newPw, () => {
      setShowPwForm(false)
      setCurrentPw(""); setNewPw(""); setConfirmPw("")
    })
  }

  const email      = user?.email ?? "user@example.com"
  const joinedDate = user?.createdAt ?? new Date().toISOString()

  return (
    <div className="profile-page">

      {/* ── Page header ── */}
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

      {/* ── Account ── */}
      <Section title={t.account} subtitle={undefined}>
        <div className="profile-account-row">

          {/* Avatar */}
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">
              {getInitials(email)}
            </div>
            <div className="profile-avatar-ring" />
          </div>

          {/* Fields */}
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
              {t.memberSince} {fmtDate(joinedDate, lang)}
            </p>
          </div>
        </div>

        <div className="profile-save-row">
          {nameError   && <p className="form-error">{nameError}</p>}
          {nameSuccess && <p className="form-success">Name updated!</p>}
          <button
            className="btn-primary btn-sm"
            disabled={loadingName}
            onClick={() => updateName(displayName)}
          >
            {loadingName ? "Saving…" : t.save}
          </button>
        </div>
      </Section>

      {/* ── Language ── */}
      <Section title={t.language} subtitle={t.languageSub}>
        <div className="lang-options">
          <button
            className={`lang-option ${lang === "en" ? "lang-active" : ""}`}
            onClick={() => setLang("en")}
          >
            <span className="lang-flag">🇬🇧</span>
            <div className="lang-info">
              <span className="lang-name">{t.english}</span>
              <span className="lang-code">EN</span>
            </div>
            {lang === "en" && (
              <span className="lang-check">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
            )}
          </button>

          <button
            className={`lang-option ${lang === "vi" ? "lang-active" : ""}`}
            onClick={() => setLang("vi")}
          >
            <span className="lang-flag">🇻🇳</span>
            <div className="lang-info">
              <span className="lang-name">{t.vietnamese}</span>
              <span className="lang-code">VI</span>
            </div>
            {lang === "vi" && (
              <span className="lang-check">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
            )}
          </button>
        </div>
      </Section>

      {/* ── Export ── */}
      <Section title={t.exportData} subtitle={t.exportSub}>
        <div className="export-options">

          <div className="export-card">
            <div className="export-card-icon export-csv-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="8" y1="13" x2="16" y2="13"/>
                <line x1="8" y1="17" x2="16" y2="17"/>
              </svg>
            </div>
            <div className="export-card-info">
              <span className="export-card-title">{t.exportCSV}</span>
              <span className="export-card-desc">{t.exportCSVDesc}</span>
            </div>
            <button
              className="btn-ghost btn-sm export-btn"
              onClick={() => handleExport("csv")}
              disabled={!!exporting}
            >
              {exporting === "csv" ? (
                <><span className="spinner" style={{ borderTopColor: "var(--text-sub)" }} /> {t.preparing}</>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  {t.exportCSV}
                </>
              )}
            </button>
          </div>

          <div className="export-card">
            <div className="export-card-icon export-excel-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <path d="M8 13l2 2 4-4"/>
              </svg>
            </div>
            <div className="export-card-info">
              <span className="export-card-title">{t.exportExcel}</span>
              <span className="export-card-desc">{t.exportExcelDesc}</span>
            </div>
            <button
              className="btn-ghost btn-sm export-btn"
              onClick={() => handleExport("excel")}
              disabled={!!exporting}
            >
              {exporting === "excel" ? (
                <><span className="spinner" style={{ borderTopColor: "var(--text-sub)" }} /> {t.preparing}</>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  {t.exportExcel}
                </>
              )}
            </button>
          </div>

        </div>
      </Section>

      {/* ── Security ── */}
      <Section title={t.security} subtitle={t.securitySub}>
        {!showPwForm ? (
          <button
            className="btn-ghost change-pw-btn"
            onClick={() => setShowPwForm(true)}
          >
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
              <input
                className="field-input"
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                autoFocus
              />
            </div>
            <div className="field-group">
              <label className="field-label">{t.newPassword}</label>
              <input
                className="field-input"
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
              />
            </div>
            <div className="field-group">
              <label className="field-label">{t.confirmPassword}</label>
              <input
                className="field-input"
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
              />
            </div>

            {pwError   && <p className="form-error">{pwError}</p>}
            {pwSuccess && <p className="form-success">Password updated!</p>}

            <div className="pw-form-actions">
              <button
                className="btn-ghost"
                onClick={() => {
                  setShowPwForm(false)
                  setCurrentPw(""); setNewPw(""); setConfirmPw("")
                }}
              >
                {t.cancel}
              </button>
              <button
                className="btn-primary"
                onClick={handlePasswordSubmit}
                disabled={loadingPw}
              >
                {loadingPw ? "Updating…" : t.updatePassword}
              </button>
            </div>

          </div>
        )}
      </Section>

    </div>
  )
}

export default Profile