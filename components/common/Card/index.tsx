import React from "react";
import { View, ViewStyle, StyleSheet } from "react-native";
import { useTheme, lightColors } from "@/contexts/ThemeContext";
import { theme } from "@/styles/theme";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "elevated" | "outlined" | "filled";
  padding?: "none" | "sm" | "md" | "lg";
}

const createStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    base: {
      borderRadius: theme.borderRadius["2xl"],
    },
  });

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = "elevated",
  padding = "md",
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case "elevated":
        return {
          backgroundColor: colors.surface,
          ...theme.shadows.md,
        };
      case "outlined":
        return {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.outlineVariant,
        };
      case "filled":
        return {
          backgroundColor: colors.surfaceContainer,
        };
      default:
        return {};
    }
  };

  const getPaddingStyles = (): ViewStyle => {
    switch (padding) {
      case "none":
        return { padding: 0 };
      case "sm":
        return { padding: theme.spacing.lg };
      case "lg":
        return { padding: theme.spacing["2xl"] };
      case "md":
      default:
        return { padding: theme.spacing.xl };
    }
  };

  return (
    <View style={[styles.base, getVariantStyles(), getPaddingStyles(), style]}>
      {children}
    </View>
  );
};
