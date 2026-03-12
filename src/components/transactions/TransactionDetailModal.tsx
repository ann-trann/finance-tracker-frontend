import React, { useState, useEffect, useCallback } from "react"
import { Transaction, Category, Wallet } from "../../types"
import { transactionAPI } from "../../services/transactionAPI"

// ── helpers ───────────────────────────────────────────────
const fmtVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n)

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("vi-VN", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  })

const toInputDate = (d: string) =>
  new Date(d).toISOString().slice(0, 10)

// ── types ─────────────────────────────────────────────────
interface Props {
  tx: Transaction
  categories: Category[]
  wallets: Wallet[]
  onClose: () => void
  onUpdated: (updated: Transaction) => void
}

// ── component ─────────────────────────────────────────────
const TransactionDetailModal: React.FC<Props> = ({
  tx, categories, wallets, onClose, onUpdated,
}) => {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  // form state
  const [amount, setAmount] = useState(String(Number(tx.amount)))
  const [type, setType] = useState<"income" | "expense">(tx.type)
  const [description, setDescription] = useState(tx.description ?? "")
  const [date, setDate] = useState(toInputDate(tx.date))
  const [categoryId, setCategoryId] = useState(tx.categoryId ?? "")
  const [walletId, setWalletId] = useState(tx.walletId)

  // reset form whenever tx changes
  useEffect(() => {
    setAmount(String(Number(tx.amount)))
    setType(tx.type)
    setDescription(tx.description ?? "")
    setDate(toInputDate(tx.date))
    setCategoryId(tx.categoryId ?? "")
    setWalletId(tx.walletId)
    setEditing(false)
    setError("")
  }, [tx.id])

  // close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const handleSave = async () => {
    if (!amount || Number(amount) <= 0) {
      setError("Số tiền phải lớn hơn 0")
      return
    }
    if (!walletId) {
      setError("Vui lòng chọn ví")
      return
    }

    setSaving(true)
    setError("")
    try {
      const res = await transactionAPI.update(tx.id, {
        amount: Number(amount),
        type,
        description: description || "",
        date,
        categoryId: categoryId || undefined,
        walletId,
      })
      onUpdated(res.data)
      setEditing(false)
    } catch {
      setError("Cập nhật thất bại, thử lại nhé")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    // reset form back to tx values
    setAmount(String(Number(tx.amount)))
    setType(tx.type)
    setDescription(tx.description ?? "")
    setDate(toInputDate(tx.date))
    setCategoryId(tx.categoryId ?? "")
    setWalletId(tx.walletId)
    setError("")
    setEditing(false)
  }

  const filteredCategories = categories.filter(c => c.type === type)
  const currentWallet = wallets.find(w => w.id === (editing ? walletId : tx.walletId))
  const currentCategory = categories.find(c => c.id === (editing ? categoryId : tx.categoryId))

  return (
    <div className="tdm-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="tdm-card">

        {/* ── Header ── */}
        <div className={`tdm-header tdm-header-${tx.type}`}>
          <div className="tdm-header-left">
            <div className={`tdm-type-badge tdm-badge-${tx.type}`}>
              {tx.type === "income" ? "↑" : "↓"}
            </div>
            <div>
              <div className="tdm-header-title">
                {editing ? "Chỉnh sửa giao dịch" : (tx.description || "Không có mô tả")}
              </div>
              <div className="tdm-header-date">{fmtDate(tx.date)}</div>
            </div>
          </div>
          <button className="tdm-close" onClick={onClose} aria-label="Đóng">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="tdm-body">

          {/* Amount */}
          <div className="tdm-amount-wrap">
            <div className="tdm-amount-label">Số tiền</div>
            {editing ? (
              <input
                className="tdm-amount-input"
                type="number"
                min={0}
                value={amount}
                onChange={e => setAmount(e.target.value)}
                autoFocus
              />
            ) : (
              <div className={`tdm-amount-display ${tx.type}`}>
                {tx.type === "income" ? "+" : "−"}{fmtVND(Number(tx.amount))}
              </div>
            )}
          </div>

          <div className="tdm-fields">

            {/* Type toggle — edit only */}
            {editing && (
              <div className="tdm-field">
                <span className="tdm-field-label">Loại giao dịch</span>
                <div className="tdm-type-toggle">
                  <button
                    className={`tdm-type-btn ${type === "income" ? "tdm-type-income-active" : ""}`}
                    onClick={() => { setType("income"); setCategoryId("") }}
                  >
                    ↑ Thu nhập
                  </button>
                  <button
                    className={`tdm-type-btn ${type === "expense" ? "tdm-type-expense-active" : ""}`}
                    onClick={() => { setType("expense"); setCategoryId("") }}
                  >
                    ↓ Chi tiêu
                  </button>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="tdm-field">
              <span className="tdm-field-label">Mô tả</span>
              {editing ? (
                <input
                  className="field-input"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Mô tả giao dịch…"
                />
              ) : (
                <div className={`tdm-value ${!tx.description ? "tdm-value-empty" : ""}`}>
                  {tx.description || "Không có mô tả"}
                </div>
              )}
            </div>

            {/* Date */}
            <div className="tdm-field">
              <span className="tdm-field-label">Ngày</span>
              {editing ? (
                <input
                  className="field-input"
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
              ) : (
                <div className="tdm-value">{fmtDate(tx.date)}</div>
              )}
            </div>

            {/* Category */}
            <div className="tdm-field">
              <span className="tdm-field-label">Danh mục</span>
              {editing ? (
                <select
                  className="field-input"
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                >
                  <option value="">— Không có —</option>
                  {filteredCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              ) : (
                <div className="tdm-value">
                  {currentCategory
                    ? <span className="tdm-cat-tag">{currentCategory.name}</span>
                    : <span className="tdm-value-empty">Chưa phân loại</span>}
                </div>
              )}
            </div>

            {/* Wallet */}
            <div className="tdm-field">
              <span className="tdm-field-label">Ví</span>
              {editing ? (
                <select
                  className="field-input"
                  value={walletId}
                  onChange={e => setWalletId(e.target.value)}
                >
                  <option value="">— Chọn ví —</option>
                  {wallets.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              ) : (
                <div className="tdm-value">
                  {currentWallet
                    ? <span className="tdm-wallet-tag">💳 {currentWallet.name}</span>
                    : <span className="tdm-value-empty">—</span>}
                </div>
              )}
            </div>

          </div>

          {error && <div className="tdm-error">{error}</div>}
        </div>

        {/* ── Footer ── */}
        <div className="tdm-footer">
          {editing ? (
            <>
              <button className="btn-ghost" onClick={handleCancel} disabled={saving}>
                Hủy
              </button>
              <button className="btn-primary" onClick={handleSave} disabled={saving}>
                {saving
                  ? <span className="btn-loading"><span className="spinner" />Đang lưu…</span>
                  : "Lưu thay đổi"}
              </button>
            </>
          ) : (
            <>
              <button className="btn-ghost" onClick={onClose}>Đóng</button>
              <button className="btn-primary" onClick={() => setEditing(true)}>
                Chỉnh sửa
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  )
}

export default TransactionDetailModal