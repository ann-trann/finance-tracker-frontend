import React from "react"
import { Transaction } from "../../types"
import TransactionItem from "./TransactionItem"

const fmtVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n)

const parseDayLabel = (dateStr: string) => {
  const d = new Date(dateStr)
  return {
    weekday: d.toLocaleDateString("vi-VN", { weekday: "short" }),
    dayNum: d.getDate(),
    month: d.getMonth() + 1,
  }
}

interface DayData {
  income: number
  expense: number
  txs: Transaction[]
}

interface Props {
  dayKey: string
  data: DayData
  onDelete: (id: string) => void
  onClickTx: (tx: Transaction) => void
}

const DayGroup: React.FC<Props> = ({ dayKey, data, onDelete, onClickTx }) => {
  const net = data.income - data.expense
  const { weekday, dayNum, month } = parseDayLabel(dayKey)

  return (
    <div className="day-group">
      <div className="day-header">
        <div className="day-date-block">
          <span className="day-num">{dayNum}</span>
          <div className="day-meta">
            <span className="day-weekday">{weekday}</span>
            <span className="day-month-label">tháng {month}</span>
          </div>
        </div>

        <div className="day-divider" />

        <span className={`day-net ${net >= 0 ? "net-pos" : "net-neg"}`}>
          {net >= 0 ? "+" : "−"}{fmtVND(Math.abs(net))}
        </span>
      </div>

      <div className="day-txs">
        {data.txs.map(tx => (
          <TransactionItem key={tx.id} tx={tx} onDelete={onDelete} onClick={onClickTx} />
        ))}
      </div>
    </div>
  )
}

export default DayGroup