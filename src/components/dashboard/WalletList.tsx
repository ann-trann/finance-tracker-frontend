import React from "react"
import { Wallet } from "../../types"

interface Props {
  wallets: Wallet[]
  loading: boolean
}

const WalletList: React.FC<Props> = ({ wallets, loading }) => {

  if (loading) {
    return <div>Loading wallets...</div>
  }

  if (!wallets.length) {
    return <div>No wallets found</div>
  }

  return (
    <div className="wallet-section">

      <h2 className="section-title">Wallets</h2>

      <div className="wallet-grid">

        {wallets.map((wallet) => (
          <div key={wallet.id} className="wallet-card">

            <div className="wallet-name">
              {wallet.name}
            </div>

            <div className="wallet-balance">
              {Number(wallet.balance).toLocaleString()} đ
            </div>

          </div>
        ))}

      </div>

    </div>
  )
}

export default WalletList