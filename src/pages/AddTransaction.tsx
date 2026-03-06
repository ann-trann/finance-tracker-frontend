import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { transactionAPI } from "../services/api"
import { useCategories } from "../hooks/useFinance"

const AddTransaction: React.FC = () => {
  const navigate = useNavigate()
  const { categories } = useCategories()

  const [form, setForm] = useState({
    amount: "",
    type: "expense" as "income" | "expense",
    description: "",
    date: new Date().toISOString().split("T")[0],
    categoryId: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const filteredCats = categories.filter((c) => c.type === form.type)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
      // Reset category when type changes
      ...(name === "type" ? { categoryId: "" } : {}),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }
    setLoading(true)
    try {
      await transactionAPI.create({
        amount: Number(form.amount),
        type: form.type,
        description: form.description,
        date: form.date,
        categoryId: form.categoryId || undefined,
      })
      navigate("/transactions")
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create transaction")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-tx-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Add Transaction</h1>
          <p className="page-sub">Record a new income or expense</p>
        </div>
      </div>

      <div className="form-card">
        {/* Type Toggle */}
        <div className="type-toggle">
          <button
            type="button"
            className={`type-btn ${form.type === "expense" ? "type-btn-expense-active" : ""}`}
            onClick={() => setForm((p) => ({ ...p, type: "expense", categoryId: "" }))}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
            Expense
          </button>
          <button
            type="button"
            className={`type-btn ${form.type === "income" ? "type-btn-income-active" : ""}`}
            onClick={() => setForm((p) => ({ ...p, type: "income", categoryId: "" }))}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            Income
          </button>
        </div>

        <form onSubmit={handleSubmit} className="tx-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="field-group">
            <label className="field-label">Amount (VND)</label>
            <input
              type="number"
              name="amount"
              className="field-input field-input-lg"
              placeholder="0"
              min="0"
              step="1000"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="field-group">
              <label className="field-label">Date</label>
              <input
                type="date"
                name="date"
                className="field-input"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label">Category</label>
              <select
                name="categoryId"
                className="field-input"
                value={form.categoryId}
                onChange={handleChange}
              >
                <option value="">No category</option>
                {filteredCats.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Description</label>
            <textarea
              name="description"
              className="field-input field-textarea"
              placeholder="What was this for?"
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn-primary ${form.type === "income" ? "btn-income" : "btn-expense"}`}
              disabled={loading}
            >
              {loading ? "Saving…" : `Save ${form.type === "income" ? "Income" : "Expense"}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTransaction
