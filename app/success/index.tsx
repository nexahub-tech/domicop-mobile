import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, lightColors } from "@/contexts/ThemeContext";

export default function SuccessScreen() {
  const { colors, isDarkMode } = useTheme();
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <View style={styles.content}>
        <Text style={styles.text}>Success Screen</Text>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      color: colors.onSurface,
    },
  });
