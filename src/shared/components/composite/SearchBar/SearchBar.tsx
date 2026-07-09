// Composite UI: SearchBar
// Lineage: Composite Layer (Primitive → Composite)
// Built from: Input + IconButton

import React from 'react'
import { Search } from 'lucide-react'
import styles from './SearchBar.module.css'

export interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onClear?: () => void
  icon?: React.ReactNode
  className?: string
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  onClear,
  icon,
  className,
}) => {
  return (
    <div className={`${styles.searchBar} ${className || ''}`}>
      <span className={styles.icon} aria-hidden="true">{icon || <Search size={16} />}</span>
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
