import { useState, useEffect, useCallback } from "react"
import { transactionAPI, categoryAPI } from "../services/api"
import { Transaction, Summary, Category } from "../types"

// ================= TRANSACTIONS HOOK =================
export const useTransactions = (month?: string, type?: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]) // List of transactions
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null) // Error message

  // Fetch transactions from API (with optional filters)
  const fetch = useCallback(async () => {
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
    fetch()
  }, [fetch])

  // Delete transaction and update local state
  const deleteTransaction = async (id: string) => {
    await transactionAPI.delete(id)
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  // Expose data and actions
  return { transactions, loading, error, refetch: fetch, deleteTransaction }
}

// ================= SUMMARY HOOK =================
export const useSummary = () => {
  const [summary, setSummary] = useState<Summary>({
    income: 0,
    expense: 0,
    balance: 0,
  })  // Financial summary state

  const [loading, setLoading] = useState(false)

  // Fetch summary data from API
  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await transactionAPI.getSummary()
      setSummary(res.data)
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch summary when component mounts
  useEffect(() => {
    fetch()
  }, [fetch])

  return { summary, loading, refetch: fetch }
}

// ================= CATEGORY HOOK =================
export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])  // Category list

  // Fetch categories once when component mounts
  useEffect(() => {
    categoryAPI.getAll().then((res) => setCategories(res.data))
  }, [])

  return { categories }
}
