// Primitive UI: Spinner
// Lineage: Primitive Layer
// Sizes: sm, md, lg
// Variants: default, inverse

import React from 'react'
import styles from './Spinner.module.css'

export type SpinnerSize = 'sm' | 'md' | 'lg'
export type SpinnerVariant = 'default' | 'inverse'

export interface SpinnerProps {
  size?: SpinnerSize
  variant?: SpinnerVariant
  className?: string
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'default',
  className,
}) => {
  const classNames = [
    styles.spinner,
    styles[size],
    styles[variant],
    className || '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span
      className={classNames}
      role="status"
      aria-label="Loading"
    >
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </span>
  )
}

export default Spinner
