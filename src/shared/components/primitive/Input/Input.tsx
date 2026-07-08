// Primitive UI: Input
// Lineage: Primitive Layer
// Variants: default, error
// Sizes: sm, md, lg

import React from 'react'
import styles from './Input.module.css'

export type InputSize = 'sm' | 'md' | 'lg'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize
  hasError?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ size = 'md', hasError = false, className, ...props }, ref) => {
    const classNames = [
      styles.input,
      styles[size],
      hasError ? styles.error : '',
      className || '',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <input
        ref={ref}
        className={classNames}
        aria-invalid={hasError}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export default Input
