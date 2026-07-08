// Theme Context - Light-only for v2 (per D-D010)
// Dark mode infrastructure ready for future expansion
// Reference: docs/00-foundation/02_DECISIONS.md D-D010

import React, { createContext, useContext, ReactNode } from 'react'
import { tokens } from './tokens'

type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
  mode: ThemeMode
  tokens: typeof tokens
  // Future: toggleTheme() for dark mode
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const mode: ThemeMode = 'light' // Locked to light for v2

  return (
    <ThemeContext.Provider value={{ mode, tokens }}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Hook to access theme values
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export default ThemeContext
