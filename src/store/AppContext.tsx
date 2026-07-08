// Global App State Management using Context API
// Provides all app state and dispatch actions

import React, { createContext, useReducer, useContext, ReactNode } from 'react'
import type { AppState, Transaction, Wallet, Category } from '@/types/entities'
import { initializeDatabase } from '@db/schema'

/**
 * Action types for state updates
 */
export type AppAction =
  | { type: 'LOAD_INITIAL_DATA' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload?: string }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'EDIT_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_WALLET'; payload: Wallet }
  | { type: 'EDIT_WALLET'; payload: Wallet }
  | { type: 'DELETE_WALLET'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'EDIT_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }

/**
 * Initial state
 */
const initialState: AppState = {
  owners: [],
  wallets: [],
  transactions: [],
  categories: [],
  loading: true,
  error: undefined,
}

/**
 * Context type
 */
interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
}

/**
 * Create context
 */
const AppContext = createContext<AppContextType | undefined>(undefined)

/**
 * Reducer function
 */
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_INITIAL_DATA':
      return {
        ...state,
        loading: false,
        error: undefined,
      }

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      }

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      }

    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
      }

    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t,
        ),
      }

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      }

    case 'ADD_WALLET':
      return {
        ...state,
        wallets: [...state.wallets, action.payload],
      }

    case 'EDIT_WALLET':
      return {
        ...state,
        wallets: state.wallets.map((w) =>
          w.id === action.payload.id ? action.payload : w,
        ),
      }

    case 'DELETE_WALLET':
      return {
        ...state,
        wallets: state.wallets.filter((w) => w.id !== action.payload),
      }

    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload],
      }

    case 'EDIT_CATEGORY':
      return {
        ...state,
        categories: state.categories.map((c) =>
          c.id === action.payload.id ? action.payload : c,
        ),
      }

    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter((c) => c.id !== action.payload),
      }

    default:
      return state
  }
}

/**
 * Provider component
 */
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  React.useEffect(() => {
    // Initialize database and load data on mount
    const loadData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })

        // Initialize DB if needed
        await initializeDatabase()

        // Mark loading as complete
        dispatch({ type: 'LOAD_INITIAL_DATA' })
      } catch (error) {
        console.error('Error loading data:', error)
        dispatch({
          type: 'SET_ERROR',
          payload: 'Failed to load data',
        })
      }
    }

    loadData()
  }, [])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

/**
 * Hook to use app context
 */
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}

export default AppContext
