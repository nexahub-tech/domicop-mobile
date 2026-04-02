// Typography - Blue Cobalt Archive Design System
export const typography = {
  // Font Families
  fontFamily: {
    headline: 'PlusJakartaSans',
    body: 'Inter',
    label: 'Inter',
  },

  // Font Weights
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Font Sizes
  size: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 36,
    '5xl': 40,
  },

  // Line Heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
  },

  // Letter Spacing
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 2,
  },

  // Predefined text styles matching the design system
  styles: {
    headline: {
      fontFamily: 'PlusJakartaSans',
      fontWeight: '700' as const,
    },
    headlineExtrabold: {
      fontFamily: 'PlusJakartaSans',
      fontWeight: '800' as const,
    },
    body: {
      fontFamily: 'Inter',
      fontWeight: '400' as const,
    },
    bodyMedium: {
      fontFamily: 'Inter',
      fontWeight: '500' as const,
    },
    label: {
      fontFamily: 'Inter',
      fontWeight: '600' as const,
    },
    labelBold: {
      fontFamily: 'Inter',
      fontWeight: '700' as const,
    },
  },
} as const;

export type Typography = typeof typography;
