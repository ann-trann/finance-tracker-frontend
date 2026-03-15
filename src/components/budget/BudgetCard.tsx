import React from "react"
import { BudgetProgress } from "../../types"
import ProgressBar from "./ProgressBar"

const fmt = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n)

interface Props {
  item: BudgetProgress
  budgetId: string
  currentAmount: number
  onDelete: (id: string) => void
  onEdit: (item: BudgetProgress, id: string, amount: number) => void
}

const BudgetCard: React.FC<Props> = ({ item, budgetId, currentAmount, onDelete, onEdit }) => {
  const isOver = item.percent >= 100
  const isWarn = item.percent >= 80 && item.percent < 100

  return (
    <div className={`budget-card${isOver ? " budget-card-over" : isWarn ? " budget-card-warn" : ""}`}>
      <div className="budget-card-header">
        <div className="budget-cat-name">{item.category}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {isOver && <span className="budget-badge budget-badge-over">Vượt ngân sách</span>}
          {isWarn && <span className="budget-badge budget-badge-warn">Gần giới hạn</span>}

          <button className="budget-icon-btn" title="Sửa" onClick={() => onEdit(item, budgetId, currentAmount)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>

          <button className="budget-icon-btn budget-icon-btn-danger" title="Xoá" onClick={() => onDelete(budgetId)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
            </svg>
          </button>
        </div>
      </div>

      <ProgressBar percent={item.percent} />

      <div className="budget-stats">
        <div className="budget-stat">
          <span className="budget-stat-label">Đã chi</span>
          <span className="budget-stat-val" style={{ color: isOver ? "var(--red)" : "var(--text)" }}>
            {fmt(item.spent)}
          </span>
        </div>
        <div className="budget-stat" style={{ textAlign: "center" }}>
          <span className="budget-stat-label">Còn lại</span>
          <span className="budget-stat-val" style={{ color: item.remaining < 0 ? "var(--red)" : "var(--green)" }}>
            {fmt(item.remaining)}
          </span>
        </div>
        <div className="budget-stat" style={{ textAlign: "right" }}>
          <span className="budget-stat-label">Giới hạn</span>
          <span className="budget-stat-val">{fmt(item.budget)}</span>
        </div>
      </div>

      <div className="budget-percent-row">
        <span
          className="budget-percent-label"
          style={{ color: isOver ? "var(--red)" : isWarn ? "#f59e0b" : "var(--text-muted)" }}
        >
          {item.percent}% đã sử dụng
        </span>
      </div>
    </div>
  )
}

export default BudgetCard