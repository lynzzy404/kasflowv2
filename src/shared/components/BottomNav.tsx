// Bottom Navigation - 4-item navigation bar
// Reference: docs/02-design/00_DESIGN_PRINCIPLES.md (One-Hand Friendly)

import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Home, History, Settings } from 'lucide-react'
import styles from './BottomNav.module.css'

interface NavItem {
  path: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { path: '/', label: 'Home', icon: <Home size={24} /> },
  { path: '/history', label: 'History', icon: <History size={24} /> },
  { path: '/settings', label: 'Settings', icon: <Settings size={24} /> },
]

const BottomNav: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className={styles.nav}>
      {navItems.map((item) => (
        <button
          key={item.path}
          className={`${styles.item} ${location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)) ? styles.active : ''}`}
          onClick={() => navigate(item.path)}
          aria-label={item.label}
          title={item.label}
        >
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default BottomNav
