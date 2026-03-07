import React from "react"

interface Props {
  mobileOpen: boolean
  setMobileOpen: (value: boolean) => void
}

const MobileHeader: React.FC<Props> = ({ mobileOpen, setMobileOpen }) => {
  return (
    <div className="mobile-header">

      {/* Hamburger button to toggle sidebar */}
      <button
        className="hamburger"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      {/* Hamburger button to toggle sidebar */}
      <span className="mobile-logo">Fintrack</span>
    </div>
  )
}

export default MobileHeader