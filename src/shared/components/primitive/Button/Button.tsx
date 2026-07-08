// Primitive UI: Button
// Lineage: Primitive Layer
// Variants: primary, secondary, ghost, destructive
// Sizes: sm, md, lg

import React from 'react'
import Spinner from '@/shared/components/primitive/Spinner/Spinner'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  children,
  disabled,
  className,
  ...props
}) => {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    loading ? styles.loading : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={classNames}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <Spinner
          size="sm"
          variant={variant === 'primary' || variant === 'destructive' ? 'inverse' : 'default'}
          className={styles.spinner}
        />
      )}
      <span className={loading ? styles.labelHidden : styles.label}>{children}</span>
    </button>
  )
}

export default Button
