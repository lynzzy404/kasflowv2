// Primitive UI: Switch
// Lineage: Primitive Layer

import React from 'react'
import styles from './Switch.module.css'

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, id, className, ...props }, ref) => {
    const inputId = id || `switch-${Math.random().toString(36).slice(2, 9)}`

    return (
      <label htmlFor={inputId} className={`${styles.label} ${className || ''}`}>
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          role="switch"
          className={styles.input}
          {...props}
        />
        <span className={styles.track} aria-hidden="true">
          <span className={styles.thumb} />
        </span>
        {label && <span className={styles.text}>{label}</span>}
      </label>
    )
  }
)

Switch.displayName = 'Switch'

export default Switch
