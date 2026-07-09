// History Screen hook
// Handles search, filter, and summary computation
// All logic here — zero business logic in JSX

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '@store/AppContext'
import type { Owner, Transaction } from '@/types/entities'

export interface HistoryFilters {
  searchText: string
  owner: Owner | null
  walletId: string | null
}

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
  const { state } = useAppContext()
  const [searchParams] = useSearchParams()
  const walletFilter = searchParams.get('wallet')

  const [searchText, setSearchText] = useState('')
  const [ownerFilter, setOwnerFilter] = useState<Owner | null>(null)
  const [activeWalletId, setActiveWalletId] = useState<string | null>(walletFilter)

  // Sync wallet filter from URL param (e.g. Home → Wallet tap)
  useEffect(() => {
    setActiveWalletId(walletFilter)
  }, [walletFilter])

  // Category & wallet name maps
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

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    let list = state.transactions.filter((t) => !t.deleted)

    // Apply wallet filter (from URL param or chip)
    if (activeWalletId) {
      list = list.filter((t) => t.walletId === activeWalletId)
    }

    // Apply owner filter
    if (ownerFilter) {
      list = list.filter((t) => t.owner === ownerFilter)
    }

    // Apply search text
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

    // Sort newest first
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [state.transactions, activeWalletId, ownerFilter, searchText, categoryMap, walletNameMap])

  // Summary of filtered results
  const summary = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter((t) => t.type === 'Income')
      .reduce((s, t) => s + t.amount, 0)
    const totalExpense = filteredTransactions
      .filter((t) => t.type === 'Expense')
      .reduce((s, t) => s + t.amount, 0)
    return {
      count: filteredTransactions.length,
      totalIncome,
      totalExpense,
      net: totalIncome - totalExpense,
    }
  }, [filteredTransactions])

  // Group by date
  const groupedTransactions = useMemo(() => {
    const groups = new Map<string, Transaction[]>()
    for (const txn of filteredTransactions) {
      const label = getDateGroup(new Date(txn.date))
      const arr = groups.get(label) || []
      arr.push(txn)
      groups.set(label, arr)
    }
    // Ordered groups
    const order = ['Hari Ini', 'Kemarin', 'Minggu Ini', 'Bulan Ini', 'Sebelumnya']
    return order
      .filter((key) => groups.has(key))
      .map((key) => ({ label: key, transactions: groups.get(key)! }))
  }, [filteredTransactions])

  // Quick filters (unique wallets for chips)
  const quickFilters = useMemo(() => {
    const filters: { type: 'owner' | 'wallet'; id: string; label: string; active: boolean }[] = []

    // Owner filters
    filters.push({
      type: 'owner',
      id: 'Me',
      label: '👤 Gwehj',
      active: ownerFilter === 'Me',
    })
    filters.push({
      type: 'owner',
      id: 'Girlfriend',
      label: '❤️ Enaa',
      active: ownerFilter === 'Girlfriend',
    })

    // Wallet filters
    for (const w of walletList) {
      filters.push({
        type: 'wallet',
        id: w.id,
        label: w.name,
        active: activeWalletId === w.id,
      })
    }

    return filters
  }, [ownerFilter, activeWalletId, walletList])

  const handleFilterClick = (type: 'owner' | 'wallet', id: string) => {
    if (type === 'owner') {
      setOwnerFilter((prev) => (prev === id ? null : id as Owner))
    } else {
      setActiveWalletId((prev) => (prev === id ? null : id))
    }
  }

  const handleClearSearch = () => {
    setSearchText('')
  }

  const handleClearFilters = () => {
    setSearchText('')
    setOwnerFilter(null)
    setActiveWalletId(null)
  }

  const hasActiveFilters = !!searchText || !!ownerFilter || !!activeWalletId

  return {
    loading: state.loading,
    error: state.error,

    // Search
    searchText,
    setSearchText: (v: string) => setSearchText(v),
    handleClearSearch,

    // Filters
    quickFilters,
    handleFilterClick,
    handleClearFilters,
    hasActiveFilters,

    // Data
    groupedTransactions,
    summary,

    // Maps
    categoryMap,
    walletNameMap,
  }
}
