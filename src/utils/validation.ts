// Validation Utilities

/**
 * Check if value is a valid number
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value)
}

/**
 * Check if string is non-empty
 */
export function isNonEmpty(value: string): boolean {
  return typeof value === 'string' && value.trim().length > 0
}

/**
 * Check if date is valid
 */
export function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime())
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate positive amount
 */
export function isValidAmount(amount: unknown): amount is number {
  return isValidNumber(amount) && amount > 0
}

export default {
  isValidNumber,
  isNonEmpty,
  isValidDate,
  isValidEmail,
  isValidAmount,
}
