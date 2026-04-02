import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';

function TransactionsLayoutContent() {
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
        <Stack.Screen name="make-payment" />
        <Stack.Screen name="contribution-details" />
        <Stack.Screen name="contribution-details-info" />
        <Stack.Screen name="apply-for-loan" />
        <Stack.Screen name="add-contribution" />
      </Stack>
    </>
  );
}

export default function TransactionsLayout() {
  return (
    <SafeAreaProvider>
      <TransactionsLayoutContent />
    </SafeAreaProvider>
  );
}
