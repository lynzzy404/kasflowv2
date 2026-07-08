// Primitive UI: Textarea
// Lineage: Primitive Layer
// Sizes: sm, md, lg

import React from 'react'
import styles from './Textarea.module.css'

export type TextareaSize = 'sm' | 'md' | 'lg'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: TextareaSize
  hasError?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ size = 'md', hasError = false, className, ...props }, ref) => {
    const classNames = [
      styles.textarea,
      styles[size],
      hasError ? styles.error : '',
      className || '',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <textarea
        ref={ref}
        className={classNames}
        aria-invalid={hasError}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea
