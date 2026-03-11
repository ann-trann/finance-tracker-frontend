import React, { useEffect, useState } from "react"
import { Wallet } from "../../types"

interface Props {
  wallet?: Wallet | null   // null = create mode, Wallet = edit mode
  onClose: () => void
  onSave: (name: string, balance: number) => Promise<void>
}

const WalletModal: React.FC<Props> = ({ wallet, onClose, onSave }) => {
  const [name, setName] = useState("")
  const [balance, setBalance] = useState("0")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const isEdit = !!wallet

  // Populate fields when editing
  useEffect(() => {
    if (wallet) {
      setName(wallet.name)
      setBalance(String(wallet.balance))
    } else {
      setName("")
      setBalance("0")
    }
    setError("")
  }, [wallet])

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Wallet name is required")
      return
    }
    const bal = parseFloat(balance)
    if (isNaN(bal) || bal < 0) {
      setError("Balance must be a valid non-negative number")
      return
    }
    setSaving(true)
    try {
      await onSave(name.trim(), bal)
      onClose()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="modal-box">

        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? "Edit Wallet" : "New Wallet"}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal-body">
          {error && <div className="auth-error">{error}</div>}

          <div className="field-group">
            <label className="field-label">Wallet Name</label>
            <input
              className="field-input"
              placeholder="e.g. Cash, Vietcombank"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoFocus
            />
          </div>

          <div className="field-group" style={{ marginTop: 16 }}>
            <label className="field-label">
              {isEdit ? "Balance" : "Opening Balance"}
            </label>
            <input
              className="field-input field-input-lg"
              type="number"
              min="0"
              step="1000"
              placeholder="0"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? (
              <span className="btn-loading">
                <span className="spinner" /> Saving…
              </span>
            ) : isEdit ? "Save Changes" : "Create Wallet"}
          </button>
        </div>

      </div>
    </div>
  )
}

export default WalletModal