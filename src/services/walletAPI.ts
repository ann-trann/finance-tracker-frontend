import api from "./api"

export const walletAPI = {
  getAll: () => api.get("/api/wallets"),

  create: (data: { name: string; balance?: number }) =>
    api.post("/api/wallets", data),

  update: (id: string, data: { name: string; balance: number }) =>
    api.put(`/api/wallets/${id}`, data),

  delete: (id: string) => api.delete(`/api/wallets/${id}`),
}