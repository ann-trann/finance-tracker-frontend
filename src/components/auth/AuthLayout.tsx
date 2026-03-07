import React from "react"

// Props for layout component
interface AuthLayoutProps {
  title: string
  subtitle: string
  children: React.ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    // Main auth page container
    <div className="auth-page">
      
      {/* Background decorative elements */}
      <div className="auth-bg">
        <div className="auth-blob auth-blob-1" />
        <div className="auth-blob auth-blob-2" />
      </div>

      {/* Card container for auth content */}
      <div className="auth-card">
        
        {/* Header section */}
        <div className="auth-header">
          <div className="auth-logo">F</div>
          <h1 className="auth-title">{title}</h1>
          <p className="auth-subtitle">{subtitle}</p>
        </div>

        {/* Form or custom content */}
        {children}

      </div>
    </div>
  )
}

export default AuthLayout