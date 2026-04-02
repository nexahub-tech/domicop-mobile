// Material Design 3 - Blue Cobalt Archive Color System
export const colors = {
  // Primary Colors
  primary: '#0b50da',
  onPrimary: '#ffffff',
  primaryContainer: '#0b50da',
  onPrimaryContainer: '#ffffff',
  primaryFixed: '#dce1ff',
  primaryFixedDim: '#b5c4ff',
  onPrimaryFixed: '#00164d',
  onPrimaryFixedVariant: '#003cad',

  // Secondary Colors
  secondary: '#475569',
  onSecondary: '#ffffff',
  secondaryContainer: '#f1f5f9',
  onSecondaryContainer: '#0f172a',
  secondaryFixed: '#e2e8f0',
  secondaryFixedDim: '#cbd5e1',
  onSecondaryFixed: '#0f172a',
  onSecondaryFixedVariant: '#334155',

  // Tertiary Colors
  tertiary: '#ea580c',
  onTertiary: '#ffffff',
  tertiaryContainer: '#ffedd5',
  onTertiaryContainer: '#9a3412',
  tertiaryFixed: '#ffdbd0',
  tertiaryFixedDim: '#ffb59e',
  onTertiaryFixed: '#3a0b00',
  onTertiaryFixedVariant: '#842500',

  // Error Colors
  error: '#ef4444',
  onError: '#ffffff',
  errorContainer: '#fee2e2',
  onErrorContainer: '#991b1b',

  // Surface Colors
  surface: '#ffffff',
  onSurface: '#0f172a',
  surfaceVariant: '#f1f5f9',
  onSurfaceVariant: '#475569',
  surfaceTint: '#0b50da',
  surfaceDim: '#f5f6f8',
  surfaceBright: '#ffffff',

  // Surface Container Colors
  surfaceContainer: '#f1f3f9',
  surfaceContainerLow: '#f8f9fc',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerHigh: '#e9edf6',
  surfaceContainerHighest: '#e2e7f3',

  // Background Colors
  background: '#f5f6f8',
  onBackground: '#0f172a',

  // Inverse Colors
  inverseSurface: '#1e293b',
  inverseOnSurface: '#f1f5f9',
  inversePrimary: '#b5c4ff',

  // Border/Outline Colors
  outline: '#cbd5e1',
  outlineVariant: '#e2e8f0',

  // Legacy aliases for backward compatibility
  text: '#0f172a',
  textSecondary: '#475569',
  border: '#cbd5e1',
  success: '#22c55e',
  warning: '#f59e0b',
} as const;

export type Colors = typeof colors;
