import api from "./api"

export const authAPI = {
  register: (email: string, password: string) =>
    api.post("/auth/register", { email, password }),

  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
}