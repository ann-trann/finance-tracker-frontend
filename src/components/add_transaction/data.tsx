import { TxType } from "../../types"

// TYPE_LABELS — nhãn hiển thị cho mỗi loại giao dịch trên UI
export const TYPE_LABELS: Record<TxType, string> = {
  income:  "Khoản thu",
  expense: "Khoản chi",
  loan:    "Đi vay / Cho vay",
}

// fmt — format số tiền VND
export const fmt = (n: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(n)