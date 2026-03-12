import React, { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { Transaction } from "../types"
import { useTransactions } from "../hooks"
import { useCategories } from "../hooks/useCategories"
import { useWallets } from "../hooks/useWallets"
import MonthBlock from "../components/transactions/MonthBlock"
import TransactionDetailModal from "../components/transactions/TransactionDetailModal"
import { groupByMonthAndDay } from "../components/transactions/groupByMonthAndDay"

const TransactionList: React.FC = () => {
  const [type, setType] = useState("")
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)

  const { transactions, loading, deleteTransaction, refetch } = useTransactions(
    undefined,
    type || undefined,
  )
  const { categories } = useCategories()
  const { wallets } = useWallets()

  const grouped = useMemo(() => groupByMonthAndDay(transactions), [transactions])

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa giao dịch này?")) return
    await deleteTransaction(id)
  }

  const handleUpdated = (updated: Transaction) => {
    setSelectedTx(updated)  // refresh modal with new data
    refetch()               // re-fetch list from server
  }

  return (
    <div className="tx-list-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Giao dịch</h1>
          <p className="page-sub">{transactions.length} bản ghi</p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div className="type-pills">
            {[
              { v: "", l: "Tất cả" },
              { v: "income", l: "Thu" },
              { v: "expense", l: "Chi" },
            ].map(({ v, l }) => (
              <button
                key={v}
                className={`type-pill ${type === v ? `pill-active pill-${v || "all"}` : ""}`}
                onClick={() => setType(v)}
              >
                {l}
              </button>
            ))}
          </div>

          <Link to="/add-transaction" className="btn-primary btn-sm">+ Thêm</Link>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Đang tải…</div>
      ) : grouped.length === 0 ? (
        <div className="empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity=".3">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
          <p>Chưa có giao dịch nào</p>
        </div>
      ) : (
        <div className="months-list">
          {grouped.map(([monthKey, data], i) => (
            <MonthBlock
              key={monthKey}
              monthKey={monthKey}
              data={data}
              onDelete={handleDelete}
              onClickTx={setSelectedTx}
              defaultOpen={i === 0}
            />
          ))}
        </div>
      )}

      {selectedTx && (
        <TransactionDetailModal
          tx={selectedTx}
          categories={categories}
          wallets={wallets}
          onClose={() => setSelectedTx(null)}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  )
}

export default TransactionList