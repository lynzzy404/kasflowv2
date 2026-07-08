// Primitive UI: Card
// Lineage: Primitive Layer
// Variants: elevated, outlined, filled

import React from 'react'
import styles from './Card.module.css'

export type CardVariant = 'elevated' | 'outlined' | 'filled'

export interface CardProps {
  variant?: CardVariant
  padding?: boolean
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}

const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  padding = true,
  children,
  className,
  onClick,
}) => {
  const classNames = [
    styles.card,
    styles[variant],
    padding ? styles.padded : '',
    onClick ? styles.clickable : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ')

  const Tag = onClick ? 'button' : 'div'
  const type = onClick ? 'button' as const : undefined

  return (
    <Tag className={classNames} onClick={onClick} type={type}>
      {children}
    </Tag>
  )
}

export default Card
