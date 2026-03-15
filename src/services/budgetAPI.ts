import api from "./api"

export const budgetAPI = {
  getAll: (period?: string) =>
    api.get("/api/budgets", { params: period ? { period } : {} }),

  getProgress: (period?: string) =>
    api.get("/api/budgets/progress", { params: period ? { period } : {} }),

  create: (data: { categoryId: string; amount: number; period?: string }) =>
    api.post("/api/budgets", data),

  delete: (id: string) => api.delete(`/api/budgets/${id}`),
}