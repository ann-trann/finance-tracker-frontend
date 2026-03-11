import { useState, useEffect, useCallback } from "react"
import { transactionAPI } from "../services"
import { Summary } from "../types"


// ================= SUMMARY HOOK =================
export const useSummary = () => {
  const [summary, setSummary] = useState<Summary>({
    income: 0,
    expense: 0,
    balance: 0,
  })  // Financial summary state

  const [loading, setLoading] = useState(false)

  // Fetch summary data from API
  const fetchSummary = useCallback(async () => {
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
    fetchSummary()
  }, [fetchSummary])

  return {
    summary,
    loading,
    refetch: fetchSummary,
  } 
}