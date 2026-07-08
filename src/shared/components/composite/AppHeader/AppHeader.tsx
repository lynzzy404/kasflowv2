// Composite UI: AppHeader
// Lineage: Composite Layer
// Top app bar with title + optional back/actions

import React from 'react'
import styles from './AppHeader.module.css'

export interface AppHeaderProps {
  title: string
  subtitle?: string
  onBack?: () => void
  rightAction?: React.ReactNode
  className?: string
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightAction,
  className,
}) => {
  return (
    <header className={`${styles.header} ${className || ''}`}>
      <div className={styles.left}>
        {onBack && (
          <button
            className={styles.back}
            onClick={onBack}
            aria-label="Back"
            type="button"
          >
            ←
          </button>
        )}
      </div>
      <div className={styles.center}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <div className={styles.right}>
        {rightAction}
      </div>
    </header>
  )
}

export default AppHeader
