import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SymbolView } from "expo-symbols";
import { useTheme, lightColors } from "@/contexts/ThemeContext";
import { theme } from "@/styles/theme";

type SecurityBadgeColors = typeof lightColors;

interface SecurityBadgeProps {
  style?: any;
}

export const SecurityBadge: React.FC<SecurityBadgeProps> = ({ style }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={[styles.container, style]}>
      <SymbolView
        name="checkmark.shield"
        size={14}
        tintColor={colors.primary}
        style={styles.icon}
      />
      <Text style={styles.text}>Secured Vault</Text>
    </View>
  );
};

const createStyles = (colors: SecurityBadgeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.full,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      ...theme.shadows.sm,
    },
    icon: {
      marginRight: theme.spacing.sm,
    },
    text: {
      fontFamily: theme.typography.fontFamily.label,
      fontSize: theme.typography.size.xs,
      fontWeight: theme.typography.fontWeight.bold as any,
      color: colors.onSurface,
      textTransform: "uppercase",
      letterSpacing: theme.typography.letterSpacing.tight,
    },
  });
