export type CategoryType = "income" | "expense"
export type TxType = CategoryType | "loan"

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface Wallet {
  id: string
  name: string
  initialBalance: string | number
  balance: string | number
  userId: string
  createdAt: string
}

export interface Category {
  id: string
  name: string
  type: CategoryType
  icon?: string
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

export interface CategoryStat {
  name: string
  amount: number
}
 
export interface Summary {
  income: number
  expense: number
  balance: number
  categories: CategoryStat[]
}

export interface AuthContextType {
  user: User | null
  token: string | null

  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (updated: Partial<User>) => void

  isAuthenticated: boolean
}


export interface BudgetProgress {
  budgetId: string
  category: string
  budget: number
  spent: number
  remaining: number
  percent: number
}
 
export interface Budget {
  id: string
  categoryId: string
  amount: string | number
  periodStart: string
  category: {
    id: string
    name: string
    type: string
    icon?: string
  }
}