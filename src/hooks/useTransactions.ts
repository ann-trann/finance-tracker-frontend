import { useState, useEffect, useCallback } from "react"
import { transactionAPI } from "../services"
import { Transaction } from "../types"


// ================= TRANSACTIONS HOOK =================
export const useTransactions = (month?: string, type?: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]) // List of transactions
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null) // Error message

  // Fetch transactions from API (with optional filters)
  const fetchTransactions = useCallback(async () => {
    setLoading(true)

    try {
      const res = await transactionAPI.getAll({ month, type })
      setTransactions(res.data)
    } catch {
      setError("Failed to load transactions")
    } finally {
      setLoading(false)
    }
  }, [month, type])

  // Fetch data when component mounts or filters change
  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  // Delete transaction and update local state
  const deleteTransaction = async (id: string) => {
    await transactionAPI.delete(id)
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  // Expose data and actions
  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
    deleteTransaction,
  }
}