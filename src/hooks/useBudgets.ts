import { useState, useEffect, useCallback } from "react"
import { Budget, BudgetProgress } from "../types"
import { budgetAPI } from "../services"

export const useBudgets = (period?: string) => {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [progress, setProgress] = useState<BudgetProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
 
  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [bRes, pRes] = await Promise.all([
        budgetAPI.getAll(period),
        budgetAPI.getProgress(period),
      ])
      setBudgets(bRes.data)
      setProgress(pRes.data)
    } catch (e) {
      console.error(e)
      setError("Không tải được dữ liệu ngân sách")
    } finally {
      setLoading(false)
    }
  }, [period])
 
  useEffect(() => { fetchAll() }, [fetchAll])
 
  const createBudget = async (data: { categoryId: string; amount: number; period?: string }) => {
    await budgetAPI.create(data)
    await fetchAll()
  }
 
  const deleteBudget = async (id: string) => {
    await budgetAPI.delete(id)
    await fetchAll()
  }
 
  return { budgets, progress, loading, error, refetch: fetchAll, createBudget, deleteBudget }
}