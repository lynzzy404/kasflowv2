// Business UI: BalanceCard
// Displays a financial balance with optional trend indicator
// Data comes entirely from props — no calculations

import React from 'react'
import Card from '@/shared/components/primitive/Card/Card'
import { formatCurrency } from '@/utils/formatting'
import styles from './BalanceCard.module.css'

export type BalanceVariant = 'positive' | 'negative' | 'neutral'
export type TrendDirection = 'up' | 'down' | 'flat'

export interface BalanceCardProps {
  title: string
  amount: number
  variant?: BalanceVariant
  subtitle?: string
  trend?: {
    direction: TrendDirection
    label: string
  }
  onClick?: () => void
  className?: string
}

const trendIcon: Record<TrendDirection, string> = {
  up: '↑',
  down: '↓',
  flat: '→',
}

const BalanceCard: React.FC<BalanceCardProps> = ({
  title,
  amount,
  variant = 'neutral',
  subtitle,
  trend,
  onClick,
  className,
}) => {
  return (
    <Card
      variant="elevated"
      onClick={onClick}
      className={`${styles.card} ${styles[variant]} ${className || ''}`}
    >
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        {trend && (
          <span className={`${styles.trend} ${styles[trend.direction]}`}>
            <span aria-hidden="true">{trendIcon[trend.direction]}</span> {trend.label}
          </span>
        )}
      </div>

      <span className={styles.amount} aria-label={`${title}: ${formatCurrency(amount)}`}>
        {formatCurrency(amount)}
      </span>

      {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
    </Card>
  )
}

export default BalanceCard
