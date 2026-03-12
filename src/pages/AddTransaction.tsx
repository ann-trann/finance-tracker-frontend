import React from "react"
import { useNavigate } from "react-router-dom"

import { Wallet } from "../types"
import { TYPE_LABELS, fmt } from "../components/add_transaction/data"
import { useAddTransaction } from "../hooks"
import TransactionTypeTabs from "../components/add_transaction/TransactionTypeTabs"
import CategoryPicker from "../components/add_transaction/CategoryPicker"
import WalletPicker from "../components/add_transaction/WalletPicker"
import AddCategoryModal from "../components/add_transaction/AddCategoryModal"

const AddTransaction: React.FC = () => {
  const navigate = useNavigate()
  const {
    txType, amount, description, date, category, walletId,
    walletsLoading, selectedWallet, categoryLabel,
    error, loading,
    showCatPicker, showWalletPicker, showAddCat,
    setShowCatPicker, setShowWalletPicker, setShowAddCat,
    handleTypeChange, handleCatSelect, handleAddCat, handleSubmit,
    setAmount, setDescription, setDate, setWalletId,
  } = useAddTransaction()

  return (
    <>
      {/* ── Overlays ── */}
      {showCatPicker && (
        <CategoryPicker
          activeType={txType}
          onTypeChange={handleTypeChange}
          onSelect={handleCatSelect}
          onClose={() => setShowCatPicker(false)}
          onAddNew={() => { setShowCatPicker(false); setShowAddCat(true) }}
        />
      )}

      {showWalletPicker && (
        <WalletPicker
          txType={txType}
          selectedId={walletId}
          onSelect={(w: Wallet) => setWalletId(w.id)}
          onClose={() => setShowWalletPicker(false)}
        />
      )}

      {showAddCat && (
        <AddCategoryModal
          type={txType}
          onClose={() => setShowAddCat(false)}
          onAdd={handleAddCat}
        />
      )}

      {/* ── Page ── */}
      <div className="at-page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Thêm giao dịch</h1>
            <p className="page-sub">Ghi lại thu chi hoặc khoản vay</p>
          </div>
        </div>

        <div className="at-card">
          <TransactionTypeTabs txType={txType} onChange={handleTypeChange} />

          <form onSubmit={handleSubmit} className="at-form">
            {error && <div className="auth-error">{error}</div>}

            {/* Amount */}
            <div className="field-group">
              <label className="field-label">Số tiền (VND)</label>
              <div className="amount-wrap">
                <span className={`amount-prefix amount-prefix-${txType}`}>₫</span>
                <input
                  type="number"
                  className="field-input field-input-lg amount-input"
                  placeholder="0"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>
            </div>

            {/* Date + Category */}
            <div className="form-row">
              <div className="field-group">
                <label className="field-label">Ngày</label>
                <input
                  type="date"
                  className="field-input"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
              </div>

              <div className="field-group">
                <label className="field-label">Danh mục</label>
                <button
                  type="button"
                  className={`field-input cat-trigger ${category ? `cat-selected-${txType}` : ""}`}
                  onClick={() => setShowCatPicker(true)}
                >
                  {categoryLabel
                    ? <span>{categoryLabel}</span>
                    : <span className="placeholder">Chọn danh mục…</span>
                  }
                  <span className="cat-trigger-arrow">›</span>
                </button>
              </div>
            </div>

            {/* Wallet */}
            <div className="field-group">
              <label className="field-label">Ví</label>
              <button
                type="button"
                className={`field-input cat-trigger ${walletId ? `cat-selected-${txType}` : ""}`}
                onClick={() => setShowWalletPicker(true)}
                disabled={walletsLoading}
              >
                <span className="wallet-trigger-inner">
                  {selectedWallet ? (
                    <>
                      <span className="wallet-trigger-icon">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <rect x="2" y="7" width="20" height="14" rx="2" />
                          <path d="M16 3H8L2 7h20L16 3z" />
                          <circle cx="16" cy="14" r="1.5" fill="currentColor" stroke="none" />
                        </svg>
                      </span>
                      {selectedWallet.name}
                      <span className="wallet-trigger-bal">
                        — {fmt(Number(selectedWallet.balance))}
                      </span>
                    </>
                  ) : (
                    <span className="placeholder">
                      {walletsLoading ? "Đang tải..." : "Chọn ví…"}
                    </span>
                  )}
                </span>
                <span className="cat-trigger-arrow">›</span>
              </button>
            </div>

            {/* Description */}
            <div className="field-group">
              <label className="field-label">Ghi chú</label>
              <textarea
                className="field-input field-textarea"
                placeholder="Ghi chú cho giao dịch này..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="form-actions">
              <button type="button" className="btn-ghost" onClick={() => navigate(-1)}>
                Huỷ
              </button>
              <button
                type="submit"
                className={`at-submit at-submit-${txType}`}
                disabled={loading}
              >
                {loading ? "Đang lưu…" : `Lưu ${TYPE_LABELS[txType]}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default AddTransaction