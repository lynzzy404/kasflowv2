// Database Schema using Dexie.js
// IndexedDB wrapper for offline-first storage
// Reference: docs/00-foundation/01_DOMAIN_MODEL.md

import Dexie, { Table } from 'dexie'
import type { Owner, Wallet, Transaction, Category } from '@/types/entities'

export interface DBOwner {
  id: Owner
  name: string
}

export interface DBWallet extends Wallet {}

export interface DBTransaction extends Transaction {}

export interface DBCategory extends Category {}

/**
 * Kasflow Database
 * Single-user, offline-first IndexedDB
 */
export class KasflowDB extends Dexie {
  owners!: Table<DBOwner>
  wallets!: Table<DBWallet>
  transactions!: Table<DBTransaction>
  categories!: Table<DBCategory>

  constructor() {
    super('kasflow_db')
    this.version(1).stores({
      // Owners: key is owner ID
      owners: 'id',

      // Wallets: key is wallet ID
      wallets: 'id',

      // Transactions: primary key is id, indexed by walletId, owner, date for queries
      transactions: '++id, walletId, owner, date',

      // Categories: key is category ID
      categories: 'id',
    })
  }
}

/**
 * Single database instance
 */
export const db = new KasflowDB()

/**
 * Initialize database with seed data
 * Runs once on first load
 */
export async function initializeDatabase(): Promise<void> {
  try {
    // Check if already seeded
    const ownerCount = await db.owners.count()
    if (ownerCount > 0) {
      console.log('Database already initialized')
      return
    }

    // Seed owners
    await db.owners.bulkAdd([
      { id: 'Me', name: 'Me' },
      { id: 'Girlfriend', name: 'Girlfriend' },
    ])

    // Seed wallets
    await db.wallets.bulkAdd([
      {
        id: 'wallet_seabank',
        name: 'SeaBank',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'wallet_cash_me',
        name: 'Cash Me',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'wallet_cash_gf',
        name: 'Cash Girlfriend',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])

    // Seed categories (6 initial categories)
    const initialCategories = [
      'Belanja',
      'Makan',
      'Bensin',
      'Tagihan',
      'Gaji',
      'Kuota',
    ]

    await db.categories.bulkAdd(
      initialCategories.map((name, index) => ({
        id: `category_${index + 1}`,
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    )

    console.log('Database initialized with seed data')
  } catch (error) {
    console.error('Database initialization error:', error)
    throw error
  }
}

export default db
