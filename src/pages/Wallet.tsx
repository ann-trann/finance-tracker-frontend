import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useWallets } from "../hooks"
import { Wallet } from "../types"
import WalletModal from "../components/wallets/WalletModal"
import DeleteConfirmModal from "../components/wallets/DeleteConfirmModal"

const fmt = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n)

const Wallets: React.FC = () => {
  const navigate = useNavigate()
  const { wallets, loading, error, createWallet, updateWallet, deleteWallet } = useWallets()

  // Modal state: undefined = closed, null = create, Wallet = edit
  const [modalTarget, setModalTarget] = useState<Wallet | null | undefined>(undefined)

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<Wallet | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  const totalBalance = wallets.reduce((sum, w) => sum + Number(w.balance), 0)

  const handleSave = async (name: string, initialBalance: number) => {
    if (modalTarget) {
      await updateWallet(modalTarget.id, name, initialBalance)
    } else {
      await createWallet(name, initialBalance)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    setDeleteError("")
    try {
      await deleteWallet(deleteTarget.id)
      setDeleteTarget(null)
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to delete wallet"
      setDeleteError(msg)
    } finally {
      setDeleting(false)
    }
  }

  const handleEdit = (e: React.MouseEvent, wallet: Wallet) => {
    e.stopPropagation()
    setModalTarget(wallet)
  }

  const handleDeleteClick = (e: React.MouseEvent, wallet: Wallet) => {
    e.stopPropagation()
    setDeleteError("")
    setDeleteTarget(wallet)
  }

  return (
    <div className="wallets-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Wallets</h1>
          <p className="page-sub">Manage your accounts and balances</p>
        </div>
        <button className="btn-primary" onClick={() => setModalTarget(null)}>
          + New Wallet
        </button>
      </div>

      {/* Total summary */}
      {!loading && wallets.length > 0 && (
        <div className="wallet-summary-bar">
          <span className="wallet-summary-label">
            Total balance across {wallets.length} wallet{wallets.length !== 1 ? "s" : ""}
          </span>
          <span className="wallet-summary-total">{fmt(totalBalance)}</span>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="loading-state">Loading wallets…</div>
      ) : error ? (
        <div className="auth-error">{error}</div>
      ) : wallets.length === 0 ? (
        <div className="empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="7" width="20" height="14" rx="2"/>
            <path d="M16 3H8L2 7h20L16 3z"/>
            <circle cx="16" cy="14" r="1.5" fill="currentColor" stroke="none"/>
          </svg>
          <p>No wallets yet. Create your first one!</p>
          <button
            className="btn-primary btn-sm"
            style={{ marginTop: 4 }}
            onClick={() => setModalTarget(null)}
          >
            + New Wallet
          </button>
        </div>
      ) : (
        <div className="wallet-full-grid">
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="wallet-full-card"
              onClick={() => navigate(`/wallets/${wallet.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate(`/wallets/${wallet.id}`)}
            >
              <div className="wallet-full-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="7" width="20" height="14" rx="2"/>
                  <path d="M16 3H8L2 7h20L16 3z"/>
                  <circle cx="16" cy="14" r="1.5" fill="currentColor" stroke="none"/>
                </svg>
              </div>

              <div className="wallet-full-info">
                <div className="wallet-full-name">{wallet.name}</div>
                <div className="wallet-full-balance">{fmt(Number(wallet.balance))}</div>
              </div>

              <div className="wallet-full-actions">
                <button
                  className="wallet-action-btn wallet-action-edit"
                  onClick={(e) => handleEdit(e, wallet)}
                  title="Edit"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit
                </button>
                <button
                  className="wallet-action-btn wallet-action-delete"
                  onClick={(e) => handleDeleteClick(e, wallet)}
                  title="Delete"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      {modalTarget !== undefined && (
        <WalletModal
          wallet={modalTarget}
          onClose={() => setModalTarget(undefined)}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          walletName={deleteTarget.name}
          deleting={deleting}
          error={deleteError}
          onConfirm={handleDeleteConfirm}
          onClose={() => { setDeleteTarget(null); setDeleteError("") }}
        />
      )}

    </div>
  )
}

export default Wallets