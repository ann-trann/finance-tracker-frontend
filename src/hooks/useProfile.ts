import { useState } from "react"
import { userAPI } from "../services/userAPI"

export const useProfile = (onNameUpdated?: (name: string) => void) => {
  const [loadingName,    setLoadingName]   = useState(false)
  const [loadingPw,      setLoadingPw]     = useState(false)
  const [nameError,      setNameError]     = useState<string | null>(null)
  const [nameSuccess,    setNameSuccess]   = useState(false)
  const [pwError,        setPwError]       = useState<string | null>(null)
  const [pwSuccess,      setPwSuccess]     = useState(false)

  const updateName = async (name: string, onSuccess?: (name: string) => void) => {
    setNameError(null)
    setNameSuccess(false)
    setLoadingName(true)
    try {
      const res = await userAPI.updateName(name)
      setNameSuccess(true)
      onSuccess?.(res.data.user.name)
      setTimeout(() => setNameSuccess(false), 2000)
      const updatedName = res.data.user.name
      onSuccess?.(updatedName)
      onNameUpdated?.(updatedName)
    } catch (err: any) {
      setNameError(err.response?.data?.error ?? "Failed to update name")
    } finally {
      setLoadingName(false)
    }
  }

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
    onSuccess?: () => void
  ) => {
    setPwError(null)
    setPwSuccess(false)
    setLoadingPw(true)
    try {
      await userAPI.changePassword(currentPassword, newPassword)
      setPwSuccess(true)
      onSuccess?.()
    } catch (err: any) {
      setPwError(err.response?.data?.error ?? "Failed to change password")
    } finally {
      setLoadingPw(false)
    }
  }

  return {
    updateName, loadingName, nameError,  nameSuccess,
    changePassword, loadingPw, pwError,  pwSuccess,
  }
}