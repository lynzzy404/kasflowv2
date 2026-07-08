// Wallet Service - Wallet management and operations

import { db } from '@db/schema'
import type { Wallet } from '@/types/entities'

/**
 * Get all active wallets
 */
export async function getActiveWallets(): Promise<Wallet[]> {
  const wallets = await db.wallets.toArray()
  return wallets.filter((w) => w.active)
}

/**
 * Get all wallets (including inactive)
 */
export async function getAllWallets(): Promise<Wallet[]> {
  return db.wallets.toArray()
}

/**
 * Get wallet by ID
 */
export async function getWallet(id: string): Promise<Wallet | undefined> {
  return db.wallets.get(id)
}

/**
 * Add new wallet
 */
export async function addWallet(name: string): Promise<Wallet> {
  const wallet: Wallet = {
    id: `wallet_${Date.now()}`,
    name,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await db.wallets.add(wallet)
  return wallet
}

/**
 * Edit wallet
 */
export async function editWallet(id: string, updates: Partial<Wallet>): Promise<Wallet> {
  const existing = await db.wallets.get(id)
  if (!existing) throw new Error('Wallet not found')

  const updated: Wallet = {
    ...existing,
    ...updates,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date(),
  }

  await db.wallets.update(id, updated)
  return updated
}

/**
 * Disable wallet (soft delete)
 */
export async function disableWallet(id: string): Promise<void> {
  await db.wallets.update(id, { active: false })
}

/**
 * Enable wallet
 */
export async function enableWallet(id: string): Promise<void> {
  await db.wallets.update(id, { active: true })
}

/**
 * Check if wallet has transactions
 */
export async function walletHasTransactions(walletId: string): Promise<boolean> {
  const count = await db.transactions.where('walletId').equals(walletId).count()
  return count > 0
}

export default {
  getActiveWallets,
  getAllWallets,
  getWallet,
  addWallet,
  editWallet,
  disableWallet,
  enableWallet,
  walletHasTransactions,
}
