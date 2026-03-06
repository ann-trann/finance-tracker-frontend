export interface User {
  id: string
  email: string
}

export interface Category {
  id: string
  name: string
  type: "income" | "expense"
  isDefault: boolean
  userId?: string
}

export interface Transaction {
  id: string
  amount: string | number
  description?: string
  date: string
  type: "income" | "expense"
  userId: string
  categoryId?: string
  category?: Category
  createdAt: string
}

export interface Summary {
  income: number
  expense: number
  balance: number
}

export interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}
