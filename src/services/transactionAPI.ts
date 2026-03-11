import api from "./api"

export const transactionAPI = {
  getAll: (params?: { month?: string; type?: string }) =>
    api.get("/api/transactions", { params }),

  create: (data: {
    amount: number
    type: string
    description: string
    date: string
    categoryId?: string
    walletId: string
  }) => api.post("/api/transactions", data),

  update: (
    id: string,
    data: {
      amount: number
      type: string
      description: string
      date: string
      categoryId?: string
      walletId: string
    }
  ) => api.put(`/api/transactions/${id}`, data),

  delete: (id: string) => api.delete(`/api/transactions/${id}`),

  getSummary: () => api.get("/api/summary"),
}