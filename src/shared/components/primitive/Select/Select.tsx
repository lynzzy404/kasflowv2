// Primitive UI: Select
// Lineage: Primitive Layer
// Sizes: sm, md, lg

import React from 'react'
import styles from './Select.module.css'

export type SelectSize = 'sm' | 'md' | 'lg'

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: SelectSize
  hasError?: boolean
  options: { value: string; label: string }[]
  placeholder?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ size = 'md', hasError = false, options, placeholder, className, ...props }, ref) => {
    const classNames = [
      styles.select,
      styles[size],
      hasError ? styles.error : '',
      className || '',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div className={styles.wrapper}>
        <select
          ref={ref}
          className={classNames}
          aria-invalid={hasError}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className={styles.arrow} aria-hidden="true">▼</span>
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
