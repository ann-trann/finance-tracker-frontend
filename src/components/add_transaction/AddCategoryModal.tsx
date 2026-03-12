import React, { useState } from "react"
import { TxType } from "../../types"
import { TYPE_LABELS } from "./data"

interface Props {
  type: TxType
  onClose: () => void
  onAdd: (name: string) => void
}

const AddCategoryModal: React.FC<Props> = ({ type, onClose, onAdd }) => {
  const [name, setName] = useState("")

  const accentColor =
    type === "expense" ? "var(--red)"        :
    type === "income"  ? "var(--green)"      : "var(--gold-light)"

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name.trim())
      onClose()
    }
  }

  return (
    <div className="picker-overlay" onClick={onClose}>
      <div className="addcat-card" onClick={e => e.stopPropagation()}>

        <div className="picker-header">
          <span className="picker-title">Thêm danh mục</span>
          <button className="picker-close" onClick={onClose}>✕</button>
        </div>

        <p className="addcat-sub">
          Loại: <span style={{ color: accentColor }}>{TYPE_LABELS[type]}</span>
        </p>

        <input
          className="field-input addcat-input"
          placeholder="Tên danh mục..."
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAdd()}
          autoFocus
        />

        <div className="form-actions" style={{ marginTop: 16 }}>
          <button className="btn-ghost" onClick={onClose}>Huỷ</button>
          <button className={`at-submit at-submit-${type}`} onClick={handleAdd}>
            Thêm
          </button>
        </div>

      </div>
    </div>
  )
}

export default AddCategoryModal