// History Screen
// Transaction search, filter, browse
// Reference: docs/01-product/02_USER_FLOW.md, 01_INFORMATION_ARCHITECTURE.md

import React from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '@/shared/components/composite/SearchBar/SearchBar'
import TransactionItem from '@/shared/components/business/TransactionItem/TransactionItem'
import EmptyState from '@/shared/components/composite/EmptyState/EmptyState'
import Skeleton from '@/shared/components/primitive/Skeleton/Skeleton'
import { formatCurrency } from '@/utils/formatting'
import { formatDateReadable } from '@/utils/formatting'
import { useHistory } from './useHistory'
import styles from './History.module.css'

const History: React.FC = () => {
  const navigate = useNavigate()
  const {
    loading,
    error,
    searchText,
    setSearchText,
    handleClearSearch,
    quickFilters,
    handleFilterClick,
    handleClearFilters,
    hasActiveFilters,
    groupedTransactions,
    summary,
    categoryMap,
    walletNameMap,
  } = useHistory()

  // ── Loading ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className={styles.screen}>
        <div className={styles.searchArea}>
          <Skeleton variant="rect" height="44px" borderRadius="12px" />
        </div>
        <div className={styles.filterArea}>
          <Skeleton variant="rect" height="32px" width="70px" borderRadius="16px" />
          <Skeleton variant="rect" height="32px" width="70px" borderRadius="16px" />
          <Skeleton variant="rect" height="32px" width="90px" borderRadius="16px" />
        </div>
        <div className={styles.listArea}>
          <Skeleton variant="rect" height="60px" />
          <Skeleton variant="rect" height="60px" />
          <Skeleton variant="rect" height="60px" />
        </div>
      </div>
    )
  }

  // ── Error ───────────────────────────────────────────────────────
  if (error) {
    return (
      <div className={styles.screen}>
        <EmptyState
          icon="⚠️"
          title="Terjadi Kesalahan"
          message={error}
          actionLabel="Coba Lagi"
          onAction={() => window.location.reload()}
        />
      </div>
    )
  }

  return (
    <div className={styles.screen}>
      {/* ── Search ──────────────────────────────────────────────── */}
      <div className={styles.searchArea}>
        <SearchBar
          value={searchText}
          onChange={setSearchText}
          placeholder="Cari transaksi..."
          onClear={handleClearSearch}
        />
      </div>

      {/* ── Quick Filters ───────────────────────────────────────── */}
      <div className={styles.filterArea} role="group" aria-label="Quick filters">
        {quickFilters.map((f) => (
          <button
            key={`${f.type}-${f.id}`}
            className={`${styles.chip} ${f.active ? styles.chipActive : ''}`}
            onClick={() => handleFilterClick(f.type, f.id)}
            aria-pressed={f.active}
            type="button"
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Summary ─────────────────────────────────────────────── */}
      {summary.count > 0 && (
        <div className={styles.summary} aria-label="Transaction summary">
          <span className={styles.summaryCount}>
            {summary.count} transaksi
          </span>
          <span className={styles.summaryNet}>
            {summary.net >= 0 ? '+' : ''}{formatCurrency(summary.net)}
          </span>
        </div>
      )}

      {/* ── Clear filters ──────────────────────────────────────── */}
      {hasActiveFilters && (
        <button
          className={styles.clearFilters}
          onClick={handleClearFilters}
          type="button"
        >
          Hapus semua filter
        </button>
      )}

      {/* ── Transaction List ────────────────────────────────────── */}
      <div className={styles.listArea}>
        {groupedTransactions.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="Tidak ada transaksi"
            message={hasActiveFilters ? 'Coba ubah filter pencarian' : 'Tekan + untuk mencatat transaksi pertama'}
            actionLabel="Tambah Transaksi"
            onAction={() => navigate('/add')}
          />
        ) : (
          groupedTransactions.map((group) => (
            <div key={group.label} className={styles.group}>
              <h2 className={styles.groupLabel}>{group.label}</h2>
              <div className={styles.transactionList}>
                {group.transactions.map((txn) => {
                  const categoryName = categoryMap.get(txn.categoryId) || 'Lainnya'
                  const walletName = walletNameMap.get(txn.walletId) || 'Unknown'
                  return (
                    <TransactionItem
                      key={txn.id}
                      amount={txn.amount}
                      type={txn.type}
                      date={formatDateReadable(new Date(txn.date))}
                      owner={txn.owner}
                      walletName={walletName}
                      categoryName={categoryName}
                      note={txn.note}
                      onClick={() => navigate(`/add?edit=${txn.id}`)}
                    />
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default History
