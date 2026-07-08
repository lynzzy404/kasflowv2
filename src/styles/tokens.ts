// Design Tokens - Single source of truth for visual values
// Reference: docs/02-design/04_DESIGN_TOKENS.md
// Layer: Primitive → Semantic → Component → UI

export const tokens = {
  colors: {
    surface: {
      primary: '#FFFFFF',
      secondary: '#F5F5F5',
      tertiary: '#EBEBEB',
      hover: '#F9F9F9',
      active: '#E8E8E8',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
      tertiary: '#999999',
      disabled: '#CCCCCC',
      inverse: '#FFFFFF',
    },
    action: {
      primary: '#007AFF',
      secondary: '#E5E5EA',
      disabled: '#CCCCCC',
      hover: '#0051D5',
    },
    status: {
      success: '#34C759',
      warning: '#FF9500',
      error: '#FF3B30',
      info: '#00C7FF',
    },
    financial: {
      positive: '#34C759',
      negative: '#FF3B30',
      neutral: '#8E8E93',
    },
    border: {
      default: '#D1D1D6',
      light: '#E5E5EA',
      strong: '#999999',
    },
  },

  typography: {
    fontFamily: {
      base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"SF Mono", Monaco, "Cascadia Code", Courier, monospace',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '32px',
      '4xl': '40px',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: '1.2',
      normal: '1.5',
      relaxed: '1.75',
    },
  },

  spacing: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
  },

  radius: {
    none: '0px',
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },

  shadow: {
    none: 'none',
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    base: '0 2px 4px rgba(0, 0, 0, 0.1)',
    md: '0 4px 8px rgba(0, 0, 0, 0.15)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.2)',
    xl: '0 12px 24px rgba(0, 0, 0, 0.25)',
  },

  motion: {
    fast: '100ms',
    base: '150ms',
    slow: '200ms',
    verySlow: '300ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  breakpoints: {
    mobile: '375px',
    tablet: '768px',
    desktop: '1024px',
  },

  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1035,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
    toast: 1070,
  },

  // Layout constants
  layout: {
    touchTarget: '44px',
    navHeight: '60px',
    maxContentWidth: '600px',
  },
}

export type Tokens = typeof tokens
export type ThemeColor = keyof typeof tokens.colors

export default tokens
