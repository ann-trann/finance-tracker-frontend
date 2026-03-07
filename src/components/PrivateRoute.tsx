import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

// Component that protects routes from unauthenticated access
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // Get authentication status from AuthContext
  const { isAuthenticated } = useAuth()

  // If user is authenticated → render the protected content
  // Otherwise → redirect to login page
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export default PrivateRoute
