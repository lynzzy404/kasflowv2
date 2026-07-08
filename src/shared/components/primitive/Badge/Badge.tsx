// Primitive UI: Badge
// Lineage: Primitive Layer
// Variants: default, success, warning, error, info

import React from 'react'
import styles from './Badge.module.css'

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info'

export interface BadgeProps {
  variant?: BadgeVariant
  children?: React.ReactNode
  className?: string
}

const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className }) => {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className || ''}`}>
      {children}
    </span>
  )
}

export default Badge
