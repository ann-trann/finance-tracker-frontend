import React from "react"
import { Lang, LABELS } from "./types"
import { Section } from "./Section"

interface Props {
  lang: Lang
  onChange: (lang: Lang) => void
}

export const LanguageSection: React.FC<Props> = ({ lang, onChange }) => {
  const t = LABELS[lang]

  const options: { value: Lang; flag: string; label: string; code: string }[] = [
    { value: "en", flag: "🇬🇧", label: t.english,    code: "EN" },
    { value: "vi", flag: "🇻🇳", label: t.vietnamese, code: "VI" },
  ]

  return (
    <Section title={t.language} subtitle={t.languageSub}>
      <div className="lang-options">
        {options.map((opt) => (
          <button
            key={opt.value}
            className={`lang-option ${lang === opt.value ? "lang-active" : ""}`}
            onClick={() => onChange(opt.value)}
          >
            <span className="lang-flag">{opt.flag}</span>
            <div className="lang-info">
              <span className="lang-name">{opt.label}</span>
              <span className="lang-code">{opt.code}</span>
            </div>
            {lang === opt.value && (
              <span className="lang-check">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>
    </Section>
  )
}