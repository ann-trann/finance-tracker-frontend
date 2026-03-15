import React, { useState } from "react"
import { Lang, LABELS } from "./types"
import { Section } from "./Section"

interface Props {
  lang: Lang
}

export const ExportSection: React.FC<Props> = ({ lang }) => {
  const t = LABELS[lang]
  const [exporting, setExporting] = useState<"csv" | "excel" | null>(null)

  const handleExport = (type: "csv" | "excel") => {
    setExporting(type)
    setTimeout(() => setExporting(null), 1800)
  }

  const DownloadIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  )

  const cards = [
    {
      type: "csv" as const,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="8" y1="13" x2="16" y2="13"/>
          <line x1="8" y1="17" x2="16" y2="17"/>
        </svg>
      ),
      iconClass: "export-csv-icon",
      title: t.exportCSV,
      desc: t.exportCSVDesc,
    },
    {
      type: "excel" as const,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <path d="M8 13l2 2 4-4"/>
        </svg>
      ),
      iconClass: "export-excel-icon",
      title: t.exportExcel,
      desc: t.exportExcelDesc,
    },
  ]

  return (
    <Section title={t.exportData} subtitle={t.exportSub}>
      <div className="export-options">
        {cards.map((card) => (
          <div key={card.type} className="export-card">
            <div className={`export-card-icon ${card.iconClass}`}>{card.icon}</div>
            <div className="export-card-info">
              <span className="export-card-title">{card.title}</span>
              <span className="export-card-desc">{card.desc}</span>
            </div>
            <button
              className="btn-ghost btn-sm export-btn"
              onClick={() => handleExport(card.type)}
              disabled={!!exporting}
            >
              {exporting === card.type ? (
                <><span className="spinner" style={{ borderTopColor: "var(--text-sub)" }} /> {t.preparing}</>
              ) : (
                <><DownloadIcon /> {card.title}</>
              )}
            </button>
          </div>
        ))}
      </div>
    </Section>
  )
}