import { useState, useEffect, useCallback } from "react"
import { transactionAPI, categoryAPI } from "../services/api"
import { Transaction, Summary, Category } from "../types"

export const useTransactions = (month?: string, type?: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  useEffect(() => {
    fetch()
  }, [fetch])

  const deleteTransaction = async (id: string) => {
    await transactionAPI.delete(id)
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  return { transactions, loading, error, refetch: fetch, deleteTransaction }
}

export const useSummary = () => {
  const [summary, setSummary] = useState<Summary>({
    income: 0,
    expense: 0,
    balance: 0,
  })
  const [loading, setLoading] = useState(false)

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

  useEffect(() => {
    fetch()
  }, [fetch])

  return { summary, loading, refetch: fetch }
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    categoryAPI.getAll().then((res) => setCategories(res.data))
  }, [])

  return { categories }
}
