// Database Schema using Dexie.js
// IndexedDB wrapper for offline-first storage
// Reference: docs/00-foundation/01_DOMAIN_MODEL.md
//
// VERSIONING RULES:
// - NEVER decrement database version (causes VersionError).
// - NEVER remove a version(N) call — version errors are fatal.
// - To change schema: add new this.version(N+1).stores({...})
//   with an upgrade() callback for any data migration needed.
//
// LIFECYCLE RULES:
// - NEVER call db.open() / db.close() / db.delete() externally.
//   Dexie uses lazy-open: the first operation auto-opens.
//   Forced open/close/delete creates zombie instances.

import Dexie, { Table } from 'dexie'
import type { Owner, Wallet, Transaction, Category } from '@/types/entities'

// ──── SCHEMA VERSION ──────────────────────────────────────────────
// Migration chain:
//   v1 — initial schema
//   v2 — added index for categoryId on transactions
//   v3 — fixed: v2's definition was modified in-place previously,
//        causing SchemaDiff warnings. v3 re-declares the correct
//        schema so Dexie reconciles the physical index.
const DB_NAME = 'kasflow_db'

// ──── TABLE TYPES ──────────────────────────────────────────────────

export interface DBOwner {
  id: Owner
  name: string
}

export interface DBWallet extends Wallet {}

export interface DBTransaction extends Transaction {
  createdAt: Date
  updatedAt: Date
}

export interface DBCategory extends Category {}

// ──── DB CLASS ─────────────────────────────────────────────────────

export class KasflowDB extends Dexie {
  owners!: Table<DBOwner>
  wallets!: Table<DBWallet>
  transactions!: Table<DBTransaction>
  categories!: Table<DBCategory>

  constructor() {
    super(DB_NAME)

    // ── Schema v1 ──────────────────────────────────────────────────
    // Original: transactions indexed by id, walletId, owner, date
    this.version(1).stores({
      owners: 'id',
      wallets: 'id',
      transactions: 'id, walletId, owner, date',
      categories: 'id',
    })

    // ── Schema v2 ──────────────────────────────────────────────────
    // ⚠️ DO NOT MODIFY — matches the schema deployed to users.
    // This version was originally released without categoryId.
    this.version(2).stores({
      owners: 'id',
      wallets: 'id',
      transactions: 'id, walletId, owner, date',
      categories: 'id',
    })

    // ── Schema v3 — add categoryId index to transactions ───────────
    // NEVER modify v1 or v2 stores definition. Always add a new version.
    this.version(3).stores({
      owners: 'id',
      wallets: 'id',
      transactions: 'id, walletId, owner, date, categoryId',
      categories: 'id',
    })
  }
}

// ──── SINGLETON ────────────────────────────────────────────────────
// Dexie lazy-opens: the instance auto-opens on first table access.
// No open()/close()/delete() should be called on this instance.
// VersionError at construction means the IndexedDB has a higher
// version than this code — clear it manually via DevTools.

export const db = new KasflowDB()

// ──── MODULE-LEVEL INIT GUARD ──────────────────────────────────────
// Prevents duplicate seeding under StrictMode double-mount in dev.

let _initPromise: Promise<void> | null = null

/**
 * Initialize database with seed data.
 * Idempotent — seeding only runs if owners table is empty.
 * Guarded by _initPromise to deduplicate concurrent calls.
 * Uses bulkPut (upsert) to prevent ConstraintError on retry.
 */
export async function initializeDatabase(): Promise<void> {
  if (_initPromise) {
    return _initPromise
  }

  _initPromise = (async () => {
    try {
      // Lazy-open is automatic — first table access triggers it.
      // If a VersionError occurs here it means the IndexedDB has a
      // HIGHER schema version. This should only happen if code was
      // reverted. Clear manually via DevTools > Application > IndexedDB.

      const ownerCount = await db.owners.count()
      if (ownerCount > 0) {
        console.log('[DB] Already initialized')
        return
      }

      console.log('[DB] Seeding initial data...')

      const now = new Date()

      // Seed owners (fixed: Me, Girlfriend)
      await db.owners.bulkPut([
        { id: 'Me', name: 'Me' },
        { id: 'Girlfriend', name: 'Girlfriend' },
      ])

      // Seed wallets (3 initial wallets)
      await db.wallets.bulkPut([
        { id: 'wallet_seabank', name: 'SeaBank', active: true, createdAt: now, updatedAt: now },
        { id: 'wallet_cash_me', name: 'Cash Me', active: true, createdAt: now, updatedAt: now },
        { id: 'wallet_cash_gf', name: 'Cash Girlfriend', active: true, createdAt: now, updatedAt: now },
      ])

      // Seed categories (6 initial categories)
      const initialCategories = ['Belanja', 'Makan', 'Bensin', 'Tagihan', 'Gaji', 'Kuota']
      await db.categories.bulkPut(
        initialCategories.map((name, index) => ({
          id: `category_${index + 1}`,
          name,
          createdAt: now,
          updatedAt: now,
        })),
      )

      console.log('[DB] Seeded successfully')
    } catch (error) {
      console.error('[DB] Initialization error:', error)
      _initPromise = null // Allow retry on next call
      throw error
    }
  })()

  return _initPromise
}

export default db
