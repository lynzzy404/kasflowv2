// Application Constants

export const OWNERS = {
  ME: 'Me',
  GIRLFRIEND: 'Girlfriend',
} as const

export const TRANSACTION_TYPES = {
  EXPENSE: 'Expense',
  INCOME: 'Income',
} as const

export const DEFAULT_CATEGORIES = [
  'Belanja',
  'Makan',
  'Bensin',
  'Tagihan',
  'Gaji',
  'Kuota',
] as const

export const ROUTES = {
  HOME: '/',
  HISTORY: '/history',
  ADD: '/add',
  SETTINGS: '/settings',
} as const

export const APP_NAME = 'Kasflow'
export const APP_VERSION = '2.0.0'

export const PERFORMANCE_TARGETS = {
  BALANCE_CALC_MS: 100,
  ADD_TRANSACTION_MS: 5000,
  VIEW_BALANCE_MS: 3000,
  NAV_TRANSITION_MS: 200,
} as const

export const TOUCH_TARGET_MIN = 44 // pixels
