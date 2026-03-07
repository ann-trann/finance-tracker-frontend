import React, { useState } from "react"
import Sidebar from "./Sidebar"
import MobileHeader from "./MobileHeader"

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // State to control whether the mobile sidebar is open
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="app-shell">

      {/* Dark overlay shown when sidebar is open on mobile */}
      {mobileOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileOpen(false)} // close sidebar when clicking outside
        />
      )}

      {/* Sidebar navigation */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <main className="main-content">
        
        {/* Mobile header with hamburger menu */}
        <MobileHeader
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* Page content injected by routes */}
        <div className="page-content">{children}</div>
      </main>
    </div>
  )
}

export default Layout