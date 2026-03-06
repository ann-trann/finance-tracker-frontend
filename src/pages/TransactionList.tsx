import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useTransactions } from "../hooks/useFinance"

const MONTHS = [
  { val: "", label: "All months" },
  { val: "01", label: "January" }, { val: "02", label: "February" },
  { val: "03", label: "March" }, { val: "04", label: "April" },
  { val: "05", label: "May" }, { val: "06", label: "June" },
  { val: "07", label: "July" }, { val: "08", label: "August" },
  { val: "09", label: "September" }, { val: "10", label: "October" },
  { val: "11", label: "November" }, { val: "12", label: "December" },
]

const fmt = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n)

const TransactionList: React.FC = () => {
  const [month, setMonth] = useState("")
  const [type, setType] = useState("")

  const { transactions, loading, deleteTransaction } = useTransactions(
    month || undefined,
    type || undefined
  )

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this transaction?")) return
    await deleteTransaction(id)
  }

  return (
    <div className="tx-list-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-sub">{transactions.length} records</p>
        </div>
        <Link to="/add-transaction" className="btn-primary btn-sm">
          + Add
        </Link>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <select
          className="filter-select"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          {MONTHS.map((m) => (
            <option key={m.val} value={m.val}>{m.label}</option>
          ))}
        </select>

        <div className="filter-types">
          {["", "income", "expense"].map((t) => (
            <button
              key={t}
              className={`filter-type-btn ${type === t ? "filter-type-active" : ""}`}
              onClick={() => setType(t)}
            >
              {t === "" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="card">
        {loading ? (
          <div className="loading-state">Loading transactions…</div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3">
              <path d="M9 14l2 2 4-4M7 3H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
              <path d="M9 3h6a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2z" />
            </svg>
            <p>No transactions found</p>
          </div>
        ) : (
          <div className="tx-list">
            {transactions.map((tx) => (
              <div key={tx.id} className="tx-row tx-row-full">
                <div
                  className={`tx-type-badge ${tx.type === "income" ? "badge-income" : "badge-expense"}`}
                >
                  {tx.type === "income" ? "↑" : "↓"}
                </div>

                <div className="tx-info tx-info-wide">
                  <div className="tx-desc">{tx.description || "No description"}</div>
                  <div className="tx-meta">
                    <span className="tx-date">
                      {new Date(tx.date).toLocaleDateString("vi-VN")}
                    </span>
                    {tx.category && (
                      <span className="tx-cat-tag">{tx.category.name}</span>
                    )}
                  </div>
                </div>

                <div className={`tx-amount ${tx.type === "income" ? "tx-amount-income" : "tx-amount-expense"}`}>
                  {tx.type === "income" ? "+" : "-"}
                  {fmt(Number(tx.amount))}
                </div>

                <button
                  className="tx-delete-btn"
                  onClick={() => handleDelete(tx.id)}
                  title="Delete"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TransactionList
