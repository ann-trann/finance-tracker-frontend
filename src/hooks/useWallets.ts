import { useEffect, useState, useCallback } from "react"
import { walletAPI } from "../services"
import { Wallet } from "../types"

export const useWallets = () => {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWallets = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await walletAPI.getAll()
      setWallets(res.data)
    } catch (err) {
      console.error("Failed to load wallets", err)
      setError("Failed to load wallets")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWallets()
  }, [fetchWallets])

  const createWallet = async (name: string, balance: number = 0) => {
    const res = await walletAPI.create({ name, balance })
    setWallets((prev) => [res.data, ...prev])
    return res.data
  }

  const updateWallet = async (id: string, name: string, balance: number) => {
    const res = await walletAPI.update(id, { name, balance })
    setWallets((prev) => prev.map((w) => (w.id === id ? res.data : w)))
    return res.data
  }

  const deleteWallet = async (id: string) => {
    await walletAPI.delete(id)
    setWallets((prev) => prev.filter((w) => w.id !== id))
  }

  return {
    wallets,
    loading,
    error,
    refetch: fetchWallets,
    createWallet,
    updateWallet,
    deleteWallet,
  }
}