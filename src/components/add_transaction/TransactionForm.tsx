import React from "react"
import TransactionFields from "./TransactionFields"

// Props for form component
interface Props {
  form: any
  categories: any[]
  error: string
  loading: boolean
  onChange: (e: React.ChangeEvent<any>) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

const TransactionForm: React.FC<Props> = ({
  form,
  categories,
  error,
  loading,
  onChange,
  onSubmit,
  onCancel,
}) => {
  return (
    // Transaction form container
    <form onSubmit={onSubmit} className="tx-form">

      {/* Error message */}
      {error && <div className="auth-error">{error}</div>}

      {/* Transaction input fields */}
      <TransactionFields
        form={form}
        categories={categories}
        onChange={onChange}
      />

      {/* Form actions */}
      <div className="form-actions">
        {/* Cancel button */}
        <button
          type="button"
          className="btn-ghost"
          onClick={onCancel}
        >
          Cancel
        </button>

        {/* Submit button */}
        <button
          type="submit"
          className={`btn-primary ${
            form.type === "income" ? "btn-income" : "btn-expense"
          }`}
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : `Save ${form.type === "income" ? "Income" : "Expense"}`}
        </button>
      </div>
    </form>
  )
}

export default TransactionForm