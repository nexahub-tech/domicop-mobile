import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';

function SavingsLayoutContent() {
  const { colors, isDarkMode } = useTheme();

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen name="[id]" />
      </Stack>
    </>
  );
}

export default function SavingsLayout() {
  return (
    <SafeAreaProvider>
      <SavingsLayoutContent />
    </SafeAreaProvider>
  );
}
