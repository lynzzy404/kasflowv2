// Home Screen
// Composes: BalanceCard, WalletCard, TransactionItem, SectionHeader, Skeleton, EmptyState
// Reference: docs/01-product/03_SCREEN_SPEC.md

import React from 'react'
import { useNavigate } from 'react-router-dom'
import BalanceCard from '@/shared/components/business/BalanceCard/BalanceCard'
import WalletCard from '@/shared/components/business/WalletCard/WalletCard'
import TransactionItem from '@/shared/components/business/TransactionItem/TransactionItem'
import SectionHeader from '@/shared/components/composite/SectionHeader/SectionHeader'
import Skeleton from '@/shared/components/primitive/Skeleton/Skeleton'
import EmptyState from '@/shared/components/composite/EmptyState/EmptyState'
import { formatDateReadable } from '@/utils/formatting'
import { useHome } from './useHome'
import styles from './Home.module.css'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const {
    loading,
    error,
    myBalance,
    girlfriendBalance,
    totalBalance,
    walletsWithBalance,
    recentTransactions,
    isGirlfriendNegative,
    activeWalletCount,
    categoryMap,
    walletNameMap,
  } = useHome()

  // ── Loading state ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className={styles.screen}>
        <section className={styles.balanceSection} aria-label="Loading balances">
          <Skeleton variant="rect" height="90px" />
          <Skeleton variant="rect" height="90px" />
          <Skeleton variant="rect" height="90px" />
        </section>
        <section aria-label="Loading wallets">
          <Skeleton variant="rect" height="120px" />
        </section>
        <section aria-label="Loading transactions">
          <Skeleton variant="rect" height="60px" />
          <Skeleton variant="rect" height="60px" />
        </section>
      </div>
    )
  }

  // ── Error state ─────────────────────────────────────────────────
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

  // ── Normal state ────────────────────────────────────────────────
  return (
    <div className={styles.screen}>
      {/* ── Balance Cards ──────────────────────────────────────── */}
      <section className={styles.balanceSection} aria-label="Balances">
        <BalanceCard
          title="Saldo Pacar"
          amount={girlfriendBalance}
          variant={isGirlfriendNegative ? 'negative' : 'positive'}
          subtitle={isGirlfriendNegative ? 'Perlu Ditagih' : undefined}
        />

        <BalanceCard
          title="Saldo Saya"
          amount={myBalance}
          variant="neutral"
        />

        <BalanceCard
          title="Total Saldo"
          amount={totalBalance}
          variant="neutral"
          subtitle={`Dari ${activeWalletCount} Dompet Aktif`}
        />
      </section>

      {/* ── Wallet Section ─────────────────────────────────────── */}
      <section aria-label="Wallets">
        <SectionHeader title="Dompet" />
        <div className={styles.walletList}>
          {walletsWithBalance.map((wallet) => (
            <WalletCard
              key={wallet.id}
              name={wallet.name}
              ownerBalances={wallet.ownerBalances}
              totalBalance={wallet.totalBalance}
              onClick={() => navigate(`/history?wallet=${wallet.id}`)}
            />
          ))}
        </div>
      </section>

      {/* ── Recent Transactions ────────────────────────────────── */}
      <section aria-label="Recent transactions">
        <SectionHeader title="Transaksi Terbaru" />
        {recentTransactions.length === 0 ? (
          <EmptyState
            icon="📭"
            title="Belum ada transaksi"
            message="Tekan tombol + untuk mencatat transaksi pertama"
            actionLabel="Tambah Transaksi"
            onAction={() => navigate('/add')}
          />
        ) : (
          <div className={styles.transactionList}>
            {recentTransactions.map((txn) => {
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
        )}
      </section>
    </div>
  )
}

export default Home
