import React, { useState, useMemo } from "react"
import { useCategories } from "../../hooks/useCategories"

interface Props {
  period: string
  onAdded: () => void
  createBudget: (d: { categoryId: string; amount: number; period?: string }) => Promise<void>
  budgetedCatIds: string[]
  onClose: () => void
}

const AddBudgetForm: React.FC<Props> = ({ period, onAdded, createBudget, budgetedCatIds, onClose }) => {
  const { categories } = useCategories()
  const [categoryId, setCategoryId] = useState("")
  const [amount, setAmount] = useState("")
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState("")

  const available = useMemo(
    () => categories.filter((c) => c.type === "expense" && !budgetedCatIds.includes(c.id)),
    [categories, budgetedCatIds]
  )

  const handleSubmit = async () => {
    setErr("")
    if (!categoryId) return setErr("Vui lòng chọn danh mục")
    const parsed = parseFloat(amount)
    if (!parsed || parsed <= 0) return setErr("Nhập số tiền hợp lệ")
    setSaving(true)
    try {
      await createBudget({ categoryId, amount: parsed, period })
      setCategoryId("")
      setAmount("")
      onAdded()
      onClose()
    } catch {
      setErr("Lỗi khi lưu ngân sách")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="add-budget-form-wrap">
      <div className="add-budget-form-inner">
        <div className="add-budget-form-header">
          <span className="card-title" style={{ fontSize: "0.95rem" }}>Thêm ngân sách mới</span>
          <button className="modal-close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {err && <div className="auth-error" style={{ marginBottom: 12 }}>{err}</div>}

        <div className="form-row" style={{ marginBottom: 14 }}>
          <div className="field-group">
            <label className="field-label">Danh mục chi tiêu</label>
            <select className="field-input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">-- Chọn danh mục --</option>
              {available.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon ? `${c.icon} ` : ""}{c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field-group">
            <label className="field-label">Giới hạn (VNĐ)</label>
            <input
              className="field-input"
              type="number"
              min={0}
              step={10000}
              placeholder="500000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-ghost btn-sm" onClick={onClose}>Huỷ</button>
          <button className="btn-primary btn-sm btn-expense" onClick={handleSubmit} disabled={saving}>
            {saving
              ? <span className="btn-loading"><span className="spinner" />Đang lưu…</span>
              : "+ Thêm"
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddBudgetForm