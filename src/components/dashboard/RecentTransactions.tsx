import React from "react"
import { Link } from "react-router-dom"
import { Transaction } from "../../types"

const fmt = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n)

interface Props {
  transactions: Transaction[]
  loading: boolean
}

// Recent transaction list
const RecentTransactions: React.FC<Props> = ({ transactions, loading }) => {

  const recent = transactions.slice(0, 5)

  return (
    <div className="card">

      <div className="card-header">
        <h2 className="card-title">Recent Transactions</h2>
        <Link to="/transactions" className="card-link">View all →</Link>
      </div>

      {loading ? (
        <div className="loading-state">Loading…</div>
      ) : recent.length === 0 ? (

        <div className="empty-state">
          <p>No transactions yet.</p>

          <Link
            to="/add-transaction"
            className="btn-primary btn-sm"
            style={{ marginTop: 12 }}
          >
            Add your first
          </Link>

        </div>

      ) : (

        <div className="tx-list">

          {recent.map((tx) => (

            <div key={tx.id} className="tx-row">

              {/* Type indicator */}
              <div
                className={`tx-dot ${
                  tx.type === "income"
                    ? "tx-dot-income"
                    : "tx-dot-expense"
                }`}
              />

              {/* Transaction info */}
              <div className="tx-info">
                <div className="tx-desc">{tx.description || "—"}</div>
                <div className="tx-date">
                  {new Date(tx.date).toLocaleDateString("vi-VN")}
                </div>
              </div>

              {/* Amount */}
              <div
                className={`tx-amount ${
                  tx.type === "income"
                    ? "tx-amount-income"
                    : "tx-amount-expense"
                }`}
              >
                {tx.type === "income" ? "+" : "-"}
                {fmt(Number(tx.amount))}
              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  )
}

export default RecentTransactions