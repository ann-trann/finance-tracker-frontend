import React from "react"

// Props for toggle component
interface Props {
  type: "income" | "expense"
  onChange: (type: "income" | "expense") => void
}

const TransactionTypeToggle: React.FC<Props> = ({ type, onChange }) => {
  return (
    // Toggle container
    <div className="type-toggle">
      {/* Expense button */}
      <button
        type="button"
        className={`type-btn ${type === "expense" ? "type-btn-expense-active" : ""}`}
        onClick={() => onChange("expense")}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
        Expense
      </button>

      {/* Income button */}
      <button
        type="button"
        className={`type-btn ${type === "income" ? "type-btn-income-active" : ""}`}
        onClick={() => onChange("income")}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
        Income
      </button>
    </div>
  )
}

export default TransactionTypeToggle