import { Transaction } from "../../types"

export interface DayData {
  income: number
  expense: number
  txs: Transaction[]
}

export interface MonthData {
  income: number
  expense: number
  days: Record<string, DayData>
}

export function groupByMonthAndDay(transactions: Transaction[]): [string, MonthData][] {
  const months: Record<string, MonthData> = {}

  for (const tx of transactions) {
    const d = new Date(tx.date)
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    const dayKey = d.toISOString().slice(0, 10)

    if (!months[monthKey]) months[monthKey] = { income: 0, expense: 0, days: {} }
    if (!months[monthKey].days[dayKey])
      months[monthKey].days[dayKey] = { income: 0, expense: 0, txs: [] }

    const amt = Number(tx.amount)
    months[monthKey].days[dayKey].txs.push(tx)

    if (tx.type === "income") {
      months[monthKey].income += amt
      months[monthKey].days[dayKey].income += amt
    } else {
      months[monthKey].expense += amt
      months[monthKey].days[dayKey].expense += amt
    }
  }

  return Object.entries(months).sort((a, b) => b[0].localeCompare(a[0]))
}