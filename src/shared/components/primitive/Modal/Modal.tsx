// Primitive UI: Modal
// Lineage: Primitive Layer
// Sizes: sm, md, lg, full

import React, { useEffect, useRef } from 'react'
import styles from './Modal.module.css'

export type ModalSize = 'sm' | 'md' | 'lg' | 'full'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  size?: ModalSize
  children?: React.ReactNode
  className?: string
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  size = 'md',
  children,
  className,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      contentRef.current?.focus()
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Dialog'}
    >
      <div
        ref={contentRef}
        className={`${styles.content} ${styles[size]} ${className || ''}`}
        tabIndex={-1}
      >
        <div className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          <button
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            ×
          </button>
        </div>
        <div className={styles.body}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
