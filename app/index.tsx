import { useTheme } from "@/contexts/ThemeContext";
import { Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function Index() {
  const { isDarkMode } = useTheme();

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Redirect href="/(auth)/splash" />
    </>
  );
}
