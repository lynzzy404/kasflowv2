// Composite UI: SearchBar
// Lineage: Composite Layer (Primitive → Composite)
// Built from: Input + IconButton

import React from 'react'
import styles from './SearchBar.module.css'

export interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onClear?: () => void
  className?: string
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  onClear,
  className,
}) => {
  return (
    <div className={`${styles.searchBar} ${className || ''}`}>
      <span className={styles.icon} aria-hidden="true">🔍</span>
      <input
        type="search"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      {value && onClear && (
        <button
          className={styles.clear}
          onClick={onClear}
          aria-label="Clear search"
          type="button"
        >
          ×
        </button>
      )}
    </div>
  )
}

export default SearchBar
