// Composite UI: FormField
// Lineage: Composite Layer (Primitive → Composite)
// Wraps a label + input + error message

import React from 'react'
import styles from './FormField.module.css'

export interface FormFieldProps {
  label?: string
  error?: string
  required?: boolean
  children?: React.ReactNode
  className?: string
  id?: string
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required,
  children,
  className,
  id,
}) => {
  const fieldId = id || `field-${label?.toLowerCase().replace(/\s+/g, '-') || Math.random().toString(36).slice(2, 9)}`
  const errorId = `${fieldId}-error`

  return (
    <div className={`${styles.field} ${className || ''}`}>
      {label && (
        <label htmlFor={fieldId} className={styles.label}>
          {label}
          {required && <span className={styles.required} aria-hidden="true"> *</span>}
        </label>
      )}
      <div className={styles.inputWrapper}>
        {React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement<{ id?: string; hasError?: boolean; 'aria-describedby'?: string }>, {
              id: fieldId,
              hasError: !!error,
              'aria-describedby': error ? errorId : undefined,
            })
          : children}
      </div>
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default FormField
