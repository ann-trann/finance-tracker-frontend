import React from "react"
import BarChart from "./BarChart"
import { Transaction } from "../../types"

interface Props {
  transactions: Transaction[]
  loading: boolean
}

// Wrapper card for monthly chart
const MonthlyChart: React.FC<Props> = ({ transactions, loading }) => {

  return (
    <div className="card">

      <div className="card-header">
        <h2 className="card-title">Monthly Overview</h2>
      </div>

      {loading ? (
        <div className="loading-state">Loading chart…</div>
      ) : (
        <BarChart transactions={transactions} />
      )}

    </div>
  )
}

export default MonthlyChart