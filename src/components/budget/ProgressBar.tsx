import React from "react"

const ProgressBar: React.FC<{ percent: number }> = ({ percent }) => {
  const capped = Math.min(percent, 100)
  const color = percent >= 100 ? "var(--red)" : percent >= 80 ? "#f59e0b" : "var(--green)"
  return (
    <div className="budget-bar-track">
      <div className="budget-bar-fill" style={{ width: `${capped}%`, background: color }} />
    </div>
  )
}

export default ProgressBar