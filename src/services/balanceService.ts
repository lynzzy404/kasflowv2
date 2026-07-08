// Balance Service - CRITICAL
// Calculates all balances from transactions (never stores)
// Rule: Saldo Wallet = Σ(Owner Balance)
// Rule: Saldo Owner = Σ(Balance across wallets)
// Reference: docs/00-foundation/01_DOMAIN_MODEL.md

import { db } from '@db/schema'
import type { Owner } from '@/types/entities'

/**
 * Get balance for specific owner in specific wallet
 * Calculated from transactions: sum(amount) where owner & walletId match
 * Type determines sign: Expense = -, Income = +
 */
export async function getOwnerWalletBalance(
  owner: Owner,
  walletId: string,
): Promise<number> {
  const transactions = await db.transactions
    .where('owner')
    .equals(owner)
    .toArray()

  return transactions
    .filter((t) => t.walletId === walletId && !t.deleted)
    .reduce((sum, t) => {
      const amount = t.type === 'Expense' ? -t.amount : t.amount
      return sum + amount
    }, 0)
}

/**
 * Get total balance for owner across all wallets
 * Rule: Saldo Owner = Σ(Owner Balance across all wallets)
 */
export async function getOwnerTotalBalance(owner: Owner): Promise<number> {
  const wallets = await db.wallets.toArray()
  const activeWallets = wallets.filter((w) => w.active)

  let total = 0
  for (const wallet of activeWallets) {
    const balance = await getOwnerWalletBalance(owner, wallet.id)
    total += balance
  }

  return total
}

/**
 * Get total balance for wallet across all owners
 * Rule: Saldo Wallet = Σ(Owner Balance in that wallet)
 */
export async function getWalletTotalBalance(walletId: string): Promise<number> {
  const owners: Owner[] = ['Me', 'Girlfriend']

  let total = 0
  for (const owner of owners) {
    const balance = await getOwnerWalletBalance(owner, walletId)
    total += balance
  }

  return total
}

/**
 * Get total balance across all wallets for all owners
 */
export async function getTotalBalance(): Promise<number> {
  const wallets = await db.wallets.toArray()
  const activeWallets = wallets.filter((w) => w.active)

  let total = 0
  for (const wallet of activeWallets) {
    const balance = await getWalletTotalBalance(wallet.id)
    total += balance
  }

  return total
}

/**
 * Get all owner balances for a wallet
 */
export async function getWalletOwnerBalances(
  walletId: string,
): Promise<Record<Owner, number>> {
  const owners: Owner[] = ['Me', 'Girlfriend']
  const balances: Record<Owner, number> = {} as Record<Owner, number>

  for (const owner of owners) {
    balances[owner] = await getOwnerWalletBalance(owner, walletId)
  }

  return balances
}

/**
 * Format currency for display (IDR)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default {
  getOwnerWalletBalance,
  getOwnerTotalBalance,
  getWalletTotalBalance,
  getTotalBalance,
  getWalletOwnerBalances,
  formatCurrency,
}
