import React from "react"

// Month filter options
const MONTHS = [
  { val: "", label: "All months" },
  { val: "01", label: "January" },
  { val: "02", label: "February" },
  { val: "03", label: "March" },
  { val: "04", label: "April" },
  { val: "05", label: "May" },
  { val: "06", label: "June" },
  { val: "07", label: "July" },
  { val: "08", label: "August" },
  { val: "09", label: "September" },
  { val: "10", label: "October" },
  { val: "11", label: "November" },
  { val: "12", label: "December" },
]

interface Props {
  month: string
  type: string
  setMonth: (v: string) => void
  setType: (v: string) => void
}

// Transaction filter bar
const TransactionFilters: React.FC<Props> = ({
  month,
  type,
  setMonth,
  setType,
}) => {
  return (
    <div className="filter-bar">

      {/* Month dropdown */}
      <select
        className="filter-select"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      >
        {MONTHS.map((m) => (
          <option key={m.val} value={m.val}>
            {m.label}
          </option>
        ))}
      </select>

      {/* Type filter buttons */}
      <div className="filter-types">
        {["", "income", "expense"].map((t) => (
          <button
            key={t}
            className={`filter-type-btn ${
              type === t ? "filter-type-active" : ""
            }`}
            onClick={() => setType(t)}
          >
            {t === "" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

    </div>
  )
}

export default TransactionFilters