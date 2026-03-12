import React from "react"
import { TxType, Wallet } from "../../types"
import { useWallets } from "../../hooks"
import { fmt } from "./data"

interface Props {
  txType: TxType
  selectedId: string
  onSelect: (wallet: Wallet) => void
  onClose: () => void
}

const WalletIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 3H8L2 7h20L16 3z" />
    <circle cx="16" cy="14" r="1.5" fill="currentColor" stroke="none" />
  </svg>
)

const WalletPicker: React.FC<Props> = ({ txType, selectedId, onSelect, onClose }) => {
  const { wallets, loading } = useWallets()

  return (
    <div className="picker-overlay" onClick={onClose}>
      <div className="picker-card" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="picker-header">
          <span className="picker-title">Chọn ví</span>
          <button className="picker-close" onClick={onClose}>✕</button>
        </div>

        {/* Wallet list */}
        <div className="picker-list">
          {loading ? (
            <div className="picker-loading">Đang tải...</div>
          ) : (
            wallets.map(w => {
              const active = selectedId === w.id
              return (
                <div
                  key={w.id}
                  className={`wpicker-item ${active ? `wpicker-item-active-${txType}` : ""}`}
                  onClick={() => { onSelect(w); onClose() }}
                >
                  <div className={`wpicker-icon-wrap ${active ? `wpicker-icon-active-${txType}` : ""}`}>
                    <WalletIcon />
                  </div>
                  <div className="wpicker-info">
                    <span className={`wpicker-name ${active ? `wpicker-name-${txType}` : ""}`}>
                      {w.name}
                    </span>
                    <span className="wpicker-bal">{fmt(Number(w.balance))}</span>
                  </div>
                  {active && (
                    <span className={`wpicker-check wpicker-check-${txType}`}>✓</span>
                  )}
                </div>
              )
            })
          )}
        </div>

      </div>
    </div>
  )
}

export default WalletPicker