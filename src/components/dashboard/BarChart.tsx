import React, { useMemo } from "react"
import { Transaction } from "../../types"

// Month labels
const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
]

// SVG bar chart for income/expense
const BarChart: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {

  // Aggregate data by month
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

    return Object.entries(map).map(([m, v]) => ({
      month: MONTHS[parseInt(m) - 1],
      ...v,
    }))
  }, [transactions])

  const max = Math.max(...data.map((d) => Math.max(d.income, d.expense)), 1)

  const H = 160
  const W = 100

  return (
    <div className="chart-wrap">

      {/* Chart legend */}
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

export default BarChart