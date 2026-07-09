// Settings Screen hook
// Wallet management, category management, backup/restore

import { useState, useCallback } from 'react'
import { useAppContext } from '@store/AppContext'
import { useTheme } from '@styles/ThemeContext'
import { db } from '@db/schema'
import { addWallet, editWallet, deleteWallet as deleteWalletSvc } from '@services/walletService'
import { addCategory, editCategory as editCategorySvc, deleteCategory as deleteCategorySvc } from '@services/categoryService'
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
  const [categoryModal, setCategoryModal] = useState<{
    open: boolean
    editId?: string
    name: string
  }>({ open: false, name: '' })
  const [showCategoryDeleteConfirm, setShowCategoryDeleteConfirm] = useState(false)

  const openAddCategory = useCallback(() => {
    setCategoryModal({ open: true, name: '' })
  }, [])

  const openEditCategory = useCallback((id: string, name: string) => {
    setCategoryModal({ open: true, editId: id, name })
  }, [])

  const closeCategoryModal = useCallback(() => {
    setCategoryModal({ open: false, editId: undefined, name: '' })
  }, [])

  const saveCategory = useCallback(async () => {
    const name = categoryModal.name.trim()
    if (!name) return

    try {
      if (categoryModal.editId) {
        const updated = await editCategorySvc(categoryModal.editId, { name })
        dispatch({ type: 'EDIT_CATEGORY', payload: updated })
      } else {
        const created = await addCategory(name)
        dispatch({ type: 'ADD_CATEGORY', payload: created })
      }
      closeCategoryModal()
    } catch (err) {
      console.error('[Settings] Save category failed:', err)
    }
  }, [categoryModal, dispatch, closeCategoryModal])

  const removeCategory = useCallback(async () => {
    if (!categoryModal.editId) return
    setShowCategoryDeleteConfirm(false)
    try {
      await deleteCategorySvc(categoryModal.editId)
      dispatch({ type: 'DELETE_CATEGORY', payload: categoryModal.editId })
      closeCategoryModal()
    } catch (err) {
      alert('Kategori tidak dapat dihapus karena masih memiliki transaksi')
    }
  }, [categoryModal.editId, dispatch, closeCategoryModal])

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
    openEditCategory,
    closeCategoryModal,
    saveCategory,
    removeCategory,
    showCategoryDeleteConfirm,
    setShowCategoryDeleteConfirm,
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
