import React from "react"

// Category structure
interface Category {
  id: string
  name: string
}

// Props for transaction fields
interface Props {
  form: any
  categories: Category[]
  onChange: (e: React.ChangeEvent<any>) => void
}

const TransactionFields: React.FC<Props> = ({ form, categories, onChange }) => {
  return (
    <>
      {/* Amount input */}
      <div className="field-group">
        <label className="field-label">Amount (VND)</label>
        <input
          type="number"
          name="amount"
          className="field-input field-input-lg"
          placeholder="0"
          value={form.amount}
          onChange={onChange}
          required
        />
      </div>

      {/* Date + Category */}
      <div className="form-row">
        {/* Date field */}
        <div className="field-group">
          <label className="field-label">Date</label>
          <input
            type="date"
            name="date"
            className="field-input"
            value={form.date}
            onChange={onChange}
          />
        </div>

        {/* Category dropdown */}
        <div className="field-group">
          <label className="field-label">Category</label>
          <select
            name="categoryId"
            className="field-input"
            value={form.categoryId}
            onChange={onChange}
          >
            <option value="">No category</option>

            {/* Render category options */}
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description textarea */}
      <div className="field-group">
        <label className="field-label">Description</label>
        <textarea
          name="description"
          className="field-input field-textarea"
          placeholder="What was this for?"
          value={form.description}
          onChange={onChange}
        />
      </div>
    </>
  )
}

export default TransactionFields