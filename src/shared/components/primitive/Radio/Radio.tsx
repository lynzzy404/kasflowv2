// Primitive UI: Radio
// Lineage: Primitive Layer

import React from 'react'
import styles from './Radio.module.css'

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, id, className, ...props }, ref) => {
    const inputId = id || `radio-${Math.random().toString(36).slice(2, 9)}`

    return (
      <label htmlFor={inputId} className={`${styles.label} ${className || ''}`}>
        <input
          ref={ref}
          id={inputId}
          type="radio"
          className={styles.input}
          {...props}
        />
        <span className={styles.radio} aria-hidden="true">
          <span className={styles.dot} />
        </span>
        {label && <span className={styles.text}>{label}</span>}
      </label>
    )
  }
)

Radio.displayName = 'Radio'

export default Radio
