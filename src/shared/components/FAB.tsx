// FAB (Floating Action Button) - Primary action button
// Always visible, bottom-right position
// Reference: docs/02-design/00_DESIGN_PRINCIPLES.md (Speed First)

import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './FAB.module.css'

const FAB: React.FC = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/add')
  }

  return (
    <button
      className={styles.fab}
      onClick={handleClick}
      aria-label="Add transaction"
      title="Add transaction"
    >
      <span className={styles.icon}>+</span>
    </button>
  )
}

export default FAB
