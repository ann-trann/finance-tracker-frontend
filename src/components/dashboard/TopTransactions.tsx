import React, { useMemo } from "react"
import { Link } from "react-router-dom"
import { Transaction } from "../../types"

const fmt = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n)

interface Props {
  transactions: Transaction[]
  loading: boolean
}

const TopTransactions: React.FC<Props> = ({ transactions, loading }) => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const monthLabel = now.toLocaleDateString("vi-VN", { month: "long", year: "numeric" })

  const top5 = useMemo(() => {
    return transactions
      .filter((t) => {
        const d = new Date(t.date)
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear
      })
      .sort((a, b) => Number(b.amount) - Number(a.amount))
      .slice(0, 5)
  }, [transactions, currentMonth, currentYear])

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Top Transactions</h2>
          <p className="card-subtitle">{monthLabel}</p>
        </div>
        <Link to="/transactions" className="card-link">View all →</Link>
      </div>

      {loading ? (
        <div className="loading-state">Loading…</div>
      ) : top5.length === 0 ? (
        <div className="empty-state" style={{ paddingTop: 20, paddingBottom: 20 }}>
          <p>No transactions this month.</p>
        </div>
      ) : (
        <div className="tx-list">
          {top5.map((tx, index) => (
            <div key={tx.id} className="tx-row">

              {/* Rank badge */}
              <div className="top-tx-rank">{index + 1}</div>

              {/* Type badge */}
              <div className={`tx-type-badge ${tx.type === "income" ? "badge-income" : "badge-expense"}`}>
                {tx.type === "income" ? "+" : "−"}
              </div>

              {/* Info */}
              <div className="tx-info">
                <div className="tx-desc">{tx.description || "—"}</div>
                <div className="tx-meta">
                  <span className="tx-date">
                    {new Date(tx.date).toLocaleDateString("vi-VN")}
                  </span>
                  {tx.category && (
                    <span className="tx-cat-tag">{tx.category.name}</span>
                  )}
                </div>
              </div>

              {/* Amount */}
              <div className={`tx-amount ${tx.type === "income" ? "tx-amount-income" : "tx-amount-expense"}`}>
                {tx.type === "income" ? "+" : "−"}{fmt(Number(tx.amount))}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TopTransactions