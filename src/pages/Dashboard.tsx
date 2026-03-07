import React from "react"
import { Link } from "react-router-dom"
import { useSummary, useTransactions } from "../hooks/useFinance"

import SummaryCards from "../components/dashboard/SummaryCards"
import MonthlyChart from "../components/dashboard/MonthlyChart"
import RecentTransactions from "../components/dashboard/RecentTransactions"

const Dashboard: React.FC = () => {

  const { summary, loading: summaryLoading } = useSummary()
  const { transactions, loading: txLoading } = useTransactions()

  return (
    <div className="dashboard">

      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">Your financial overview</p>
        </div>

        <Link to="/add-transaction" className="btn-primary btn-sm">
          + Add Transaction
        </Link>
      </div>

      {/* Summary cards */}
      <SummaryCards summary={summary} loading={summaryLoading} />

      {/* Monthly chart */}
      <MonthlyChart
        transactions={transactions}
        loading={txLoading}
      />

      {/* Recent transactions */}
      <RecentTransactions
        transactions={transactions}
        loading={txLoading}
      />

    </div>
  )
}

export default Dashboard