// Business UI: TransactionItem
// Displays a single transaction row
// Supports income/expense styling, click, owner badge, category

import React from 'react'
import Card from '@/shared/components/primitive/Card/Card'
import OwnerBadge from '@/shared/components/business/OwnerBadge/OwnerBadge'
import { formatCurrency } from '@/utils/formatting'
import type { Owner, TransactionType } from '@/types/entities'

import styles from './TransactionItem.module.css'

const CATEGORY_ICONS: Record<string, string> = {
  Makan: '🍔',
  Belanja: '🛒',
  Bensin: '⛽',
  Tagihan: '📄',
  Gaji: '💰',
  Kuota: '📡',
}

export function getCategoryIcon(categoryName: string): string {
  return CATEGORY_ICONS[categoryName] || '💳'
}

export interface TransactionItemProps {
  amount: number
  type: TransactionType
  date: string
  owner: Owner
  walletName: string
  categoryName: string
  categoryIcon?: string
  note?: string
  onClick?: () => void
  className?: string
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  amount,
  type,
  date,
  owner,
  walletName,
  categoryName,
  categoryIcon,
  note,
  onClick,
  className,
}) => {
  const resolvedIcon = categoryIcon || getCategoryIcon(categoryName)
  const isIncome = type === 'Income'

  return (
    <Card
      variant="outlined"
      onClick={onClick}
      className={`${styles.item} ${className || ''}`}
    >
      <div className={styles.iconCell}>
        <span className={styles.icon} aria-hidden="true">{resolvedIcon}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.topRow}>
          <span className={styles.category}>{categoryName}</span>
          <span className={`${styles.amount} ${isIncome ? styles.income : styles.expense}`}>
            {isIncome ? '+' : '-'}{formatCurrency(amount)}
          </span>
        </div>

        <div className={styles.bottomRow}>
          <OwnerBadge owner={owner} />
          <span className={styles.dot} aria-hidden="true">·</span>
          <span className={styles.wallet}>{walletName}</span>
          <span className={styles.dot} aria-hidden="true">·</span>
          <time className={styles.date}>{date}</time>
        </div>

        {note && <p className={styles.note}>{note}</p>}
      </div>
    </Card>
  )
}

export default TransactionItem
