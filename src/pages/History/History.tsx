// History Screen
// Dual mode: Normal (header + count, no checkboxes) / Selection (checkboxes + bulk delete)
import React, { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '@/shared/components/composite/SearchBar/SearchBar'
import TransactionItem from '@/shared/components/business/TransactionItem/TransactionItem'
import EmptyState from '@/shared/components/composite/EmptyState/EmptyState'
import ConfirmDialog from '@/shared/components/composite/ConfirmDialog/ConfirmDialog'
import Skeleton from '@/shared/components/primitive/Skeleton/Skeleton'
import Checkbox from '@/shared/components/primitive/Checkbox/Checkbox'
import Button from '@/shared/components/primitive/Button/Button'
import { formatCurrency, formatDateReadable } from '@/utils/formatting'
import { useHistory } from './useHistory'
import styles from './History.module.css'

const SEARCH_HELPERS = ['Amount', 'Category', 'Wallet', 'Owner', 'Date', 'Note']

const History: React.FC = () => {
  const navigate = useNavigate()
  const pressTimer = useRef<ReturnType<typeof setTimeout>>()
  const {
    loading, error, searchText, setSearchText, handleClearSearch,
    ownerFilters, walletFilters, handleFilterClick,
    handleClearFilters, hasActiveFilters,
    groupedTransactions, summary, categoryMap, walletNameMap,
    isSelecting, selectedIds, toggleSelect, toggleSelectAll,
    allSelected, selectedCount,
    enterSelectionMode, exitSelectionMode,
    showBulkDeleteConfirm, setShowBulkDeleteConfirm, handleBulkDelete, deleting,
  } = useHistory()

  // Long-press for mobile selection mode
  const handlePointerDown = useCallback((id: string) => {
    pressTimer.current = setTimeout(() => enterSelectionMode(id), 500)
  }, [enterSelectionMode])

  const handlePointerUp = useCallback(() => {
    if (pressTimer.current) clearTimeout(pressTimer.current)
  }, [])

  const handleTxnNavigate = useCallback((txnId: string) => {
    if (!isSelecting) {
      navigate(`/add?edit=${txnId}`)
    }
  }, [isSelecting, navigate])

  const handleContextMenu = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault()
    if (!isSelecting) enterSelectionMode(id)
  }, [isSelecting, enterSelectionMode])

  if (loading) {
    return (
      <div className={styles.screen}>
        <Skeleton variant="rect" height="44px" borderRadius="12px" />
        <Skeleton variant="rect" height="32px" width="70px" borderRadius="16px" />
        <Skeleton variant="rect" height="60px" />
        <Skeleton variant="rect" height="60px" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.screen}>
        <EmptyState icon="⚠️" title="Terjadi Kesalahan" message={error}
          actionLabel="Coba Lagi" onAction={() => window.location.reload()} />
      </div>
    )
  }

  return (
    <div className={styles.screen}>
      {/* ── Header ──────────────────────────────────────────────── */}
      {isSelecting ? (
        <div className={styles.selectionHeader}>
          <button className={styles.cancelBtn} onClick={exitSelectionMode} type="button">
            Cancel
          </button>
          <span className={styles.selectionCount}>
            {selectedCount} Selected
          </span>
          <Checkbox
            checked={allSelected}
            onChange={toggleSelectAll}
            ref={undefined as never}
          />
        </div>
      ) : (
        <div className={styles.normalHeader}>
          <h1 className={styles.headerTitle}>
            History
            <span className={styles.headerCount}> ({summary.count})</span>
          </h1>
        </div>
      )}

      {/* Search + helpers (only in normal mode) */}
      {!isSelecting && (
        <div className={styles.searchArea}>
          <SearchBar value={searchText} onChange={setSearchText}
            placeholder="Cari transaksi..." onClear={handleClearSearch} />
          {!searchText && summary.count > 0 && (
            <div className={styles.searchHelpers} role="group" aria-label="Search tips">
              <span className={styles.helperLabel}>Cari berdasarkan:</span>
              <div className={styles.helperChips}>
                {SEARCH_HELPERS.map((h) => (
                  <span key={h} className={styles.helperChip} onClick={() => setSearchText(h.toLowerCase())}>
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters (always visible) */}
      <div className={styles.filterRow} role="group" aria-label="Owner filters">
        {ownerFilters.map((f) => (
          <button key={f.id}
            className={`${styles.chip} ${f.active ? styles.chipActive : ''}`}
            onClick={() => handleFilterClick('owner', f.id)}
            aria-pressed={f.active} type="button">
            {f.label}
          </button>
        ))}
      </div>
      <div className={styles.filterRow} role="group" aria-label="Wallet filters">
        {walletFilters.map((f) => (
          <button key={f.id}
            className={`${styles.chip} ${f.active ? styles.chipActive : ''}`}
            onClick={() => handleFilterClick('wallet', f.id)}
            aria-pressed={f.active} type="button">
            {f.label}
          </button>
        ))}
      </div>

      {/* Summary (normal mode only) */}
      {!isSelecting && summary.count > 0 && (
        <div className={styles.summary}>
          <span className={styles.summaryCount}>{summary.count} transaksi</span>
          <span className={summary.net >= 0 ? styles.summaryPos : styles.summaryNeg}>
            {summary.net >= 0 ? '+' : ''}{formatCurrency(summary.net)}
          </span>
        </div>
      )}

      {/* Bulk delete bar (selection mode only) */}
      {isSelecting && selectedCount > 0 && (
        <div className={styles.bulkBar}>
          <Button variant="destructive" size="sm" onClick={() => setShowBulkDeleteConfirm(true)}>
            Delete {selectedCount}
          </Button>
        </div>
      )}

      {/* Clear filters */}
      {hasActiveFilters && (
        <button className={styles.clearFilters} onClick={handleClearFilters} type="button">
          Hapus semua filter
        </button>
      )}

      {/* Transaction list */}
      <div className={styles.listArea}>
        {groupedTransactions.length === 0 ? (
          <EmptyState icon="🔍" title="Tidak ada transaksi"
            message={hasActiveFilters ? 'Coba ubah filter pencarian' : 'Tekan + untuk mencatat transaksi pertama'}
            actionLabel="Tambah Transaksi" onAction={() => navigate('/add')} />
        ) : (
          groupedTransactions.map((group) => (
            <div key={group.label} className={styles.group}>
              <h2 className={styles.groupLabel}>{group.label}</h2>
              <div className={styles.transactionList}>
                {group.transactions.map((txn) => {
                  const categoryName = categoryMap.get(txn.categoryId) || 'Lainnya'
                  const walletName = walletNameMap.get(txn.walletId) || 'Unknown'
                  return (
                    <div key={txn.id} className={styles.txnRow}
                      onContextMenu={(e) => handleContextMenu(e, txn.id)}
                      onPointerDown={() => !isSelecting && handlePointerDown(txn.id)}
                      onPointerUp={handlePointerUp}
                      onPointerLeave={handlePointerUp}
                      onClick={() => isSelecting ? toggleSelect(txn.id) : handleTxnNavigate(txn.id)}>
                      {isSelecting && (
                        <div className={styles.checkboxCol}>
                          <Checkbox checked={selectedIds.has(txn.id)} onChange={() => toggleSelect(txn.id)} />
                        </div>
                      )}
                      <div className={styles.txnCol}>
                        <TransactionItem
                          amount={txn.amount} type={txn.type}
                          date={formatDateReadable(new Date(txn.date))}
                          owner={txn.owner} walletName={walletName}
                          categoryName={categoryName} note={txn.note} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmDialog open={showBulkDeleteConfirm} onClose={() => setShowBulkDeleteConfirm(false)}
        onConfirm={handleBulkDelete} title="Hapus Transaksi"
        message={`Hapus ${selectedCount} transaksi terpilih?`}
        confirmLabel="Hapus" cancelLabel="Batal" variant="destructive" loading={deleting} />
    </div>
  )
}

export default History
