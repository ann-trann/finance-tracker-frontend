import React from "react"
import TransactionRow from "./TransactionRow"

interface Props {
  transactions: any[]
  loading: boolean
  onDelete: (id: string) => void
}

// Transaction list container
const TransactionTable: React.FC<Props> = ({
  transactions,
  loading,
  onDelete,
}) => {

  if (loading) {
    return (
      <div className="loading-state">
        Loading transactions…
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <p>No transactions found</p>
      </div>
    )
  }

  return (
    <div className="tx-list">

      {transactions.map((tx) => (
        <TransactionRow
          key={tx.id}
          tx={tx}
          onDelete={onDelete}
        />
      ))}

    </div>
  )
}

export default TransactionTable