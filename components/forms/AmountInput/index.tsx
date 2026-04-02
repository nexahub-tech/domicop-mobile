import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useTheme, lightColors } from "@/contexts/ThemeContext";
import { theme } from "@/styles/theme";
import { typography } from "@/constants/typography";
import { loanConfig, formatCurrencyNoSign } from "@/data/mockData";

type AmountColors = typeof lightColors;

interface AmountInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChangeText,
  error,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Loan Amount</Text>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <Text style={styles.currencySymbol}>₦</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder="0.00"
          keyboardType="numeric"
          placeholderTextColor={colors.onSurfaceVariant}
        />
      </View>
      <View style={styles.limitsContainer}>
        <Text style={styles.limitText}>
          Min: ₦{formatCurrencyNoSign(loanConfig.minAmount)}
        </Text>
        <Text style={styles.limitText}>
          Max: ₦{formatCurrencyNoSign(loanConfig.maxAmount)}
        </Text>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const createStyles = (colors: AmountColors) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.lg,
    },
    label: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.sm,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurface,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: theme.spacing.sm,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: theme.borderRadius.xl,
      borderWidth: 2,
      borderColor: colors.outlineVariant,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.base,
    },
    inputError: {
      borderColor: colors.error,
    },
    currencySymbol: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size.xl,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurfaceVariant,
      marginRight: theme.spacing.sm,
    },
    input: {
      flex: 1,
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size.xl,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurface,
      padding: 0,
    },
    limitsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: theme.spacing.xs,
    },
    limitText: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.xs,
      color: colors.onSurfaceVariant,
    },
    errorText: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.xs,
      color: colors.error,
      marginTop: theme.spacing.xs,
    },
  });

export default AmountInput;
