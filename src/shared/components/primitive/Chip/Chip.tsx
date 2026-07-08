// Primitive UI: Chip
// Lineage: Primitive Layer
// Variants: default, active
// Sizes: sm, md

import React from 'react'
import styles from './Chip.module.css'

export type ChipVariant = 'default' | 'active'
export type ChipSize = 'sm' | 'md'

export interface ChipProps {
  variant?: ChipVariant
  size?: ChipSize
  children?: React.ReactNode
  className?: string
  onClick?: () => void
  onDelete?: () => void
}

const Chip: React.FC<ChipProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className,
  onClick,
  onDelete,
}) => {
  const classNames = [
    styles.chip,
    styles[variant],
    styles[size],
    onClick ? styles.clickable : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ')

  const Tag = onClick ? 'button' : 'span'
  const type = onClick ? 'button' as const : undefined

  return (
    <Tag className={classNames} onClick={onClick} type={type}>
      <span className={styles.content}>{children}</span>
      {onDelete && (
        <button
          className={styles.delete}
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          aria-label="Remove"
          type="button"
        >
          ×
        </button>
      )}
    </Tag>
  )
}

export default Chip
