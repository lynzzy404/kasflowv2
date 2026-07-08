// Primitive UI: Divider
// Lineage: Primitive Layer
// Variants: full, inset, middle

import React from 'react'
import styles from './Divider.module.css'

export type DividerVariant = 'full' | 'inset' | 'middle'

export interface DividerProps {
  variant?: DividerVariant
  className?: string
}

const Divider: React.FC<DividerProps> = ({ variant = 'full', className }) => {
  return (
    <hr
      className={`${styles.divider} ${styles[variant]} ${className || ''}`}
      role="separator"
      aria-orientation="horizontal"
    />
  )
}

export default Divider
