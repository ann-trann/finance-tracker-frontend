import React, { useState, useMemo } from "react"
import { useBudgets } from "../hooks"
import { BudgetProgress } from "../types"
import DonutChart from "../components/budget/DonutChart"
import ProgressBar from "../components/budget/ProgressBar"
import BudgetCard from "../components/budget/BudgetCard"
import AddBudgetForm from "../components/budget/AddBudgetForm"
import EditBudgetModal from "../components/budget/EditBudgetModal"

const fmt = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n)

const toMonthParam = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`

const monthLabel = (d: Date) =>
  d.toLocaleDateString("vi-VN", { month: "long", year: "numeric" })

const BudgetPage: React.FC = () => {
  const [monthOffset, setMonthOffset] = useState(0)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editTarget, setEditTarget] = useState<{
    item: BudgetProgress; id: string; amount: number
  } | null>(null)

  const currentDate = useMemo(() => {
    const d = new Date()
    d.setDate(1)
    d.setMonth(d.getMonth() + monthOffset)
    return d
  }, [monthOffset])

  const period = toMonthParam(currentDate)
  const { progress, budgets, loading, error, refetch, createBudget, deleteBudget } = useBudgets(period)

  const budgetedCatIds = useMemo(() => budgets.map((b) => b.categoryId), [budgets])

  const budgetMap = useMemo(() => {
    const m: Record<string, { categoryId: string; amount: number }> = {}
    budgets.forEach((b) => { m[b.id] = { categoryId: b.categoryId, amount: Number(b.amount) } })
    return m
  }, [budgets])

  const totalBudget = progress.reduce((s, p) => s + p.budget, 0)
  const totalSpent  = progress.reduce((s, p) => s + p.spent, 0)
  const overCount   = progress.filter((p) => p.percent >= 100).length
  const warnCount   = progress.filter((p) => p.percent >= 80 && p.percent < 100).length
  const overallPct  = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0

  const handleDelete = async (id: string) => {
    if (!confirm("Xoá ngân sách này?")) return
    await deleteBudget(id)
  }

  const handleSaveEdit = async (id: string, newAmount: number) => {
    const b = budgetMap[id]
    if (!b) return
    await createBudget({ categoryId: b.categoryId, amount: newAmount, period })
  }

  return (
    <div className="add-tx-page">

      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Ngân sách</h1>
          <p className="page-sub">Giới hạn chi tiêu theo danh mục</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="budget-month-nav">
            <button className="btn-ghost" style={{ padding: "7px 12px" }} onClick={() => setMonthOffset((o) => o - 1)}>‹</button>
            <span className="budget-month-label">{monthLabel(currentDate)}</span>
            <button className="btn-ghost" style={{ padding: "7px 12px" }} onClick={() => setMonthOffset((o) => Math.min(o + 1, 0))} disabled={monthOffset >= 0}>›</button>
          </div>
          <button className="btn-primary btn-sm btn-expense" onClick={() => setShowAddForm((v) => !v)}>
            {showAddForm ? "✕ Đóng" : "+ Thêm ngân sách"}
          </button>
        </div>
      </div>

      {/* ── Add form ── */}
      {showAddForm && (
        <AddBudgetForm
          period={period}
          onAdded={refetch}
          createBudget={createBudget}
          budgetedCatIds={budgetedCatIds}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {/* ── Summary strip ── */}
      <div className="budget-summary-strip">
        <div className="budget-strip-item">
          <span className="budget-strip-label">Tổng ngân sách</span>
          <span className="budget-strip-value">{fmt(totalBudget)}</span>
        </div>
        <div className="budget-strip-divider" />
        <div className="budget-strip-item">
          <span className="budget-strip-label">Đã chi</span>
          <span className="budget-strip-value" style={{ color: overallPct >= 100 ? "var(--red)" : "var(--text)" }}>
            {fmt(totalSpent)}
          </span>
        </div>
        <div className="budget-strip-divider" />
        <div className="budget-strip-item">
          <span className="budget-strip-label">Còn lại</span>
          <span className="budget-strip-value" style={{ color: totalSpent > totalBudget ? "var(--red)" : "var(--green)" }}>
            {fmt(totalBudget - totalSpent)}
          </span>
        </div>
        <div className="budget-strip-divider" />
        <div className="budget-strip-item">
          <span className="budget-strip-label">Tổng thể</span>
          <span className="budget-strip-value" style={{ color: overallPct >= 100 ? "var(--red)" : overallPct >= 80 ? "#f59e0b" : "var(--green)" }}>
            {overallPct}%
          </span>
        </div>
        {(overCount > 0 || warnCount > 0) && (
          <>
            <div className="budget-strip-divider" />
            <div className="budget-strip-item">
              <span className="budget-strip-label">Cảnh báo</span>
              <span className="budget-strip-value">
                {overCount > 0 && <span className="budget-badge budget-badge-over">{overCount} vượt</span>}
                {warnCount > 0 && <span className="budget-badge budget-badge-warn" style={{ marginLeft: 4 }}>{warnCount} gần giới hạn</span>}
              </span>
            </div>
          </>
        )}
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="loading-state">Đang tải…</div>
      ) : error ? (
        <div className="auth-error">{error}</div>
      ) : progress.length === 0 ? (
        <div className="empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity=".3">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          </svg>
          <p>Chưa có ngân sách nào cho tháng này</p>
        </div>
      ) : (
        <div className="budget-main-layout">

          {/* Chart panel */}
          <div className="budget-chart-panel card">
            <div className="card-header" style={{ marginBottom: 12 }}>
              <h2 className="card-title">Biểu đồ chi tiêu</h2>
            </div>
            <DonutChart progress={progress} />
            <div style={{ marginTop: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: "0.78rem", color: "var(--text-sub)" }}>Tổng chi / ngân sách</span>
                <span style={{ fontSize: "0.78rem", fontWeight: 600, color: overallPct >= 100 ? "var(--red)" : overallPct >= 80 ? "#f59e0b" : "var(--green)" }}>
                  {overallPct}%
                </span>
              </div>
              <ProgressBar percent={overallPct} />
            </div>
          </div>

          {/* List panel */}
          <div className="budget-list-panel">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <h2 className="card-title">Chi tiết</h2>
              <span className="page-sub">{progress.length} danh mục</span>
            </div>
            <div className="budget-grid">
              {progress.map((item) => {
                const matchBudget = budgets.find((b) => (b.category as any)?.name === item.category)
                const bId = matchBudget?.id ?? item.budgetId
                const bAmt = matchBudget ? Number(matchBudget.amount) : item.budget
                return (
                  <BudgetCard
                    key={item.budgetId}
                    item={item}
                    budgetId={bId}
                    currentAmount={bAmt}
                    onDelete={handleDelete}
                    onEdit={(item, id, amt) => setEditTarget({ item, id, amount: amt })}
                  />
                )
              })}
            </div>
          </div>

        </div>
      )}

      {/* ── Edit modal ── */}
      {editTarget && (
        <EditBudgetModal
          item={editTarget.item}
          budgetId={editTarget.id}
          currentAmount={editTarget.amount}
          onClose={() => setEditTarget(null)}
          onSave={handleSaveEdit}
        />
      )}

    </div>
  )
}

export default BudgetPage