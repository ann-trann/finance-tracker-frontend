import React from "react"
import SidebarNav from "./SidebarNav"
import SidebarFooter from "./SidebarFooter"

interface Props {
  mobileOpen: boolean
  setMobileOpen: (value: boolean) => void
}

const Sidebar: React.FC<Props> = ({ mobileOpen, setMobileOpen }) => {
  return (

    // Sidebar container (adds class when open on mobile)
    <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>

      {/* App logo */}
      <div className="sidebar-logo">
        <div className="logo-mark">F</div>
        <span className="logo-text">Fintrack</span>
      </div>

      {/* Navigation links */}
      <SidebarNav setMobileOpen={setMobileOpen} />

      {/* User info and logout */}
      <SidebarFooter />
    </aside>
  )
}

export default Sidebar