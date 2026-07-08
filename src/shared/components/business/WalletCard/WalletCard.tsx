// Business UI: WalletCard
// Displays wallet name, owner balances, and total balance
// Data comes from props — no calculations

import React from 'react'
import Card from '@/shared/components/primitive/Card/Card'
import OwnerBadge from '@/shared/components/business/OwnerBadge/OwnerBadge'
import { formatCurrency } from '@/utils/formatting'
import type { Owner } from '@/types/entities'
import styles from './WalletCard.module.css'

export interface OwnerBalanceEntry {
  owner: Owner
  balance: number
}

export interface WalletCardProps {
  name: string
  ownerBalances: OwnerBalanceEntry[]
  totalBalance: number
  onClick?: () => void
  className?: string
}

const WalletCard: React.FC<WalletCardProps> = ({
  name,
  ownerBalances,
  totalBalance,
  onClick,
  className,
}) => {
  return (
    <Card
      variant="outlined"
      onClick={onClick}
      className={`${styles.card} ${className || ''}`}
    >
      <div className={styles.header}>
        <span className={styles.name}>{name}</span>
      </div>

      {ownerBalances.length > 0 && (
        <div className={styles.owners}>
          {ownerBalances.map((entry) => (
            <div key={entry.owner} className={styles.ownerRow}>
              <OwnerBadge owner={entry.owner} />
              <span
                className={`${styles.ownerBalance} ${entry.balance < 0 ? styles.negative : ''}`}
              >
                {formatCurrency(entry.balance)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Total</span>
        <span className={styles.totalBalance}>{formatCurrency(totalBalance)}</span>
      </div>
    </Card>
  )
}

export default WalletCard
