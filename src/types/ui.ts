// UI Component Types

import { ReactNode } from 'react'

/**
 * Common component props
 */
export interface BaseComponentProps {
  className?: string
  children?: ReactNode
}

/**
 * Button component props
 */
export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
}

/**
 * Card component props
 */
export interface CardProps extends BaseComponentProps {
  variant?: 'elevated' | 'outlined' | 'filled'
  clickable?: boolean
  onClick?: () => void
}

/**
 * Input component props
 */
export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'number' | 'email' | 'date' | 'time' | 'tel'
  placeholder?: string
  value?: string | number
  onChange?: (value: string | number) => void
  disabled?: boolean
  error?: boolean
  errorMessage?: string
  label?: string
  required?: boolean
}

/**
 * Modal component props
 */
export interface ModalProps extends BaseComponentProps {
  open: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg'
  closeButton?: boolean
}

/**
 * Bottom Sheet component props
 */
export interface BottomSheetProps extends BaseComponentProps {
  open: boolean
  onClose: () => void
  title?: string
  showHandle?: boolean
}

/**
 * FAB (Floating Action Button) props
 */
export interface FABProps extends BaseComponentProps {
  onClick: () => void
  icon?: ReactNode
  label?: string
  variant?: 'primary' | 'secondary'
}

/**
 * Bottom Navigation Item
 */
export interface NavItem {
  id: string
  label: string
  icon: ReactNode
  path: string
  active?: boolean
}

/**
 * Loading Spinner props
 */
export interface SpinnerProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'minimal'
}

/**
 * Empty State props
 */
export interface EmptyStateProps extends BaseComponentProps {
  icon?: ReactNode
  title: string
  message?: string
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * Toast notification
 */
export interface Toast {
  id: string
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}
