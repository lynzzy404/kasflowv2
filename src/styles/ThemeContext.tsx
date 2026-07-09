// Theme Context - Light/Dark mode with localStorage persistence

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { lightTokens, darkTokens } from './tokens'

type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
  mode: ThemeMode
  tokens: typeof lightTokens
  toggleTheme: () => void
  setTheme: (mode: ThemeMode) => void
}

const STORAGE_KEY = 'kasflow-theme'

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function getInitialTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'dark' || stored === 'light') return stored
  } catch { /* localStorage unavailable */ }
  return 'light'
}

function applyThemeToDOM(mode: ThemeMode, tokens: typeof lightTokens): void {
  const root = document.documentElement
  const c = tokens.colors
  root.style.setProperty('--color-surface-primary', c.surface.primary)
  root.style.setProperty('--color-surface-secondary', c.surface.secondary)
  root.style.setProperty('--color-text-primary', c.text.primary)
  root.style.setProperty('--color-text-secondary', c.text.secondary)
  root.style.setProperty('--color-text-tertiary', c.text.tertiary)
  root.style.setProperty('--color-text-inverse', c.text.inverse)
  root.style.setProperty('--color-action-primary', c.action.primary)
  root.style.setProperty('--color-action-secondary', c.action.secondary)
  root.style.setProperty('--color-action-hover', c.action.hover)
  root.style.setProperty('--color-border-default', c.border.default)
  root.style.setProperty('--color-border-light', c.border.light)
  root.style.setProperty('--color-status-success', c.status.success)
  root.style.setProperty('--color-status-warning', c.status.warning)
  root.style.setProperty('--color-status-error', c.status.error)
  root.style.setProperty('--color-financial-positive', c.financial.positive)
  root.style.setProperty('--color-financial-negative', c.financial.negative)
  root.style.setProperty('--color-financial-neutral', c.financial.neutral)
  root.style.setProperty('--color-surface-tertiary', c.surface.tertiary)
  root.style.setProperty('--color-surface-hover', c.surface.hover)
  root.style.setProperty('--color-surface-active', c.surface.active)
  root.style.setProperty('--color-action-disabled', c.action.disabled)
  root.style.setProperty('--color-text-disabled', c.text.disabled)
  root.style.setProperty('--color-border-strong', c.border.strong)

  // Theme-color meta tag
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', c.surface.primary)

  root.setAttribute('data-theme', mode)
}

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(getInitialTheme)
  const tokens = mode === 'dark' ? darkTokens : lightTokens

  useEffect(() => {
    applyThemeToDOM(mode, tokens)
  }, [mode, tokens])

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      try { localStorage.setItem(STORAGE_KEY, next) } catch { /* ignore */ }
      return next
    })
  }, [])

  const setTheme = useCallback((m: ThemeMode) => {
    try { localStorage.setItem(STORAGE_KEY, m) } catch { /* ignore */ }
    setMode(m)
  }, [])

  return (
    <ThemeContext.Provider value={{ mode, tokens, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export default ThemeContext
