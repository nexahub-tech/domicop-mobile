import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import * as SystemUI from 'expo-system-ui';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemePreference = 'light' | 'dark' | 'system';

// Light Mode Colors - Blue Cobalt Archive
export const lightColors = {
  // Background & Surface
  background: '#f5f6f8',
  surface: '#ffffff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f8f9fc',
  surfaceContainer: '#f1f3f9',
  surfaceContainerHigh: '#e9edf6',
  surfaceContainerHighest: '#e2e7f3',
  surfaceBright: '#ffffff',
  surfaceDim: '#f5f6f8',
  
  // Primary - Blue Cobalt
  primary: '#0b50da',
  primaryContainer: '#0b50da',
  onPrimary: '#ffffff',
  primaryFixed: '#dce1ff',
  primaryFixedDim: '#b5c4ff',
  onPrimaryFixed: '#00164d',
  onPrimaryFixedVariant: '#003cad',
  
  // Secondary
  secondary: '#475569',
  secondaryContainer: '#f1f5f9',
  onSecondary: '#ffffff',
  secondaryFixed: '#e2e8f0',
  secondaryFixedDim: '#cbd5e1',
  onSecondaryFixed: '#0f172a',
  onSecondaryFixedVariant: '#334155',
  
  // Tertiary - Orange
  tertiary: '#ea580c',
  tertiaryContainer: '#ffedd5',
  onTertiary: '#ffffff',
  tertiaryFixed: '#ffdbd0',
  tertiaryFixedDim: '#ffb59e',
  onTertiaryFixed: '#3a0b00',
  onTertiaryFixedVariant: '#842500',
  
  // Text
  onSurface: '#0f172a',
  onSurfaceVariant: '#475569',
  onBackground: '#0f172a',
  
  // Outline
  outline: '#cbd5e1',
  outlineVariant: '#e2e8f0',
  
  // Error
  error: '#ef4444',
  errorContainer: '#fee2e2',
  onError: '#ffffff',
  onErrorContainer: '#991b1b',

  // Success
  success: '#22c55e',
  successContainer: '#dcfce7',
  onSuccess: '#ffffff',
  onSuccessContainer: '#14532d',

  // Inverse
  inverseSurface: '#1e293b',
  inverseOnSurface: '#f1f5f9',
  inversePrimary: '#b5c4ff',

  // Glow & Effects
  cobaltGlow: 'rgba(11, 80, 218, 0.4)',
  ambientShadow: 'rgba(0, 0, 0, 0.1)',
};

// Dark Mode Colors - Nocturnal Cobalt (from DESIGN.md)
export const darkColors = {
  // Background & Surface - The Luminescent Archive
  background: '#0b1326',           // The void - absolute base
  surface: '#0b1326',              // Same as background
  surfaceContainerLowest: '#060e20', // Recessed content
  surfaceContainerLow: '#0f172a',    // Card body
  surfaceContainer: '#171f33',       // Standard cards
  surfaceContainerHigh: '#1e293b',   // Elevated overlays
  surfaceContainerHighest: '#31394d', // Bright overlays
  surfaceBright: '#31394d',
  surfaceDim: '#0b1326',
  
  // Primary - Cobalt Pulse
  primary: '#1e55be',              // Main accent
  primaryContainer: '#b2c5ff',     // For gradients
  onPrimary: '#ffffff',
  primaryFixed: '#dae2ff',
  primaryFixedDim: '#b2c5ff',
  onPrimaryFixed: '#001847',
  onPrimaryFixedVariant: '#0040a0',
  
  // Secondary
  secondary: '#4e5d87',
  secondaryContainer: '#becefd',
  onSecondary: '#ffffff',
  secondaryFixed: '#dae2ff',
  secondaryFixedDim: '#b6c5f5',
  onSecondaryFixed: '#071a3f',
  onSecondaryFixedVariant: '#36466d',
  
  // Tertiary - Warm accent
  tertiary: '#ffb694',
  tertiaryContainer: '#ffdbcc',
  onTertiary: '#ffffff',
  tertiaryFixed: '#ffdbcc',
  tertiaryFixedDim: '#ffb694',
  onTertiaryFixed: '#351000',
  onTertiaryFixedVariant: '#7a2f00',
  
  // Text - No pure white (prevents eye strain)
  onSurface: '#dae2fd',            // Main text (not pure white)
  onSurfaceVariant: '#c3c6d5',     // Secondary text
  onBackground: '#191b22',
  
  // Outline - Ghost borders
  outline: '#737784',
  outlineVariant: '#434653',       // At 15% opacity
  
  // Error
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  onError: '#ffffff',
  onErrorContainer: '#93000a',

  // Success
  success: '#4ade80',
  successContainer: '#14532d',
  onSuccess: '#0f172a',
  onSuccessContainer: '#dcfce7',

  // Inverse
  inverseSurface: '#2e3037',
  inverseOnSurface: '#f0f0f9',
  inversePrimary: '#b2c5ff',

  // Glow & Effects - Cobalt energy
  cobaltGlow: 'rgba(30, 85, 190, 0.4)',
  ambientShadow: 'rgba(0, 0, 0, 0.4)',
};

interface ThemeContextType {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  isDarkMode: boolean;
  colors: typeof lightColors;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  isDarkMode: false,
  colors: lightColors,
});

export const useTheme = () => useContext(ThemeContext);

const THEME_STORAGE_KEY = '@domicop_theme_preference';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemePreference>('light');
  const [isLoading, setIsLoading] = useState(true);
  const systemColorScheme = useColorScheme();

  // Determine if dark mode is active
  const isDarkMode = React.useMemo(() => {
    if (theme === 'system') {
      return systemColorScheme === 'dark';
    }
    return theme === 'dark';
  }, [theme, systemColorScheme]);

  // Get current colors based on mode
  const colors = React.useMemo(() => {
    return isDarkMode ? darkColors : lightColors;
  }, [isDarkMode]);

  // Load saved theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          setThemeState(savedTheme as ThemePreference);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTheme();
  }, []);

  // Apply theme to system UI
  useEffect(() => {
    const applySystemUI = async () => {
      try {
        // Set background color
        await SystemUI.setBackgroundColorAsync(colors.background);
      } catch (error) {
        console.error('Error applying system UI:', error);
      }
    };
    
    if (!isLoading) {
      applySystemUI();
    }
  }, [colors.background, isLoading]);

  // Save theme when changed
  const setTheme = async (newTheme: ThemePreference) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  if (isLoading) {
    return null; // Or return a loading spinner
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
