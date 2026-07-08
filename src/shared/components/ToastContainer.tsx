// Toast Notification Container
// Renders toasts at the top of the viewport
// Do NOT trigger notifications here - only render them

import React from 'react'
import styles from './ToastContainer.module.css'

interface Toast {
  id: string
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
}

/**
 * Toast container - renders active toasts
 * Currently empty placeholder for Phase 5+ notification system
 */
const ToastContainer: React.FC = () => {
  const [toasts] = React.useState<Toast[]>([])

  if (toasts.length === 0) return null

  return (
    <div
      className={styles.container}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type || 'info']}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}

export default ToastContainer
