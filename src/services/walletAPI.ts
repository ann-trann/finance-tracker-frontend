import api from "./api"

export const walletAPI = {
  getAll: () => api.get("/api/wallets"),

  getById: (id: string) => api.get(`/api/wallets/${id}`),

  create: (data: { name: string; initialBalance?: number }) =>
    api.post("/api/wallets", { name, initialBalance: data.initialBalance }),

  update: (id: string, data: { name: string; initialBalance: number }) =>
    api.put(`/api/wallets/${id}`, data),

  delete: (id: string) => api.delete(`/api/wallets/${id}`),
}