import React, { useState, useMemo } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useSummary } from "../hooks"

const fmt = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n)

const CATEGORY_COLORS = [
  "#c9a84c", "#16a34a", "#2563eb", "#dc2626",
  "#7c3aed", "#ea580c", "#0891b2", "#db2777",
  "#65a30d", "#d97706",
]

// ── Pie chart ──────────────────────────────────────
interface Slice { name: string; amount: number; color: string; percent: number }

const PieChart: React.FC<{ slices: Slice[]; total: number }> = ({ slices, total }) => {
  const [hovered, setHovered] = useState<number | null>(null)

  const SIZE   = 200
  const CX     = SIZE / 2
  const CY     = SIZE / 2
  const R      = 80
  const R_INNER = 48  // donut hole

  // Build SVG arc paths
  const paths = useMemo(() => {
    let cumAngle = -Math.PI / 2
    return slices.map((slice, i) => {
      const angle = (slice.percent / 100) * 2 * Math.PI
      const x1 = CX + R * Math.cos(cumAngle)
      const y1 = CY + R * Math.sin(cumAngle)
      cumAngle += angle
      const x2 = CX + R * Math.cos(cumAngle)
      const y2 = CY + R * Math.sin(cumAngle)
      const xi1 = CX + R_INNER * Math.cos(cumAngle - angle)
      const yi1 = CY + R_INNER * Math.sin(cumAngle - angle)
      const xi2 = CX + R_INNER * Math.cos(cumAngle)
      const yi2 = CY + R_INNER * Math.sin(cumAngle)
      const large = angle > Math.PI ? 1 : 0
      return {
        d: [
          `M ${x1} ${y1}`,
          `A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`,
          `L ${xi2} ${yi2}`,
          `A ${R_INNER} ${R_INNER} 0 ${large} 0 ${xi1} ${yi1}`,
          "Z"
        ].join(" "),
        color: slice.color,
        i,
      }
    })
  }, [slices])

  const active = hovered !== null ? slices[hovered] : null

  return (
    <div className="pie-wrap">
      <svg
        width={SIZE} height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="pie-svg"
      >
        {slices.length === 0 ? (
          <circle cx={CX} cy={CY} r={R} fill="var(--bg3)" />
        ) : (
          paths.map((p) => (
            <path
              key={p.i}
              d={p.d}
              fill={p.color}
              opacity={hovered === null || hovered === p.i ? 1 : 0.4}
              style={{
                cursor: "pointer",
                transform: hovered === p.i ? `scale(1.04)` : "scale(1)",
                transformOrigin: `${CX}px ${CY}px`,
                transition: "opacity 0.15s, transform 0.15s",
              }}
              onMouseEnter={() => setHovered(p.i)}
              onMouseLeave={() => setHovered(null)}
            />
          ))
        )}

        {/* Center label */}
        {active ? (
          <>
            <text x={CX} y={CY - 8} textAnchor="middle" className="pie-center-label" style={{ fontSize: 11, fill: "var(--text-muted)" }}>
              {active.name}
            </text>
            <text x={CX} y={CY + 10} textAnchor="middle" style={{ fontSize: 12, fontWeight: 700, fill: active.color, fontFamily: "'DM Serif Display', serif" }}>
              {active.percent.toFixed(1)}%
            </text>
          </>
        ) : (
          <>
            <text x={CX} y={CY - 6} textAnchor="middle" style={{ fontSize: 10, fill: "var(--text-muted)" }}>
              Total
            </text>
            <text x={CX} y={CY + 11} textAnchor="middle" style={{ fontSize: 11, fontWeight: 700, fill: "var(--text)", fontFamily: "'DM Serif Display', serif" }}>
              {total > 0 ? (total >= 1_000_000 ? `${(total/1_000_000).toFixed(1)}M` : `${(total/1_000).toFixed(0)}K`) : "0"}
            </text>
          </>
        )}
      </svg>

      {/* Legend */}
      <div className="pie-legend">
        {slices.map((s, i) => (
          <div
            key={i}
            className={`pie-legend-row ${hovered === i ? "pie-legend-active" : ""}`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="pie-legend-dot" style={{ background: s.color }} />
            <span className="pie-legend-name">{s.name}</span>
            <span className="pie-legend-pct">{s.percent.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Category bar ───────────────────────────────────
const CategoryBar: React.FC<{ slices: Slice[]; total: number }> = ({ slices, total }) => (
  <div className="cat-bars">
    {slices.map((s, i) => (
      <div key={i} className="cat-bar-row">
        <div className="cat-bar-meta">
          <span className="cat-bar-dot" style={{ background: s.color }} />
          <span className="cat-bar-name">{s.name}</span>
          <span className="cat-bar-amount">{fmt(s.amount)}</span>
          <span className="cat-bar-pct">{s.percent.toFixed(1)}%</span>
        </div>
        <div className="cat-bar-track">
          <div
            className="cat-bar-fill"
            style={{ width: `${s.percent}%`, background: s.color }}
          />
        </div>
      </div>
    ))}
    {slices.length === 0 && (
      <div className="empty-state" style={{ padding: "24px 0" }}>
        <p>No expense data this month.</p>
      </div>
    )}
  </div>
)

// ── Month nav helpers ──────────────────────────────
const prevMonth = (m: string) => {
  const [y, mo] = m.split("-").map(Number)
  const d = new Date(y, mo - 2, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}
const nextMonth = (m: string) => {
  const [y, mo] = m.split("-").map(Number)
  const d = new Date(y, mo, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}
const monthLabel = (m: string) => {
  const [y, mo] = m.split("-")
  return new Date(Number(y), Number(mo) - 1, 1)
    .toLocaleDateString("vi-VN", { month: "long", year: "numeric" })
}
const currentMonth = () => {
  const n = new Date()
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`
}

// ── Main ───────────────────────────────────────────
const MonthlySummary: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const month = searchParams.get("month") ?? currentMonth()

  const { summary, loading } = useSummary(month)

  const slices: Slice[] = useMemo(() => {
    const cats = summary?.categories ?? []
    const total = cats.reduce((s: number, c: any) => s + c.amount, 0)
    return cats
      .sort((a: any, b: any) => b.amount - a.amount)
      .map((c: any, i: number) => ({
        name: c.name,
        amount: c.amount,
        color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
        percent: total > 0 ? (c.amount / total) * 100 : 0,
      }))
  }, [summary])

  const income  = summary?.income  ?? 0
  const expense = summary?.expense ?? 0
  const balance = income - expense
  const totalCatExpense = slices.reduce((s, c) => s + c.amount, 0)

  // replace: true — không lưu vào history, Back sẽ về trang trước luôn
  const goMonth = (m: string) => setSearchParams({ month: m }, { replace: true })
  const isCurrentMonth = month === currentMonth()

  return (
    <div className="monthly-page">

      {/* Back */}
      <button className="wallet-detail-back" onClick={() => navigate(-1)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back
      </button>

      {/* Month navigator */}
      <div className="monthly-nav">
        <button className="monthly-nav-btn" onClick={() => goMonth(prevMonth(month))}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="monthly-nav-center">
          <h1 className="monthly-nav-title">{monthLabel(month)}</h1>
          {!isCurrentMonth && (
            <button className="monthly-nav-today" onClick={() => goMonth(currentMonth())}>
              Today
            </button>
          )}
        </div>
        <button
          className="monthly-nav-btn"
          onClick={() => goMonth(nextMonth(month))}
          disabled={isCurrentMonth}
          style={{ opacity: isCurrentMonth ? 0.3 : 1 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {loading ? (
        <div className="loading-state">Loading…</div>
      ) : (
        <>
          {/* Summary stats */}
          <div className="summary-grid">
            <div className="summary-card summary-balance">
              <div className="summary-label">Net Balance</div>
              <div className="summary-value" style={{ color: balance >= 0 ? "var(--green)" : "var(--red)" }}>
                {balance >= 0 ? "+" : ""}{fmt(balance)}
              </div>
              <div className="summary-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
            </div>
            <div className="summary-card summary-income">
              <div className="summary-label">Total Income</div>
              <div className="summary-value">{fmt(income)}</div>
              <div className="summary-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
                </svg>
              </div>
            </div>
            <div className="summary-card summary-expense">
              <div className="summary-label">Total Expense</div>
              <div className="summary-value">{fmt(expense)}</div>
              <div className="summary-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Category breakdown */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Expense by Category</h2>
            </div>

            {slices.length === 0 ? (
              <div className="empty-state" style={{ paddingTop: 24, paddingBottom: 24 }}>
                <p>No expense data this month.</p>
              </div>
            ) : (
              <div className="monthly-breakdown">
                <PieChart slices={slices} total={totalCatExpense} />
                <div className="monthly-breakdown-right">
                  <CategoryBar slices={slices} total={totalCatExpense} />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default MonthlySummary