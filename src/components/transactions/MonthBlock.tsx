import React, { useState } from "react"
import { Transaction } from "../../types"
import DayGroup from "./DayGroup"

const fmtVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n)

const toMonthLabel = (key: string) => {
  const [y, m] = key.split("-")
  const date = new Date(Number(y), Number(m) - 1, 1)
  return date.toLocaleDateString("vi-VN", { month: "long", year: "numeric" })
}

interface MonthData {
  income: number
  expense: number
  days: Record<string, { income: number; expense: number; txs: Transaction[] }>
}

interface Props {
  monthKey: string
  data: MonthData
  onDelete: (id: string) => void
  onClickTx: (tx: Transaction) => void
  defaultOpen?: boolean
}

const MonthBlock: React.FC<Props> = ({ monthKey, data, onDelete, onClickTx, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen)
  const net = data.income - data.expense
  const sortedDays = Object.entries(data.days).sort((a, b) => b[0].localeCompare(a[0]))

  return (
    <div className={`month-block ${open ? "month-open" : ""}`}>
      <button className="month-header" onClick={() => setOpen(o => !o)}>
        <div className="month-title-wrap">
          <svg
            className={`month-chevron ${open ? "chev-open" : ""}`}
            width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
          <span className="month-title">{toMonthLabel(monthKey)}</span>
        </div>

        <div className="month-eq">
          <div className="meq-item">
            <span className="meq-label">Thu</span>
            <span className="meq-income">{fmtVND(data.income)}</span>
          </div>
          <span className="meq-op">−</span>
          <div className="meq-item">
            <span className="meq-label">Chi</span>
            <span className="meq-expense">{fmtVND(data.expense)}</span>
          </div>
          <span className="meq-eq">=</span>
          <div className="meq-item">
            <span className="meq-label">Còn</span>
            <span className={`meq-net ${net >= 0 ? "meq-pos" : "meq-neg"}`}>
              {net >= 0 ? "+" : "−"}{fmtVND(Math.abs(net))}
            </span>
          </div>
        </div>
      </button>

      {open && (
        <div className="month-days">
          {sortedDays.map(([dayKey, dayData]) => (
            <DayGroup
              key={dayKey}
              dayKey={dayKey}
              data={dayData}
              onDelete={onDelete}
              onClickTx={onClickTx}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MonthBlock