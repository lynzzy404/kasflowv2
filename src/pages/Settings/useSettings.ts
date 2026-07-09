// Settings Screen hook
// Wallet management, category management, backup/restore

import { useState, useCallback } from 'react'
import { useAppContext } from '@store/AppContext'
import { useTheme } from '@styles/ThemeContext'
import { db } from '@db/schema'
import { addWallet, editWallet, deleteWallet as deleteWalletSvc } from '@services/walletService'
import { addCategory, deleteCategory as deleteCategorySvc } from '@services/categoryService'
import {
  exportBackup,
  downloadBackup,
  importBackup,
  restoreBackup,
} from '@services/backupService'

export function useSettings() {
  const { state, dispatch } = useAppContext()
  const { mode, toggleTheme } = useTheme()

  // ── Wallet ──────────────────────────────────────────────────────
  const [walletModal, setWalletModal] = useState<{ open: boolean; editId?: string; name: string }>({
    open: false,
    name: '',
  })

  const openAddWallet = useCallback(() => {
    setWalletModal({ open: true, name: '' })
  }, [])

  const openEditWallet = useCallback((id: string, name: string) => {
    setWalletModal({ open: true, editId: id, name })
  }, [])

  const closeWalletModal = useCallback(() => {
    setWalletModal({ open: false, name: '' })
  }, [])

  const saveWallet = useCallback(async () => {
    const name = walletModal.name.trim()
    if (!name) return

    try {
      if (walletModal.editId) {
        const updated = await editWallet(walletModal.editId, { name })
        dispatch({ type: 'EDIT_WALLET', payload: updated })
      } else {
        const created = await addWallet(name)
        dispatch({ type: 'ADD_WALLET', payload: created })
      }
      closeWalletModal()
    } catch (err) {
      console.error('[Settings] Save wallet failed:', err)
    }
  }, [walletModal, dispatch, closeWalletModal])

  const deleteWalletById = useCallback(async (id: string) => {
    try {
      await deleteWalletSvc(id)
      dispatch({ type: 'DELETE_WALLET', payload: id })
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus dompet')
    }
  }, [dispatch])

  // ── Category ────────────────────────────────────────────────────
  const [categoryModal, setCategoryModal] = useState<{ open: boolean; name: string }>({
    open: false,
    name: '',
  })

  const openAddCategory = useCallback(() => {
    setCategoryModal({ open: true, name: '' })
  }, [])

  const closeCategoryModal = useCallback(() => {
    setCategoryModal({ open: false, name: '' })
  }, [])

  const saveCategory = useCallback(async () => {
    const name = categoryModal.name.trim()
    if (!name) return

    try {
      const created = await addCategory(name)
      dispatch({ type: 'ADD_CATEGORY', payload: created })
      closeCategoryModal()
    } catch (err) {
      console.error('[Settings] Save category failed:', err)
    }
  }, [categoryModal, dispatch, closeCategoryModal])

  const removeCategory = useCallback(async (id: string) => {
    try {
      await deleteCategorySvc(id)
      dispatch({ type: 'DELETE_CATEGORY', payload: id })
    } catch (err) {
      console.error('[Settings] Delete category failed:', err)
      alert('Kategori tidak dapat dihapus karena masih memiliki transaksi')
    }
  }, [dispatch])

  // ── Reset Data ───────────────────────────────────────────────────
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [resetting, setResetting] = useState(false)

  const handleReset = useCallback(async () => {
    setShowResetConfirm(false)
    setResetting(true)
    try {
      await db.transactions.clear()
      await db.wallets.clear()
      await db.categories.clear()
      await db.owners.clear()
      alert('Semua data berhasil dihapus. Halaman akan dimuat ulang.')
      window.location.reload()
    } catch (err) {
      alert('Gagal mereset data: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setResetting(false)
    }
  }, [])

  // ── Backup/Restore ──────────────────────────────────────────────
  const [backingUp, setBackingUp] = useState(false)

  const handleBackup = useCallback(async () => {
    setBackingUp(true)
    try {
      const data = await exportBackup()
      downloadBackup(data)
    } catch (err) {
      console.error('[Settings] Backup failed:', err)
    } finally {
      setBackingUp(false)
    }
  }, [])

  const handleRestore = useCallback(async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const data = await importBackup(file)
        await restoreBackup(data)
        const summary = [
          'Restore berhasil!',
          '',
          `• ${data.wallets.length} Dompet`,
          `• ${data.categories.length} Kategori`,
          `• ${data.transactions.length} Transaksi`,
          '',
          'Halaman akan dimuat ulang.',
        ].join('\n')
        alert(summary)
        window.location.reload()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Gagal mengembalikan data'
        alert(`Restore gagal: ${message}`)
      }
    }
    input.click()
  }, [])

  return {
    state,
    loading: state.loading,
    error: state.error,

    // Wallet management
    wallets: state.wallets,
    walletModal,
    openAddWallet,
    openEditWallet,
    closeWalletModal,
    saveWallet,
    deleteWalletById,
    setWalletName: (name: string) => setWalletModal((prev) => ({ ...prev, name })),

    // Category management
    categories: state.categories,
    categoryModal,
    openAddCategory,
    closeCategoryModal,
    saveCategory,
    removeCategory,
    setCategoryName: (name: string) => setCategoryModal((prev) => ({ ...prev, name })),

    // Backup
    backingUp,
    handleBackup,
    handleRestore,

    // Reset
    showResetConfirm,
    setShowResetConfirm,
    handleReset,
    resetting,

    // Theme
    themeMode: mode,
    toggleTheme,
  }
}
