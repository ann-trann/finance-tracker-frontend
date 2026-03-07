import { useState } from "react"
import api from "../services/api"

// Custom hook for authentication actions
export const useAuth = () => {

  // Loading state for login request
  const [loading, setLoading] = useState(false)

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true)

    // Send login request to backend
    const res = await api.post("/auth/login", {
      email,
      password
    })

    // Save JWT token to localStorage
    localStorage.setItem("token", res.data.token)

    setLoading(false)
  }

  // Register new user
  const register = async (email: string, password: string) => {
    await api.post("/auth/register", {
      email,
      password
    })
  }

  // Logout user by removing token
  const logout = () => {
    localStorage.removeItem("token")
  }

  // Expose functions and loading state
  return { login, register, logout, loading }
}