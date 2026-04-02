import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

function RootLayoutContent() {
  const { isDarkMode } = useTheme();

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="(auth)"
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="(onboarding)"
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="settings" />
        <Stack.Screen name="transactions" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="support" />
        <Stack.Screen name="success" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}
