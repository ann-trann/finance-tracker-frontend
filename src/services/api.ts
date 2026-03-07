import axios from "axios"

// Base URL for backend API
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000"

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE,
})

// Attach JWT token from localStorage to every request header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ================= AUTH API =================
export const authAPI = {
  // Register new user
  register: (email: string, password: string) =>
    api.post("/auth/register", { email, password }),

  // Login user and receive JWT token
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
}

// ================= TRANSACTION API =================
export const transactionAPI = {
  // Get all transactions
  getAll: (params?: { month?: string; type?: string }) =>
    api.get("/api/transactions", { params }),

  // Create new transaction
  create: (data: {
    amount: number
    type: string
    description: string
    date: string
    categoryId?: string
  }) => api.post("/api/transactions", data),

  // Update existing transaction
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

  // Delete transaction by ID
  delete: (id: string) => api.delete(`/api/transactions/${id}`),

  // Get financial summary (income, expense, balance)
  getSummary: () => api.get("/api/transactions/summary"),
}

// ================= CATEGORY API =================
export const categoryAPI = {
  // Get all categories
  getAll: () => api.get("/api/categories"),

  // Create new category
  create: (data: { name: string; type: string }) =>
    api.post("/api/categories", data),
}

export default api
