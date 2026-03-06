import { useState } from "react"
import api from "../services/api"

export const useAuth = () => {
  const [loading, setLoading] = useState(false)

  const login = async (email: string, password: string) => {
    setLoading(true)

    const res = await api.post("/auth/login", {
      email,
      password
    })

    localStorage.setItem("token", res.data.token)

    setLoading(false)
  }

  const register = async (email: string, password: string) => {
    await api.post("/auth/register", {
      email,
      password
    })
  }

  const logout = () => {
    localStorage.removeItem("token")
  }

  return { login, register, logout, loading }
}