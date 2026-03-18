import React, { useState, useMemo } from "react"
import { useCategories } from "../../hooks/useCategories"
import CategoryIcon from "../add_transaction/CategoriesIcon"
import { Category } from "../../types"

interface Props {
  period: string
  onAdded: () => void
  createBudget: (d: { categoryId: string; amount: number; period?: string }) => Promise<void>
  budgetedCatIds: string[]
  onClose: () => void
}

const AddBudgetForm: React.FC<Props> = ({ period, onAdded, createBudget, budgetedCatIds, onClose }) => {
  const { categories } = useCategories("expense")
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [amount, setAmount] = useState("")
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState("")
  const [pickerOpen, setPickerOpen] = useState(false)

  const available = useMemo(
    () => categories.filter((c) => !budgetedCatIds.includes(c.id)),
    [categories, budgetedCatIds]
  )

  const handleSelect = (cat: Category) => {
    setSelectedCategory(cat)
    setPickerOpen(false)
    setErr("")
  }

  const handleSubmit = async () => {
    setErr("")
    if (!selectedCategory) return setErr("Vui lòng chọn danh mục")
    const parsed = parseFloat(amount)
    if (!parsed || parsed <= 0) return setErr("Nhập số tiền hợp lệ")
    setSaving(true)
    try {
      await createBudget({ categoryId: selectedCategory.id, amount: parsed, period })
      setSelectedCategory(null)
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
          {/* Category selector button */}
          <div className="field-group">
            <label className="field-label">Danh mục chi tiêu</label>
            <button
              type="button"
              className="field-input budget-cat-trigger"
              onClick={() => setPickerOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                textAlign: "left",
                background: "var(--input-bg, #fff)",
                border: selectedCategory ? "1.5px solid var(--red)" : undefined,
              }}
            >
              {selectedCategory ? (
                <>
                  <CategoryIcon name={selectedCategory.icon} size={16} />
                  <span>{selectedCategory.name}</span>
                </>
              ) : (
                <span style={{ color: "var(--text-muted, #aaa)" }}>-- Chọn danh mục --</span>
              )}
              <span style={{ marginLeft: "auto", opacity: 0.4, fontSize: 12 }}>▾</span>
            </button>
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

      {/* Category picker overlay — same pattern as CategoryPicker */}
      {pickerOpen && (
        <div className="picker-overlay" onClick={() => setPickerOpen(false)}>
          <div className="picker-card" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="picker-header">
              <span className="picker-title">Chọn danh mục chi tiêu</span>
              <button className="picker-close" onClick={() => setPickerOpen(false)}>✕</button>
            </div>

            {/* Category list */}
            <div className="picker-list">
              {available.length === 0 ? (
                <div className="picker-loading">Không có danh mục khả dụng</div>
              ) : (
                available.map(cat => (
                  <div key={cat.id}>
                    {/* Parent */}
                    <div
                      className="picker-item picker-item-selectable"
                      onClick={() => handleSelect(cat)}
                    >
                      <span className="picker-item-icon">
                        <CategoryIcon name={cat.icon} size={18} />
                      </span>
                      <span className="picker-item-name">{cat.name}</span>
                    </div>

                    {/* Children */}
                    {cat.children?.map((child: Category) => (
                      <div
                        key={child.id}
                        className="picker-subitem"
                        onClick={() => handleSelect(child)}
                      >
                        <span className="picker-sub-dot" style={{ background: "var(--red)" }} />
                        <span className="picker-subitem-icon">
                          <CategoryIcon name={child.icon} size={14} />
                        </span>
                        <span className="picker-subitem-name">{child.name}</span>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default AddBudgetForm