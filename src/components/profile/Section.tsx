// src/components/layout/Section.tsx
import React from "react"

export const Section: React.FC<{
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