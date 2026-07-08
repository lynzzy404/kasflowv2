// Shared Hooks - Common utilities for components

import React, { useEffect, useRef } from 'react'

/**
 * useAsync - Handle async operations with loading/error states
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true,
): { status: 'idle' | 'pending' | 'success' | 'error'; value: T | null; error: Error | null } {
  const [status, setStatus] = React.useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [value, setValue] = React.useState<T | null>(null)
  const [error, setError] = React.useState<Error | null>(null)

  const execute = React.useCallback(async () => {
    setStatus('pending')
    setValue(null)
    setError(null)
    try {
      const response = await asyncFunction()
      setValue(response)
      setStatus('success')
      return response
    } catch (error) {
      setError(error instanceof Error ? error : new Error(String(error)))
      setStatus('error')
    }
  }, [asyncFunction])

  React.useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { status, value, error }
}

/**
 * usePrevious - Get previous value of a prop or state
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

/**
 * useLocalStorage - Store value in localStorage
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue] as const
}

/**
 * useDebounce - Debounce a value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

export default {
  useAsync,
  usePrevious,
  useLocalStorage,
  useDebounce,
}
