import React from "react"
import { Link, useLocation } from "react-router-dom"

interface Props {
  setMobileOpen: (value: boolean) => void
}

// Navigation items displayed in the sidebar
const navItems = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    path: "/transactions",
    label: "Transactions",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
      </svg>
    ),
  },
  {
    path: "/wallets",
    label: "Wallets",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 0 2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-7H5" />
        <path d="M16 13h4v4h-4a2 2 0 1 1 0-4z" />
      </svg>
    ),
  },
  {
    path: "/add-transaction",
    label: "Add Transaction",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
  },
]

const SidebarNav: React.FC<Props> = ({ setMobileOpen }) => {

  // Get current route path
  const location = useLocation()

  return (
    <nav className="sidebar-nav">

      {/* Generate navigation links */}
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}

          // Highlight active route
          className={`nav-item ${
            location.pathname === item.path ? "nav-item-active" : ""
          }`}

          // Close sidebar on mobile when a link is clicked
          onClick={() => setMobileOpen(false)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}

export default SidebarNav