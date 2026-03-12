import { useState, useEffect } from "react"
import { categoryAPI } from "../services"
import { Category, CategoryType } from "../types"
import { TxType } from "../types"

const LOAN_CATEGORY_NAMES = ["Cho vay", "Đi vay", "Thu nợ", "Trả nợ"]

export const useCategories = (txType?: TxType) => {
  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState("")

  useEffect(() => {
    setLoading(true)
    categoryAPI.getAll()
      .then((res) => setAllCategories(res.data))
      .catch(() => setError("Không thể tải danh mục"))
      .finally(() => setLoading(false))
  }, [])

  // Filter + group theo txType
  const categories = (() => {
    if (!txType) return allCategories

    if (txType === "loan") {
      // Lấy các danh mục vay/cho vay theo tên, không lọc theo type
      return allCategories.filter(c =>
        !c.parentId && LOAN_CATEGORY_NAMES.includes(c.name)
      )
    }

    // income / expense — chỉ lấy parent categories (children được nest bên trong)
    return allCategories.filter(c => c.type === txType && !c.parentId)
  })()

  return { categories, loading, error }
}