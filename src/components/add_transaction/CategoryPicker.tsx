import React from "react"
import { TxType, Category } from "../../types"
import { useCategories } from "../../hooks"
import CategoryIcon from "./CategoriesIcon"

interface Props {
  activeType: TxType
  onTypeChange: (t: TxType) => void
  onSelect: (category: Category) => void
  onClose: () => void
  onAddNew: () => void
}

const CategoryPicker: React.FC<Props> = ({
  activeType,
  onTypeChange,
  onSelect,
  onClose,
  onAddNew,
}) => {
  const { categories, loading } = useCategories(activeType)

  const dotColor =
    activeType === "expense" ? "var(--red)"   :
    activeType === "income"  ? "var(--green)" : "var(--gold)"

  return (
    <div className="picker-overlay" onClick={onClose}>
      <div className="picker-card" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="picker-header">
          <span className="picker-title">Chọn danh mục</span>
          <button className="picker-close" onClick={onClose}>✕</button>
        </div>

        {/* Type tabs */}
        <div className="picker-tabs">
          {(["expense", "income", "loan"] as TxType[]).map(t => (
            <button
              key={t}
              className={`picker-tab ${activeType === t ? `picker-tab-active-${t}` : ""}`}
              onClick={() => onTypeChange(t)}
            >
              {t === "expense" ? "Chi" : t === "income" ? "Thu" : "Vay / Cho vay"}
            </button>
          ))}
        </div>

        {/* Category list */}
        <div className="picker-list">
          {loading ? (
            <div className="picker-loading">Đang tải...</div>
          ) : (
            categories.map(cat => (
              <div key={cat.id}>

                {/* Parent — always clickable */}
                <div
                  className="picker-item picker-item-selectable"
                  onClick={() => onSelect(cat)}
                >
                  <span className="picker-item-icon">
                    <CategoryIcon name={cat.icon} size={18} />
                  </span>
                  <span className="picker-item-name">{cat.name}</span>
                </div>

                {/* Children — always visible, indented */}
                {cat.children?.map((child: Category) => (
                  <div
                    key={child.id}
                    className="picker-subitem"
                    onClick={() => onSelect(child)}
                  >
                    <span className="picker-sub-dot" style={{ background: dotColor }} />
                    <span className="picker-subitem-icon">
                      <CategoryIcon name={child.icon} size={14} />
                    </span>
                    <span className="picker-subitem-name">{child.name}</span>
                  </div>
                ))}

              </div>
            ))
          )}
        </div>

        {/* Add new — hidden for loan type */}
        {activeType !== "loan" && (
          <button
            className={`picker-add-btn picker-add-btn-${activeType}`}
            onClick={onAddNew}
          >
            <span>＋</span> Thêm danh mục mới
          </button>
        )}

      </div>
    </div>
  )
}

export default CategoryPicker