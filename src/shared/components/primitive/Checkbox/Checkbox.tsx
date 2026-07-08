// Primitive UI: Checkbox
// Lineage: Primitive Layer

import React from 'react'
import styles from './Checkbox.module.css'

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, id, className, ...props }, ref) => {
    const inputId = id || `checkbox-${Math.random().toString(36).slice(2, 9)}`

    return (
      <label htmlFor={inputId} className={`${styles.label} ${className || ''}`}>
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className={styles.input}
          {...props}
        />
        <span className={styles.checkmark} aria-hidden="true">
          <span className={styles.icon}>✓</span>
        </span>
        {label && <span className={styles.text}>{label}</span>}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
