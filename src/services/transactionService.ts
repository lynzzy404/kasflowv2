// Transaction Service - Business logic for transactions
// Handles validation, creation, editing, deletion

import { db } from '@db/schema'
import type { Transaction, Owner, TransactionFilters } from '@/types/entities'

/**
 * Validate transaction before save
 */
export function validateTransaction(transaction: Partial<Transaction>): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!transaction.walletId) errors.push('Wallet is required')
  if (!transaction.owner) errors.push('Owner is required')
  if (!transaction.categoryId) errors.push('Category is required')
  if (!transaction.type) errors.push('Type is required')
  if (typeof transaction.amount !== 'number' || transaction.amount <= 0) {
    errors.push('Amount must be greater than 0')
  }
  if (!transaction.date) errors.push('Date is required')

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Add new transaction
 */
export async function addTransaction(
  transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Transaction> {
  const validation = validateTransaction(transaction)
  if (!validation.valid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
  }

  const newTransaction: Transaction = {
    ...transaction,
    id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await db.transactions.put(newTransaction)
  return newTransaction
}

/**
 * Edit existing transaction
 */
export async function editTransaction(
  id: string,
  updates: Partial<Transaction>,
): Promise<Transaction> {
  const existing = await db.transactions.get(id)
  if (!existing) throw new Error('Transaction not found')

  const updated: Transaction = {
    ...existing,
    ...updates,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date(),
  }

  const validation = validateTransaction(updated)
  if (!validation.valid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
  }

  await db.transactions.put(updated)
  return updated
}

/**
 * Soft delete transaction (mark as deleted)
 */
export async function deleteTransaction(id: string): Promise<void> {
  const transaction = await db.transactions.get(id)
  if (!transaction) throw new Error('Transaction not found')

  await db.transactions.put({ ...transaction, deleted: true, updatedAt: new Date() })
}

/**
 * Get transactions with filters
 */
export async function getTransactions(
  filters?: TransactionFilters,
): Promise<Transaction[]> {
  const transactions = await db.transactions.toArray()

  return transactions.filter((t) => {
    if (t.deleted) return false
    if (filters?.owner && t.owner !== filters.owner) return false
    if (filters?.walletId && t.walletId !== filters.walletId) return false
    if (filters?.categoryId && t.categoryId !== filters.categoryId) return false
    if (filters?.type && t.type !== filters.type) return false
    if (filters?.dateFrom && t.date < filters.dateFrom) return false
    if (filters?.dateTo && t.date > filters.dateTo) return false
    if (filters?.minAmount && t.amount < filters.minAmount) return false
    if (filters?.maxAmount && t.amount > filters.maxAmount) return false
    if (
      filters?.searchText &&
      !t.note?.toLowerCase().includes(filters.searchText.toLowerCase())
    ) {
      return false
    }
    return true
  })
}

/**
 * Get recent transactions
 */
export async function getRecentTransactions(count: number = 5): Promise<Transaction[]> {
  const allTransactions = await db.transactions.toArray()
  const notDeleted = allTransactions.filter((t) => !t.deleted)
  return notDeleted.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, count)
}

/**
 * Get transactions for a specific owner and wallet
 */
export async function getOwnerWalletTransactions(
  owner: Owner,
  walletId: string,
): Promise<Transaction[]> {
  return getTransactions({ owner, walletId })
}

export default {
  validateTransaction,
  addTransaction,
  editTransaction,
  deleteTransaction,
  getTransactions,
  getRecentTransactions,
  getOwnerWalletTransactions,
}
