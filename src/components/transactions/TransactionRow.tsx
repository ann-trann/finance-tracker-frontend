import React from "react"

const fmt = (n: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(n)

interface Props {
  tx: any
  onDelete: (id: string) => void
}

// Single transaction row
const TransactionRow: React.FC<Props> = ({ tx, onDelete }) => {
  return (
    <div className="tx-row tx-row-full">

      {/* Type badge */}
      <div
        className={`tx-type-badge ${
          tx.type === "income" ? "badge-income" : "badge-expense"
        }`}
      >
        {tx.type === "income" ? "↑" : "↓"}
      </div>

      {/* Transaction info */}
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

      {/* Delete button */}
      <button
        className="tx-delete-btn"
        onClick={() => onDelete(tx.id)}
        title="Delete"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
        </svg>
      </button>

    </div>
  )
}

export default TransactionRow