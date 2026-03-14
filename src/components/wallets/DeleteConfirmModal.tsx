import React from "react"

interface Props {
  walletName: string
  transactionCount?: number  // optional — shown only when available (e.g. from WalletDetail)
  deleting: boolean
  error: string
  onConfirm: () => void
  onClose: () => void
}

const DeleteConfirmModal: React.FC<Props> = ({
  walletName,
  transactionCount,
  deleting,
  error,
  onConfirm,
  onClose,
}) => {
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="modal-box modal-box-sm">

        <div className="modal-header">
          <h2 className="modal-title">Delete Wallet</h2>
          <button className="modal-close" onClick={onClose} disabled={deleting}>✕</button>
        </div>

        <div className="modal-body">
          <div className="delete-confirm-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>

          <p className="delete-confirm-title">
            Delete <strong>"{walletName}"</strong>?
          </p>
          <p className="delete-confirm-desc">
            {transactionCount !== undefined
              ? <>This will permanently delete the wallet and all&nbsp;<strong>{transactionCount} transaction{transactionCount !== 1 ? "s" : ""}</strong> associated with it.</>
              : "This will permanently delete the wallet and all transactions associated with it."
            }
            {" "}This action cannot be undone.
          </p>

          {error && (
            <div className="auth-error" style={{ marginTop: 12 }}>{error}</div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose} disabled={deleting}>
            Cancel
          </button>
          <button className="btn-primary btn-primary-danger" onClick={onConfirm} disabled={deleting}>
            {deleting ? (
              <span className="btn-loading">
                <span className="spinner" style={{ borderTopColor: "currentColor" }} /> Deleting…
              </span>
            ) : "Delete Wallet"}
          </button>
        </div>

      </div>
    </div>
  )
}

export default DeleteConfirmModal