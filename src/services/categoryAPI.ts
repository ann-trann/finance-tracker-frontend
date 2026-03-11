import api from "./api"

export const categoryAPI = {
  getAll: () => api.get("/api/categories"),

  create: (data: { name: string; type: string; parentId?: string }) =>
    api.post("/api/categories", data),
}