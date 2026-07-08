// Composite UI: SectionHeader
// Lineage: Composite Layer
// Groups content with title + optional action

import React from 'react'
import styles from './SectionHeader.module.css'

export interface SectionHeaderProps {
  title: string
  subtitle?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div className={`${styles.header} ${className || ''}`}>
      <div className={styles.textGroup}>
        <h3 className={styles.title}>{title}</h3>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {actionLabel && onAction && (
        <button
          className={styles.action}
          onClick={onAction}
          type="button"
          aria-label={actionLabel}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default SectionHeader
