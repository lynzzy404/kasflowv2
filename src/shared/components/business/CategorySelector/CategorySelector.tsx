// Business UI: CategorySelector
// Wraps the Select primitive with category-specific data
// Supports loading, empty, selected states
// Data comes entirely from props

import React from 'react'
import Select from '@/shared/components/primitive/Select/Select'
import type { Category } from '@/types/entities'
import styles from './CategorySelector.module.css'

export interface CategorySelectorProps {
  categories: Category[]
  value?: string
  onChange?: (value: string) => void
  loading?: boolean
  placeholder?: string
  hasError?: boolean
  id?: string
  className?: string
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  value,
  onChange,
  loading = false,
  placeholder = 'Select category',
  hasError = false,
  id,
  className,
}) => {
  if (loading) {
    return (
      <div className={`${styles.state} ${className || ''}`}>
        <span className={styles.loading}>Loading categories...</span>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className={`${styles.state} ${className || ''}`}>
        <span className={styles.empty}>No categories available</span>
      </div>
    )
  }

  const options = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }))

  return (
    <Select
      id={id}
      options={options}
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      hasError={hasError}
      className={className}
    />
  )
}

export default CategorySelector
