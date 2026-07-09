// Backup Service - Export/import all data as JSON
// Reference: docs/01-product/02_USER_FLOW.md (UF-007, UF-008)

import { db } from '@db/schema'
import type { DBOwner, DBWallet, DBTransaction, DBCategory } from '@db/schema'

export interface BackupData {
  version: number
  exportedAt: string
  owners: DBOwner[]
  wallets: DBWallet[]
  transactions: DBTransaction[]
  categories: DBCategory[]
}

const BACKUP_VERSION = 1

/**
 * Export all data as a downloadable JSON backup
 */
export async function exportBackup(): Promise<BackupData> {
  const [owners, wallets, transactions, categories] = await Promise.all([
    db.owners.toArray(),
    db.wallets.toArray(),
    db.transactions.toArray(),
    db.categories.toArray(),
  ])

  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    owners,
    wallets,
    transactions,
    categories,
  }
}

/**
 * Download backup data as a .json file
 */
export function downloadBackup(data: BackupData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `kasflow-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Import backup data, replacing all existing data
 * Returns the parsed backup or null if invalid
 */
export async function importBackup(file: File): Promise<BackupData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string
        const parsed = JSON.parse(text)
        const data: BackupData = {
          version: parsed.version,
          exportedAt: parsed.exportedAt || '',
          owners: parsed.owners || [],
          wallets: parsed.wallets || [],
          transactions: parsed.transactions || [],
          categories: parsed.categories || [],
        }

        if (!data.version || !data.owners.length) {
          throw new Error('Invalid backup format')
        }

        resolve(data)
      } catch (err) {
        reject(new Error('File backup tidak valid'))
      }
    }
    reader.onerror = () => reject(new Error('Gagal membaca file'))
    reader.readAsText(file)
  })
}

/**
 * Restore backup data into IndexedDB
 * Clears each table individually to avoid zombie instance
 */
export async function restoreBackup(data: BackupData): Promise<void> {
  await db.transactions.clear()
  await db.wallets.clear()
  await db.categories.clear()
  await db.owners.clear()

  await db.owners.bulkPut(data.owners)
  await db.wallets.bulkPut(data.wallets)
  await db.transactions.bulkPut(data.transactions)
  await db.categories.bulkPut(data.categories)
}
