// Composite UI: EmptyState
// Lineage: Composite Layer (Primitive → Composite)
// Used when no data to display

import React from 'react'
import Button from '@/shared/components/primitive/Button/Button'
import styles from './EmptyState.module.css'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  message?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  message,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div className={`${styles.empty} ${className || ''}`}>
      <span className={styles.icon} aria-hidden="true">{icon}</span>
      <h3 className={styles.title}>{title}</h3>
      {message && <p className={styles.message}>{message}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction} className={styles.action}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
