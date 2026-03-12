import React from "react"
import { TxType } from "../../types"
import { TYPE_LABELS } from "../add_transaction/data"

interface Props {
  txType: TxType
  onChange: (t: TxType) => void
}

const TAB_ICON: Record<TxType, string> = {
  expense: "↓",
  income:  "↑",
  loan:    "⇄",
}

const TAB_LABEL: Record<TxType, string> = {
  expense: "Khoản chi",
  income:  "Khoản thu",
  loan:    "Đi vay / Cho vay",
}

const TransactionTypeTabs: React.FC<Props> = ({ txType, onChange }) => (
  <>
    <div className="at-type-tabs">
      {(["expense", "income", "loan"] as TxType[]).map(t => (
        <button
          key={t}
          className={`at-type-tab ${txType === t ? `at-type-tab-active tab-${t}` : ""}`}
          onClick={() => onChange(t)}
        >
          <span className="at-tab-icon">{TAB_ICON[t]}</span>
          <span className="at-tab-label">{TAB_LABEL[t]}</span>
        </button>
      ))}
    </div>

    <div className={`at-indicator ind-${txType}`}>
      {TAB_ICON[txType]} {TYPE_LABELS[txType]}
    </div>
  </>
)

export default TransactionTypeTabs