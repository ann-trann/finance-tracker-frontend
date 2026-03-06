import React, { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { useSummary, useTransactions } from "../hooks/useFinance"
import { Transaction } from "../types"

const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
]

const fmt = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n)

// Simple bar chart rendered with SVG
const BarChart: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  const data = useMemo(() => {
    const map: Record<string, { income: number; expense: number }> = {}
    for (let i = 1; i <= 12; i++) {
      const key = String(i).padStart(2, "0")
      map[key] = { income: 0, expense: 0 }
    }
    transactions.forEach((t) => {
      const month = new Date(t.date).getMonth() + 1
      const key = String(month).padStart(2, "0")
      const amt = Number(t.amount)
      if (t.type === "income") map[key].income += amt
      else map[key].expense += amt
    })
    return Object.entries(map).map(([m, v]) => ({ month: MONTHS[parseInt(m) - 1], ...v }))
  }, [transactions])

  const max = Math.max(...data.map((d) => Math.max(d.income, d.expense)), 1)
  const H = 160
  const W = 100

  return (
    <div className="chart-wrap">
      <div className="chart-legend">
        <span className="legend-dot legend-income" /> Income
        <span className="legend-dot legend-expense" /> Expense
      </div>
      <div className="chart-scroll">
        <svg viewBox={`0 0 ${data.length * W} ${H + 32}`} className="chart-svg">
          {data.map((d, i) => {
            const incH = (d.income / max) * H
            const expH = (d.expense / max) * H
            const barW = 28
            const gap = 6
            const x = i * W + (W - barW * 2 - gap) / 2
            return (
              <g key={d.month}>
                {/* Income bar */}
                <rect
                  x={x}
                  y={H - incH}
                  width={barW}
                  height={incH}
                  rx={4}
                  className="bar-income"
                />
                {/* Expense bar */}
                <rect
                  x={x + barW + gap}
                  y={H - expH}
                  width={barW}
                  height={expH}
                  rx={4}
                  className="bar-expense"
                />
                {/* Month label */}
                <text
                  x={i * W + W / 2}
                  y={H + 20}
                  textAnchor="middle"
                  className="chart-label"
                >
                  {d.month}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

const Dashboard: React.FC = () => {
  const { summary, loading: summaryLoading } = useSummary()
  const { transactions, loading: txLoading } = useTransactions()

  const recent = transactions.slice(0, 5)

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">Your financial overview</p>
        </div>
        <Link to="/add-transaction" className="btn-primary btn-sm">
          + Add Transaction
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card summary-balance">
          <div className="summary-label">Net Balance</div>
          <div className="summary-value">
            {summaryLoading ? "—" : fmt(summary.balance)}
          </div>
          <div className="summary-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
            </svg>
          </div>
        </div>

        <div className="summary-card summary-income">
          <div className="summary-label">Total Income</div>
          <div className="summary-value">{summaryLoading ? "—" : fmt(summary.income)}</div>
          <div className="summary-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </div>
        </div>

        <div className="summary-card summary-expense">
          <div className="summary-label">Total Expense</div>
          <div className="summary-value">{summaryLoading ? "—" : fmt(summary.expense)}</div>
          <div className="summary-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Monthly Overview</h2>
        </div>
        {txLoading ? (
          <div className="loading-state">Loading chart…</div>
        ) : (
          <BarChart transactions={transactions} />
        )}
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Transactions</h2>
          <Link to="/transactions" className="card-link">View all →</Link>
        </div>
        {txLoading ? (
          <div className="loading-state">Loading…</div>
        ) : recent.length === 0 ? (
          <div className="empty-state">
            <p>No transactions yet.</p>
            <Link to="/add-transaction" className="btn-primary btn-sm" style={{ marginTop: 12 }}>
              Add your first
            </Link>
          </div>
        ) : (
          <div className="tx-list">
            {recent.map((tx) => (
              <div key={tx.id} className="tx-row">
                <div className={`tx-dot ${tx.type === "income" ? "tx-dot-income" : "tx-dot-expense"}`} />
                <div className="tx-info">
                  <div className="tx-desc">{tx.description || "—"}</div>
                  <div className="tx-date">{new Date(tx.date).toLocaleDateString("vi-VN")}</div>
                </div>
                <div className={`tx-amount ${tx.type === "income" ? "tx-amount-income" : "tx-amount-expense"}`}>
                  {tx.type === "income" ? "+" : "-"}{fmt(Number(tx.amount))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
