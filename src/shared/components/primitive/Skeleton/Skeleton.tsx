// Primitive UI: Skeleton
// Lineage: Primitive Layer
// Variants: text, circle, rect

import React from 'react'
import styles from './Skeleton.module.css'

export type SkeletonVariant = 'text' | 'circle' | 'rect'

export interface SkeletonProps {
  variant?: SkeletonVariant
  width?: string
  height?: string
  borderRadius?: string
  className?: string
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  borderRadius,
  className,
}) => {
  const style: React.CSSProperties = {}
  if (width) style.width = width
  if (height) style.height = height
  if (borderRadius) style.borderRadius = borderRadius

  if (variant === 'circle') {
    style.width = style.width || 'var(--touch-target)'
    style.height = style.height || style.width || 'var(--touch-target)'
    style.borderRadius = '50%'
  }

  const classNames = [
    styles.skeleton,
    styles[variant],
    className || '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={classNames}
      style={style}
      aria-hidden="true"
    />
  )
}

export default Skeleton
