// Composite UI: ListItem
// Lineage: Composite Layer
// Generic list row with leading, content, trailing slots

import React from 'react'
import styles from './ListItem.module.css'

export interface ListItemProps {
  leading?: React.ReactNode
  title: string
  subtitle?: string
  trailing?: React.ReactNode
  onClick?: () => void
  className?: string
}

const ListItem: React.FC<ListItemProps> = ({
  leading,
  title,
  subtitle,
  trailing,
  onClick,
  className,
}) => {
  const Tag = onClick ? 'button' : 'div'
  const type = onClick ? 'button' as const : undefined

  return (
    <Tag
      className={`${styles.item} ${onClick ? styles.clickable : ''} ${className || ''}`}
      onClick={onClick}
      type={type}
    >
      {leading && <div className={styles.leading}>{leading}</div>}
      <div className={styles.content}>
        <span className={styles.title}>{title}</span>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>
      {trailing && <div className={styles.trailing}>{trailing}</div>}
    </Tag>
  )
}

export default ListItem
