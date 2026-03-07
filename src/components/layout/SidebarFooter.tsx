import React from "react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

const SidebarFooter: React.FC = () => {
  
  const { user, logout } = useAuth()  // Get user info and logout function
  const navigate = useNavigate()      // Hook to navigate between routes

  // Logout handler
  const handleLogout = () => {
    logout()
    navigate("/login")  // redirect to login page
  }

  return (
    <div className="sidebar-footer">

      {/* Display logged-in user info */}
      <div className="user-info">

        {/* Avatar using first letter of email */}
        <div className="user-avatar">
          {user?.email?.[0]?.toUpperCase() || "U"}
        </div>

        <div className="user-email">{user?.email}</div>
      </div>

      {/* Logout button */}
      <button className="logout-btn" onClick={handleLogout}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
        </svg>
      </button>
    </div>
  )
}

export default SidebarFooter