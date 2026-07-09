// History Screen hook
// Handles search, filter, summary, multi-select (selection mode), bulk delete

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '@store/AppContext'
import { deleteTransaction } from '@services/transactionService'
import type { Owner, Transaction } from '@/types/entities'

type ScreenMode = 'normal' | 'selection'

function getDateGroup(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Hari Ini'
  if (diffDays === 1) return 'Kemarin'
  if (diffDays <= 7) return 'Minggu Ini'
  if (diffDays <= 30) return 'Bulan Ini'
  return 'Sebelumnya'
}

export function useHistory() {
  const { state, dispatch } = useAppContext()
  const [searchParams] = useSearchParams()
  const walletFilter = searchParams.get('wallet')

  const [searchText, setSearchText] = useState('')
  const [ownerFilter, setOwnerFilter] = useState<Owner | null>(null)
  const [activeWalletId, setActiveWalletId] = useState<string | null>(walletFilter)
  const [mode, setMode] = useState<ScreenMode>('normal')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setActiveWalletId(walletFilter)
  }, [walletFilter])

  const categoryMap = useMemo(
    () => new Map(state.categories.map((c) => [c.id, c.name])),
    [state.categories],
  )
  const walletNameMap = useMemo(
    () => new Map(state.wallets.map((w) => [w.id, w.name])),
    [state.wallets],
  )
  const walletList = useMemo(
    () => state.wallets.filter((w) => w.active),
    [state.wallets],
  )

  const filteredTransactions = useMemo(() => {
    let list = state.transactions.filter((t) => !t.deleted)
    if (activeWalletId) list = list.filter((t) => t.walletId === activeWalletId)
    if (ownerFilter) list = list.filter((t) => t.owner === ownerFilter)
    if (searchText.trim()) {
      const q = searchText.toLowerCase()
      list = list.filter((t) => {
        if (t.note?.toLowerCase().includes(q)) return true
        const catName = categoryMap.get(t.categoryId)?.toLowerCase() || ''
        if (catName.includes(q)) return true
        const wName = walletNameMap.get(t.walletId)?.toLowerCase() || ''
        if (wName.includes(q)) return true
        if (t.owner.toLowerCase().includes(q)) return true
        if (String(t.amount).includes(q)) return true
        return false
      })
    }
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [state.transactions, activeWalletId, ownerFilter, searchText, categoryMap, walletNameMap])

  const summary = useMemo(() => {
    const totalIncome = filteredTransactions.filter((t) => t.type === 'Income').reduce((s, t) => s + t.amount, 0)
    const totalExpense = filteredTransactions.filter((t) => t.type === 'Expense').reduce((s, t) => s + t.amount, 0)
    return { count: filteredTransactions.length, totalIncome, totalExpense, net: totalIncome - totalExpense }
  }, [filteredTransactions])

  const groupedTransactions = useMemo(() => {
    const groups = new Map<string, Transaction[]>()
    for (const txn of filteredTransactions) {
      const label = getDateGroup(new Date(txn.date))
      const arr = groups.get(label) || []
      arr.push(txn)
      groups.set(label, arr)
    }
    const order = ['Hari Ini', 'Kemarin', 'Minggu Ini', 'Bulan Ini', 'Sebelumnya']
    return order.filter((key) => groups.has(key)).map((key) => ({ label: key, transactions: groups.get(key)! }))
  }, [filteredTransactions])

  const ownerFilters = useMemo(() => {
    return [
      { id: 'Me' as Owner, label: '👤 Gwehj', active: ownerFilter === 'Me' },
      { id: 'Girlfriend' as Owner, label: '❤️ Enaa', active: ownerFilter === 'Girlfriend' },
    ]
  }, [ownerFilter])

  const walletFilters = useMemo(() => {
    return walletList.map((w) => ({ id: w.id, label: w.name, active: activeWalletId === w.id }))
  }, [activeWalletId, walletList])

  const handleFilterClick = (type: 'owner' | 'wallet', id: string) => {
    if (type === 'owner') setOwnerFilter((prev) => (prev === id ? null : id as Owner))
    else setActiveWalletId((prev) => (prev === id ? null : id))
  }

  // ── Selection Mode ──────────────────────────────────────────────
  const isSelecting = mode === 'selection'
  const allIds = useMemo(() => filteredTransactions.map((t) => t.id), [filteredTransactions])

  const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.has(id))
  const someSelected = selectedIds.size > 0 && !allSelected && allIds.some((id) => selectedIds.has(id))

  const enterSelectionMode = useCallback((id: string) => {
    setMode('selection')
    setSelectedIds(new Set([id]))
  }, [])

  const exitSelectionMode = useCallback(() => {
    setMode('normal')
    setSelectedIds(new Set())
  }, [])

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (allIds.every((id) => prev.has(id))) return new Set()
      return new Set(allIds)
    })
  }, [allIds])

  const handleBulkDelete = useCallback(async () => {
    setShowBulkDeleteConfirm(false)
    setDeleting(true)
    try {
      for (const id of selectedIds) {
        await deleteTransaction(id)
        dispatch({ type: 'DELETE_TRANSACTION', payload: id })
      }
      exitSelectionMode()
    } catch (err) {
      console.error('[History] Bulk delete failed:', err)
    } finally {
      setDeleting(false)
    }
  }, [selectedIds, dispatch, exitSelectionMode])

  return {
    loading: state.loading,
    error: state.error,
    searchText,
    setSearchText: (v: string) => setSearchText(v),
    handleClearSearch: () => setSearchText(''),
    ownerFilters,
    walletFilters,
    handleFilterClick,
    handleClearFilters: () => { setSearchText(''); setOwnerFilter(null); setActiveWalletId(null) },
    hasActiveFilters: !!searchText || !!ownerFilter || !!activeWalletId,
    groupedTransactions,
    summary,
    categoryMap,
    walletNameMap,
    // Selection mode
    isSelecting,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    allSelected,
    someSelected,
    selectedCount: selectedIds.size,
    enterSelectionMode,
    exitSelectionMode,
    showBulkDeleteConfirm,
    setShowBulkDeleteConfirm,
    handleBulkDelete,
    deleting,
  }
}
