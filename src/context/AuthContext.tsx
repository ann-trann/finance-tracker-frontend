import React, { createContext, useContext, useState, useEffect } from "react"
import { authAPI } from "../services"
import { AuthContextType, User } from "../types"

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  )

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser && token) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, password: string) => {
    const res = await authAPI.login(email, password)
    const { token: newToken, user: newUser } = res.data

    localStorage.setItem("token", newToken)
    localStorage.setItem("user", JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  const register = async (email: string, password: string) => {
    await authAPI.register(email, password)
    await login(email, password)
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
  }

  // ← thêm hàm này để cập nhật user trong context + localStorage
  const updateUser = (updated: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev
      const newUser = { ...prev, ...updated }
      localStorage.setItem("user", JSON.stringify(newUser))
      return newUser
    })
  }

  return (
    <AuthContext.Provider value={{
      user, token,
      login, register, logout,
      updateUser,
      isAuthenticated: !!token,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}