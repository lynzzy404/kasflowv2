// Core Domain Entities
// Reference: docs/00-foundation/01_DOMAIN_MODEL.md

/**
 * Owner - Identity of money ownership
 * Fixed at 2 for v1: 'Me' and 'Girlfriend'
 */
export type Owner = 'Me' | 'Girlfriend'

/**
 * Transaction Type - Determines if balance increases or decreases
 */
export type TransactionType = 'Expense' | 'Income'

/**
 * Wallet - Location where money is stored
 * Can have multiple owner balances
 */
export interface Wallet {
  id: string
  name: string
  active: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * Category - Transaction classification
 * User-extensible (can add beyond initial set)
 */
export interface Category {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Transaction - Core entity, source of truth for all balances
 * Required fields: wallet, owner, category, type, amount, date
 * Optional: note
 */
export interface Transaction {
  id: string
  walletId: string
  owner: Owner
  categoryId: string
  type: TransactionType
  amount: number // Always positive, type determines ↑ or ↓
  date: Date
  note?: string
  createdAt: Date
  updatedAt: Date
  deleted?: boolean // Soft delete flag
}

/**
 * OwnerBalance - Calculated, never stored
 * Balance = sum of transactions for (owner + wallet)
 * Can be negative (reflects shared wallet usage)
 */
export interface OwnerBalance {
  owner: Owner
  walletId: string
  balance: number
}

/**
 * Wallet with balance information
 */
export interface WalletWithBalance extends Wallet {
  totalBalance: number
  ownerBalances: OwnerBalance[]
}

/**
 * Filter options for transaction queries
 */
export interface TransactionFilters {
  owner?: Owner
  walletId?: string
  categoryId?: string
  type?: TransactionType
  dateFrom?: Date
  dateTo?: Date
  searchText?: string
  minAmount?: number
  maxAmount?: number
}

/**
 * App State structure
 */
export interface AppState {
  owners: Owner[]
  wallets: Wallet[]
  transactions: Transaction[]
  categories: Category[]
  loading: boolean
  error?: string
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
