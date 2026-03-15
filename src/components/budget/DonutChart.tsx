import React, { useEffect, useRef } from "react"
import { BudgetProgress } from "../../types"

declare global {
  interface Window { Chart: any }
}

const fmt = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n)

const COLORS = [
  "#7F77DD", "#1D9E75", "#D85A30", "#378ADD",
  "#D4537E", "#BA7517", "#5DCAA5", "#888780",
]

const CHARTJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"

let chartJsPromise: Promise<void> | null = null

function loadChartJs(): Promise<void> {
  if (window.Chart) return Promise.resolve()
  if (chartJsPromise) return chartJsPromise
  chartJsPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script")
    s.src = CHARTJS_CDN
    s.onload = () => resolve()
    s.onerror = reject
    document.head.appendChild(s)
  })
  return chartJsPromise
}

const DonutChart: React.FC<{ progress: BudgetProgress[] }> = ({ progress }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef  = useRef<any>(null)

  const totalSpent  = progress.reduce((s, p) => s + p.spent, 0)
  const totalBudget = progress.reduce((s, p) => s + p.budget, 0)
  const overallPct  = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0
  const remaining   = Math.max(totalBudget - totalSpent, 0)

  useEffect(() => {
    if (!canvasRef.current || progress.length === 0) return

    let cancelled = false

    loadChartJs().then(() => {
      if (cancelled || !canvasRef.current || !window.Chart) return

      chartRef.current?.destroy()
      chartRef.current = null

      const segColors = progress.map((p, i) =>
        p.percent >= 100
          ? "#E24B4A"
          : p.percent >= 80
          ? "#EF9F27"
          : COLORS[i % COLORS.length]
      )

      chartRef.current = new window.Chart(canvasRef.current, {
        type: "doughnut",
        data: {
          datasets: [{
            data: [...progress.map((p) => p.spent), remaining],
            backgroundColor: [...segColors, "#e5e7eb"],
            borderWidth: 2,
            borderColor: "#ffffff",
            hoverOffset: 6,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1,
          cutout: "68%",
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label(ctx: any) {
                  if (ctx.dataIndex === progress.length)
                    return `Còn lại: ${fmt(remaining)}`
                  const p = progress[ctx.dataIndex]
                  return `${p.category}: ${fmt(p.spent)} / ${fmt(p.budget)}`
                },
              },
            },
          },
        },
      })
    })

    return () => {
      cancelled = true
      chartRef.current?.destroy()
      chartRef.current = null
    }
  }, [progress])

  if (progress.length === 0) return null

  return (
    <div className="donut-wrap">
      <div style={{ position: "relative", width: "100%" }}>
        <canvas ref={canvasRef} />
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          pointerEvents: "none",
        }}>
          <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text)", fontVariantNumeric: "tabular-nums" }}>
            {fmt(totalSpent)}
          </span>
          <span style={{ fontSize: "0.68rem", color: "var(--text-sub)", marginTop: 2 }}>
            {overallPct}% đã chi
          </span>
        </div>
      </div>

      <div className="donut-legend">
        {progress.map((p, i) => {
          const color =
            p.percent >= 100 ? "#E24B4A" : p.percent >= 80 ? "#EF9F27" : COLORS[i % COLORS.length]
          return (
            <div key={p.category} className="donut-legend-row">
              <span className="donut-legend-dot" style={{ background: color }} />
              <span className="donut-legend-label">{p.category}</span>
              <span className="donut-legend-pct" style={{ color }}>{p.percent}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DonutChart