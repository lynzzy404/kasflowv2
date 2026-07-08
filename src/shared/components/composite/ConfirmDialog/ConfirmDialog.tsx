// Composite UI: ConfirmDialog
// Lineage: Composite Layer (Primitive → Composite)
// Built from: Modal + Button

import React from 'react'
import Modal from '@/shared/components/primitive/Modal/Modal'
import Button from '@/shared/components/primitive/Button/Button'
import styles from './ConfirmDialog.module.css'

export interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'primary' | 'destructive'
  loading?: boolean
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  loading = false,
}) => {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className={styles.message}>{message}</p>
      <div className={styles.actions}>
        <Button
          variant="secondary"
          size="md"
          onClick={onClose}
          disabled={loading}
          fullWidth
        >
          {cancelLabel}
        </Button>
        <Button
          variant={variant === 'destructive' ? 'destructive' : 'primary'}
          size="md"
          onClick={onConfirm}
          loading={loading}
          fullWidth
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
