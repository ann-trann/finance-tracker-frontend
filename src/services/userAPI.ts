import api from "./api"

export const userAPI = {
  updateName: (name: string) =>
    api.patch("/api/user/name", { name }),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.patch("/api/user/password", { currentPassword, newPassword }),
}