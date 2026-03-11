export type CategoryType = "income" | "expense"

export interface User {
  id: string
  email: string
}

export interface Wallet {
  id: string
  name: string
  balance: string | number
  userId: string
  createdAt: string
}

export interface Category {
  id: string
  name: string
  type: CategoryType
  isDefault: boolean

  userId?: string

  parentId?: string
  parent?: Category
  children?: Category[]
}

export interface Transaction {
  id: string

  amount: string | number
  description?: string
  date: string

  type: CategoryType

  userId: string

  categoryId?: string
  category?: Category

  walletId: string
  wallet?: Wallet

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