import React, { useState } from "react"
import { BudgetProgress } from "../../types"

interface Props {
  item: BudgetProgress
  budgetId: string
  currentAmount: number
  onClose: () => void
  onSave: (budgetId: string, amount: number) => Promise<void>
}

const EditBudgetModal: React.FC<Props> = ({ item, budgetId, currentAmount, onClose, onSave }) => {
  const [amount, setAmount] = useState(String(currentAmount))
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState("")

  const handleSave = async () => {
    setErr("")
    const parsed = parseFloat(amount)
    if (!parsed || parsed <= 0) return setErr("Nhập số tiền hợp lệ")
    setSaving(true)
    try {
      await onSave(budgetId, parsed)
      onClose()
    } catch {
      setErr("Lỗi khi cập nhật")
    } finally {
      setSaving(false)
    }
  }

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).classList.contains("modal-backdrop")) onClose()
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="modal-box">
        <div className="modal-header">
          <h3 className="modal-title">Sửa ngân sách — {item.category}</h3>
          <button className="modal-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {err && <div className="auth-error" style={{ marginBottom: 12 }}>{err}</div>}

        <div className="field-group" style={{ marginBottom: 20 }}>
          <label className="field-label">Giới hạn mới (VNĐ)</label>
          <input
            className="field-input field-input-lg"
            type="number"
            min={0}
            step={10000}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            autoFocus
          />
        </div>

        <div className="form-actions">
          <button className="btn-ghost" onClick={onClose}>Huỷ</button>
          <button className="btn-primary btn-expense" onClick={handleSave} disabled={saving}>
            {saving
              ? <span className="btn-loading"><span className="spinner" />Đang lưu…</span>
              : "Lưu thay đổi"
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditBudgetModal