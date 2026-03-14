import React, { useEffect, useState, useMemo } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { walletAPI } from "../services"
import { Transaction, Wallet } from "../types"
import MonthBlock from "../components/transactions/MonthBlock"
import { groupByMonthAndDay } from "../components/transactions/groupByMonthAndDay"
import WalletModal from "../components/wallets/WalletModal"
import DeleteConfirmModal from "../components/wallets/DeleteConfirmModal"

const fmt = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n)

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

interface WalletDetailData {
  id: string
  name: string
  balance: string | number
  initialBalance: string | number
  createdAt: string
  transactions: Transaction[]
}

interface Summary {
  balance: string | number
  totalIncome: number
  totalExpense: number
  transactionCount: number
}

const WalletDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [wallet, setWallet] = useState<WalletDetailData | null>(null)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [typeFilter, setTypeFilter] = useState<"" | "income" | "expense">("")
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  const fetchWallet = () => {
    if (!id) return
    setLoading(true)
    walletAPI
      .getById(id)
      .then((res) => {
        setWallet(res.data.wallet)
        setSummary(res.data.summary)
      })
      .catch(() => setError("Could not load wallet details."))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchWallet() }, [id])

  const handleSave = async (name: string, initialBalance: number) => {
    if (!id) return
    await walletAPI.update(id, { name, initialBalance })
    fetchWallet()
  }

  const handleDelete = async () => {
    if (!id) return
    setDeleting(true)
    setDeleteError("")
    try {
      await walletAPI.delete(id)
      navigate("/wallets")
    } catch {
      setDeleteError("Failed to delete wallet. Please try again.")
      setDeleting(false)
    }
  }

  const filtered = useMemo(() => {
    if (!wallet) return []
    if (!typeFilter) return wallet.transactions
    return wallet.transactions.filter((t) => t.type === typeFilter)
  }, [wallet, typeFilter])

  const grouped = useMemo(() => groupByMonthAndDay(filtered), [filtered])

  if (loading) return <div className="loading-state">Loading wallet…</div>
  if (error || !wallet || !summary)
    return <div className="auth-error">{error || "Wallet not found."}</div>

  const walletForModal: Wallet = {
    id: wallet.id,
    name: wallet.name,
    balance: Number(wallet.balance),
    initialBalance: Number(wallet.initialBalance),
    createdAt: wallet.createdAt,
    userId: "",
  }

  return (
    <div className="wallet-detail-page">

      {/* Back */}
      <button className="wallet-detail-back" onClick={() => navigate("/wallets")}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back to Wallets
      </button>

      {/* Header */}
      <div className="wallet-detail-header">
        <div className="wallet-detail-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 3H8L2 7h20L16 3z" />
            <circle cx="16" cy="14" r="1.5" fill="currentColor" stroke="none" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <h1 className="wallet-detail-name">{wallet.name}</h1>
          <p className="wallet-detail-sub">
            Created {fmtDate(wallet.createdAt)} · {summary.transactionCount} transaction
            {summary.transactionCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button className="btn-ghost" onClick={() => setEditOpen(true)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit
          </button>
          <button className="btn-ghost btn-ghost-danger" onClick={() => setDeleteOpen(true)}>
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

      {/* Stats */}
      <div className="wallet-stats-grid">
        <div className="wallet-stat-card wallet-stat-balance">
          <div className="wallet-stat-label">Current Balance</div>
          <div className="wallet-stat-value">{fmt(Number(summary.balance))}</div>
          <div className="wallet-stat-hint">Initial: {fmt(Number(wallet.initialBalance))}</div>
        </div>
        <div className="wallet-stat-card wallet-stat-income">
          <div className="wallet-stat-label">Total Income</div>
          <div className="wallet-stat-value income">{fmt(summary.totalIncome)}</div>
        </div>
        <div className="wallet-stat-card wallet-stat-expense">
          <div className="wallet-stat-label">Total Expense</div>
          <div className="wallet-stat-value expense">{fmt(summary.totalExpense)}</div>
        </div>
      </div>

      {/* Transaction list */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Transactions</h2>
          <div className="filter-types">
            {([["", "All"], ["income", "Income"], ["expense", "Expense"]] as const).map(([v, l]) => (
              <button
                key={v}
                className={`filter-type-btn ${typeFilter === v ? "filter-type-active" : ""}`}
                onClick={() => setTypeFilter(v)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {grouped.length === 0 ? (
          <div className="empty-state" style={{ paddingTop: 24, paddingBottom: 24 }}>
            <p>No transactions found.</p>
            <Link to="/add-transaction" className="btn-primary btn-sm" style={{ marginTop: 8 }}>
              + Add Transaction
            </Link>
          </div>
        ) : (
          <div className="months-list">
            {grouped.map(([monthKey, data], i) => (
              <MonthBlock
                key={monthKey}
                monthKey={monthKey}
                data={data}
                onDelete={() => {}}
                onClickTx={() => {}}
                defaultOpen={i === 0}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <WalletModal
          wallet={walletForModal}
          onClose={() => setEditOpen(false)}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteOpen && (
        <DeleteConfirmModal
          walletName={wallet.name}
          transactionCount={summary.transactionCount}
          deleting={deleting}
          error={deleteError}
          onConfirm={handleDelete}
          onClose={() => { setDeleteOpen(false); setDeleteError("") }}
        />
      )}

    </div>
  )
}

export default WalletDetail