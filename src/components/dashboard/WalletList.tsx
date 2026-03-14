import React from "react"
import { Link } from "react-router-dom"
import { Wallet } from "../../types"

const fmt = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n)

interface Props {
  wallets: Wallet[]
  loading: boolean
}

// Compact wallet summary shown on Dashboard
const WalletList: React.FC<Props> = ({ wallets, loading }) => {

  // Calculate total balance of all wallets
  const totalBalance = wallets.reduce((sum, w) => sum + Number(w.balance), 0)

  return (
    <div className="card">
      <div className="card-header">
        {/* Section title + link to full wallet management page */}
        <h2 className="card-title">Wallets</h2>
        <Link to="/wallets" className="card-link">Manage →</Link>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="loading-state">Loading…</div>
      ) : wallets.length === 0 ? (
        <div className="empty-state">
          <p>No wallets yet.</p>
          <Link to="/wallets" className="btn-primary btn-sm" style={{ marginTop: 12 }}>
            Create wallet
          </Link>
        </div>

      ) : (
        <>
          {/* Wallet list */}
          <div className="wallet-grid">
            {wallets.map((wallet) => (
              <Link
                key={wallet.id}
                to={`/wallets/${wallet.id}`}
                className="wallet-card wallet-card-link"
              >
                {/* Wallet header */}
                <div className="wallet-card-header">
                  <div className="wallet-card-icon">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <rect x="2" y="7" width="20" height="14" rx="2"/>
                      <path d="M16 3H8L2 7h20L16 3z"/>
                      <circle cx="16" cy="14" r="1.5" fill="currentColor" stroke="none"/>
                    </svg>
                  </div>
                  {/* Wallet name */}
                  <div className="wallet-name">{wallet.name}</div>
                </div>
                <div className="wallet-balance">{fmt(Number(wallet.balance))}</div>
              </Link>
            ))}
          </div>

          {/* Show total balance if there are multiple wallets */}
          {wallets.length > 1 && (
            <div className="wallet-total">
              <span className="wallet-total-label">Total</span>
              <span className="wallet-total-value">{fmt(totalBalance)}</span>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default WalletList