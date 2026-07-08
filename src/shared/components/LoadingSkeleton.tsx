// Loading Skeleton Infrastructure
// Provides a reusable skeleton wrapper for content loading states
// Do NOT create screen-specific skeletons here.

import React from 'react'
import styles from './LoadingSkeleton.module.css'

interface SkeletonProps {
  width?: string
  height?: string
  borderRadius?: string
  count?: number
  gap?: string
}

/**
 * Single skeleton block for content placeholders
 */
export const SkeletonBlock: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '16px',
  borderRadius = 'var(--radius-xs)',
  count = 1,
  gap = 'var(--spacing-2)',
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={styles.skeleton}
          style={{ width, height, borderRadius }}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

/**
 * Page loading skeleton (generic, minimal)
 * Per Speed First: show lightweight skeleton, not heavy spinner
 */
export const PageSkeleton: React.FC = () => (
  <div className={styles.page} aria-label="Loading content" role="status">
    <div className={styles.headerSkeleton} />
    <div className={styles.cardSkeleton} />
    <div className={styles.cardSkeleton} />
    <span className="sr-only">Loading...</span>
  </div>
)

/**
 * Card skeleton for balance/wallet cards
 */
export const CardSkeleton: React.FC = () => (
  <div className={styles.card} aria-hidden="true">
    <SkeletonBlock width="60%" height="14px" />
    <SkeletonBlock width="40%" height="24px" />
  </div>
)

export default SkeletonBlock
