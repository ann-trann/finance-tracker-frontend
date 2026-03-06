import axios from "axios"

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000"

const api = axios.create({
  baseURL: API_BASE,
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const authAPI = {
  register: (email: string, password: string) =>
    api.post("/auth/register", { email, password }),
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
}

// Transactions
export const transactionAPI = {
  getAll: (params?: { month?: string; type?: string }) =>
    api.get("/api/transactions", { params }),
  create: (data: {
    amount: number
    type: string
    description: string
    date: string
    categoryId?: string
  }) => api.post("/api/transactions", data),
  update: (
    id: string,
    data: {
      amount: number
      type: string
      description: string
      date: string
      categoryId?: string
    }
  ) => api.put(`/api/transactions/${id}`, data),
  delete: (id: string) => api.delete(`/api/transactions/${id}`),
  getSummary: () => api.get("/api/transactions/summary"),
}

// Categories
export const categoryAPI = {
  getAll: () => api.get("/api/categories"),
  create: (data: { name: string; type: string }) =>
    api.post("/api/categories", data),
}

export default api
