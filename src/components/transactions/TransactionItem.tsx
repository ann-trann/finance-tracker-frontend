import React from "react"
import { Transaction } from "../../types"

const fmtVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n)

interface Props {
  tx: Transaction
  onDelete: (id: string) => void
  onClick: (tx: Transaction) => void
}

const TransactionItem: React.FC<Props> = ({ tx, onDelete, onClick }) => {
  const isIncome = tx.type === "income"

  return (
    <div className="txi-row" onClick={() => onClick(tx)} style={{ cursor: "pointer" }}>
      <div className="txi-body">
        <span className="txi-desc">{tx.description || "Không có mô tả"}</span>
        {tx.category && <span className="txi-cat">{tx.category.name}</span>}
      </div>

      <span className={`txi-amt ${isIncome ? "amt-in" : "amt-out"}`}>
        {isIncome ? "+" : "−"}{fmtVND(Number(tx.amount))}
      </span>

      <button
        className="txi-del"
        onClick={e => { e.stopPropagation(); onDelete(tx.id) }}
        title="Xóa"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}

export default TransactionItem