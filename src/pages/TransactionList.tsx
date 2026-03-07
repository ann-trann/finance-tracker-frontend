import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useTransactions } from "../hooks/useFinance"

import TransactionFilters from "../components/transactions/TransactionFilters"
import TransactionTable from "../components/transactions/TransactionTable"

const TransactionList: React.FC = () => {

  // Filter states
  const [month, setMonth] = useState("")
  const [type, setType] = useState("")

  // Fetch transactions with filters
  const {
    transactions,
    loading,
    deleteTransaction,
  } = useTransactions(month || undefined, type || undefined)

  // Delete transaction handler
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this transaction?")) return
    await deleteTransaction(id)
  }

  return (
    <div className="tx-list-page">

      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-sub">{transactions.length} records</p>
        </div>

        <Link to="/add-transaction" className="btn-primary btn-sm">
          + Add
        </Link>
      </div>

      {/* Filters */}
      <TransactionFilters
        month={month}
        type={type}
        setMonth={setMonth}
        setType={setType}
      />

      {/* Transaction list */}
      <div className="card">
        <TransactionTable
          transactions={transactions}
          loading={loading}
          onDelete={handleDelete}
        />
      </div>

    </div>
  )
}

export default TransactionList