import { useState, useEffect } from "react"
import { categoryAPI } from "../services"
import { Category } from "../types"


// ================= CATEGORY HOOK =================
export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])  // Category list

  // Fetch categories once when component mounts
  useEffect(() => {
    categoryAPI.getAll().then((res) => setCategories(res.data))
  }, [])

  return { categories }
}
