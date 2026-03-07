import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { transactionAPI } from "../services/api"
import { useCategories } from "../hooks/useFinance"

import TransactionTypeToggle from "../components/add_transaction/TransactionTypeToggle"
import TransactionForm from "../components/add_transaction/TransactionForm"

const AddTransaction: React.FC = () => {

  // Router navigation
  const navigate = useNavigate()

  // Fetch categories from hook
  const { categories } = useCategories()

  // Transaction form state
  const [form, setForm] = useState({
    amount: "",
    type: "expense" as "income" | "expense",
    description: "",
    date: new Date().toISOString().split("T")[0],
    categoryId: "",
  })

  // UI states
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Filter categories by transaction type
  const filteredCats = categories.filter((c) => c.type === form.type)

  // Handle field change
  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "type" ? { categoryId: "" } : {}),
    }))
  }

  // Change transaction type
  const changeType = (type: "income" | "expense") => {
    setForm((p) => ({ ...p, type, categoryId: "" }))
  }

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setError("")

    // Basic validation
    if (!form.amount || Number(form.amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    setLoading(true)

    try {

      // Call API to create transaction
      await transactionAPI.create({
        amount: Number(form.amount),
        type: form.type,
        description: form.description,
        date: form.date,
        categoryId: form.categoryId || undefined,
      })

      // Redirect after success
      navigate("/transactions")
    } catch (err: any) {
      // Handle API error
      setError(err?.response?.data?.message || "Failed to create transaction")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-tx-page">

      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Add Transaction</h1>
          <p className="page-sub">Record a new income or expense</p>
        </div>
      </div>

      <div className="form-card">

        {/* Income / Expense toggle */}
        <TransactionTypeToggle
          type={form.type}
          onChange={changeType}
        />

        {/* Transaction form */}
        <TransactionForm
          form={form}
          categories={filteredCats}
          error={error}
          loading={loading}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
        />

      </div>
    </div>
  )
}

export default AddTransaction