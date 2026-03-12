import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { TxType, Category } from "../types"
import { transactionAPI } from "../services"
import { useWallets } from "../hooks"

export const useAddTransaction = () => {
  const navigate = useNavigate()
  const { wallets, loading: walletsLoading } = useWallets()

  // ── Form state ──────────────────────────────────────────────────────────────
  const [txType,      setTxType]      = useState<TxType>("expense")
  const [amount,      setAmount]      = useState("")
  const [description, setDescription] = useState("")
  const [date,        setDate]        = useState(new Date().toISOString().split("T")[0])
  const [category,    setCategory]    = useState<Category | null>(null)
  const [walletId,    setWalletId]    = useState<string>("")

  // Set ví mặc định là ví đầu tiên khi wallets load xong
  useEffect(() => {
    if (wallets.length > 0 && !walletId) {
      setWalletId(wallets[0].id)
    }
  }, [wallets])

  // ── UI state ─────────────────────────────────────────────────────────────────
  const [showCatPicker,    setShowCatPicker]    = useState(false)
  const [showWalletPicker, setShowWalletPicker] = useState(false)
  const [showAddCat,       setShowAddCat]       = useState(false)
  const [error,   setError]   = useState("")
  const [loading, setLoading] = useState(false)

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleTypeChange = (t: TxType) => {
    setTxType(t)
    setCategory(null)
  }

  const handleCatSelect = (cat: Category) => {
    setCategory(cat)
    setShowCatPicker(false)
  }

  const handleAddCat = (name: string) => {
    setCategory({
      id:        "custom_" + Date.now(),
      name,
      type:      txType === "loan" ? "expense" : txType,
      isDefault: false,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!amount || Number(amount) <= 0) {
      setError("Vui lòng nhập số tiền hợp lệ")
      return
    }
    if (!walletId) {
      setError("Vui lòng chọn ví")
      return
    }

    setLoading(true)
    try {
      const transactionType = txType === "loan"
        ? (category?.type ?? "expense")
        : txType

      await transactionAPI.create({
        amount:      Number(amount),
        type:        transactionType,
        categoryId:  category?.id,
        walletId,
        description,
        date,
      })

      navigate("/transactions")
    } catch (err: any) {
      setError(err?.response?.data?.message || "Có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }

  // ── Derived ───────────────────────────────────────────────────────────────────

  const selectedWallet = wallets.find(w => w.id === walletId)

  const categoryLabel = category
    ? category.parent
      ? `${category.parent.name} › ${category.name}`
      : category.name
    : null

  return {
    // data
    txType, amount, description, date, category, walletId,
    wallets, walletsLoading, selectedWallet, categoryLabel,
    error, loading,
    // ui toggles
    showCatPicker, showWalletPicker, showAddCat,
    setShowCatPicker, setShowWalletPicker, setShowAddCat,
    // handlers
    handleTypeChange, handleCatSelect, handleAddCat, handleSubmit,
    setAmount, setDescription, setDate, setWalletId,
  }
}