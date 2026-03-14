import React from "react"
import { Link } from "react-router-dom"
import { useSummary, useTransactions, useWallets } from "../hooks"

import SummaryCards from "../components/dashboard/SummaryCards"
import MonthlyChart from "../components/dashboard/MonthlyChart"
import RecentTransactions from "../components/dashboard/RecentTransactions"
import WalletList from "../components/dashboard/WalletList"
import TopTransactions from "../components/dashboard/TopTransactions"

const Dashboard: React.FC = () => {
  const { summary, loading: summaryLoading } = useSummary()
  const { transactions, loading: txLoading } = useTransactions()
  const { wallets, loading: walletLoading } = useWallets()

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

      {/* Wallet list */}
      <WalletList wallets={wallets} loading={walletLoading} />

      {/* Monthly chart */}
      <MonthlyChart transactions={transactions} loading={txLoading} />

      {/* Top 5 transactions this month + Recent transactions side by side */}
      <div className="dashboard-bottom-grid">
        <TopTransactions transactions={transactions} loading={txLoading} />
        <RecentTransactions transactions={transactions} loading={txLoading} />
      </div>

    </div>
  )
}

export default Dashboard