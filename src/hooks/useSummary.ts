import { useState, useEffect, useCallback } from "react"
import { transactionAPI } from "../services"
import { Summary } from "../types"

export const useSummary = (month?: string) => {
  const [summary, setSummary] = useState<Summary>({
    income: 0,
    expense: 0,
    balance: 0,
    categories: [],
  })
  const [loading, setLoading] = useState(false)

  const fetchSummary = useCallback(async () => {
    setLoading(true)
    try {
      const res = await transactionAPI.getSummary(month)
      setSummary(res.data)
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }, [month])

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  return {
    summary,
    loading,
    refetch: fetchSummary,
  }
}