import React, { createContext, useContext, useState, useEffect } from "react"
import { authAPI } from "../services/api"
import { AuthContextType, User } from "../types"

// Create authentication context
const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {

  // Store current logged-in user
  const [user, setUser] = useState<User | null>(null)

  // Store JWT token (load from localStorage if available)
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  )

  // Restore user session from localStorage on first render
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser && token) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  // Login function: call API and save token + user
  const login = async (email: string, password: string) => {
    const res = await authAPI.login(email, password)
    const { token: newToken, user: newUser } = res.data

    // Save auth data to localStorage
    localStorage.setItem("token", newToken)
    localStorage.setItem("user", JSON.stringify(newUser))

    // Update React state
    setToken(newToken)
    setUser(newUser)
  }

  // Register new user then automatically login
  const register = async (email: string, password: string) => {
    await authAPI.register(email, password)
    await login(email, password)
  }

  // Logout: clear auth data
  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,   // Boolean flag for checking login status
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to access AuthContext easily
export const useAuth = () => {
  const ctx = useContext(AuthContext)

  // Ensure hook is used inside AuthProvider
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
