import React from "react"

const fmt = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n)

interface Props {
  summary: any
  loading: boolean
}

// Dashboard financial summary cards
const SummaryCards: React.FC<Props> = ({ summary, loading }) => {

  return (
    <div className="summary-grid">

      {/* Net balance */}
      <div className="summary-card summary-balance">
        <div className="summary-label">Net Balance</div>

        <div className="summary-value">
          {loading ? "—" : fmt(summary.balance)}
        </div>
      </div>

      {/* Total income */}
      <div className="summary-card summary-income">
        <div className="summary-label">Total Income</div>

        <div className="summary-value">
          {loading ? "—" : fmt(summary.income)}
        </div>
      </div>

      {/* Total expense */}
      <div className="summary-card summary-expense">
        <div className="summary-label">Total Expense</div>

        <div className="summary-value">
          {loading ? "—" : fmt(summary.expense)}
        </div>
      </div>

    </div>
  )
}

export default SummaryCards