// Primitive UI: IconButton
// Lineage: Primitive Layer
// Variants: primary, secondary, ghost
// Sizes: sm, md, lg

import React from 'react'
import styles from './IconButton.module.css'

export type IconButtonVariant = 'primary' | 'secondary' | 'ghost'
export type IconButtonSize = 'sm' | 'md' | 'lg'

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant
  size?: IconButtonSize
  label: string // Required for accessibility
}

const IconButton: React.FC<IconButtonProps> = ({
  variant = 'ghost',
  size = 'md',
  label,
  children,
  className,
  ...props
}) => {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    className || '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={classNames}
      aria-label={label}
      title={label}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}

export default IconButton
