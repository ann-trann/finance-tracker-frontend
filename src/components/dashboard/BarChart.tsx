import React, { useMemo, useState } from "react"
import { Transaction } from "../../types"

const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
]

const fmtShort = (n: number) => {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B"
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"
  if (n >= 1_000)         return (n / 1_000).toFixed(0) + "K"
  return String(n)
}

const fmtVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n)

interface TooltipState {
  x: number
  month: string
  income: number
  expense: number
}

const BarChart: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const data = useMemo(() => {
    const map: Record<string, { income: number; expense: number }> = {}
    for (let i = 1; i <= 12; i++) {
      map[String(i).padStart(2, "0")] = { income: 0, expense: 0 }
    }
    transactions.forEach((t) => {
      const key = String(new Date(t.date).getMonth() + 1).padStart(2, "0")
      const amt = Number(t.amount)
      if (t.type === "income") map[key].income += amt
      else                     map[key].expense += amt
    })
    return Object.entries(map).map(([m, v]) => ({
      month: MONTHS[parseInt(m) - 1],
      ...v,
    }))
  }, [transactions])

  const max = Math.max(...data.map((d) => Math.max(d.income, d.expense)), 1)

  // Layout
  const H         = 240   // taller chart
  const TOP_PAD   = 16    // padding so top Y label isn't clipped by legend
  const BAR_W     = 32
  const BAR_GAP   = 7
  const COL_W     = 110
  const Y_AXIS_W  = 64
  const CHART_W   = data.length * COL_W
  const TOTAL_W   = CHART_W + Y_AXIS_W
  const TICK_COUNT = 4

  const ticks = Array.from({ length: TICK_COUNT + 1 }, (_, i) =>
    Math.round((max * i) / TICK_COUNT)
  )

  const handleMouseEnter = (
    e: React.MouseEvent<SVGGElement>,
    d: { month: string; income: number; expense: number },
    i: number
  ) => {
    const svg = e.currentTarget.ownerSVGElement as SVGSVGElement
    const rect = svg.getBoundingClientRect()
    const scaleX = rect.width / TOTAL_W
    setTooltip({
      x: (Y_AXIS_W + i * COL_W + COL_W / 2) * scaleX,
      month: d.month,
      income: d.income,
      expense: d.expense,
    })
  }

  return (
    <div className="chart-wrap" style={{ position: "relative" }}>

      {/* Legend — bigger text via inline override */}
      <div className="chart-legend">
        <span style={{ display: "flex", alignItems: "center", fontSize: "0.9rem", fontWeight: 500 }}>
          <span className="legend-dot legend-income" /> Income
        </span>
        <span style={{ display: "flex", alignItems: "center", fontSize: "0.9rem", fontWeight: 500 }}>
          <span className="legend-dot legend-expense" /> Expense
        </span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div className="chart-tooltip" style={{ left: tooltip.x, transform: "translateX(-50%)" }}>
          <div className="chart-tooltip-month">{tooltip.month}</div>
          <div className="chart-tooltip-row">
            <span className="chart-tooltip-dot chart-tooltip-income" />
            <span className="chart-tooltip-label">Income</span>
            <span className="chart-tooltip-value income">{fmtVND(tooltip.income)}</span>
          </div>
          <div className="chart-tooltip-row">
            <span className="chart-tooltip-dot chart-tooltip-expense" />
            <span className="chart-tooltip-label">Expense</span>
            <span className="chart-tooltip-value expense">{fmtVND(tooltip.expense)}</span>
          </div>
          <div className="chart-tooltip-divider" />
          <div className="chart-tooltip-row">
            <span className="chart-tooltip-label" style={{ flex: 1 }}>Net</span>
            <span
              className="chart-tooltip-value"
              style={{ color: tooltip.income - tooltip.expense >= 0 ? "var(--green)" : "var(--red)" }}
            >
              {tooltip.income - tooltip.expense >= 0 ? "+" : ""}
              {fmtVND(tooltip.income - tooltip.expense)}
            </span>
          </div>
        </div>
      )}

      <div className="chart-scroll">
        <svg
          viewBox={`0 0 ${TOTAL_W} ${H + 40 + TOP_PAD}`}
          className="chart-svg"
          onMouseLeave={() => setTooltip(null)}
        >
          {/* Y axis gridlines + labels */}
          {ticks.map((tick) => {
            const y = TOP_PAD + H - (tick / max) * H
            return (
              <g key={tick}>
                <line
                  x1={Y_AXIS_W} y1={y}
                  x2={TOTAL_W}  y2={y}
                  stroke="var(--border)"
                  strokeWidth={1}
                  strokeDasharray="4 3"
                />
                <text
                  x={Y_AXIS_W - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="chart-label"
                  style={{ fontSize: 18 }}
                >
                  {fmtShort(tick)}
                </text>
              </g>
            )
          })}

          {/* Bars */}
          {data.map((d, i) => {
            const incH = (d.income  / max) * H
            const expH = (d.expense / max) * H
            const x    = Y_AXIS_W + i * COL_W + (COL_W - BAR_W * 2 - BAR_GAP) / 2

            return (
              <g
                key={d.month}
                onMouseEnter={(e) => handleMouseEnter(e, d, i)}
                style={{ cursor: "pointer" }}
              >
                {/* Invisible hit area */}
                <rect
                  x={Y_AXIS_W + i * COL_W} y={TOP_PAD}
                  width={COL_W} height={H + 4}
                  fill="transparent"
                />

                {/* Income bar */}
                <rect
                  x={x} y={TOP_PAD + H - incH}
                  width={BAR_W} height={Math.max(incH, 0)}
                  rx={4} className="bar-income"
                />

                {/* Expense bar */}
                <rect
                  x={x + BAR_W + BAR_GAP} y={TOP_PAD + H - expH}
                  width={BAR_W} height={Math.max(expH, 0)}
                  rx={4} className="bar-expense"
                />

                {/* Month label */}
                <text
                  x={Y_AXIS_W + i * COL_W + COL_W / 2}
                  y={TOP_PAD + H + 26}
                  textAnchor="middle"
                  className="chart-label"
                  style={{ fontSize: 22 }}
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