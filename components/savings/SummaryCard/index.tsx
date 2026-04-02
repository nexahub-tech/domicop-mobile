import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme, lightColors } from "@/contexts/ThemeContext";
import { theme } from "@/styles/theme";
import { typography } from "@/constants/typography";
import {
  calculateContributionFee,
  calculateTotalCredited,
  formatCurrencyNoSign,
} from "@/data/mockData";

interface SummaryCardProps {
  amount: number;
}

const createStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: `${colors.outline}30`,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      gap: theme.spacing.base,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    label: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.xs,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.secondary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    value: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.sm,
      fontWeight: typography.fontWeight.semibold as any,
      color: colors.onSurface,
    },
    divider: {
      height: 1,
      backgroundColor: `${colors.outline}50`,
      borderStyle: "dashed",
    },
    totalLabel: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.sm,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurface,
    },
    totalValue: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size.lg,
      fontWeight: typography.fontWeight.extrabold as any,
      color: colors.primary,
    },
  });

export const SummaryCard: React.FC<SummaryCardProps> = ({ amount }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const fee = calculateContributionFee(amount);
  const totalCredited = calculateTotalCredited(amount);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Administrative Fee (0.5%)</Text>
        <Text style={styles.value}>₦{formatCurrencyNoSign(fee)}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total to be Credited</Text>
        <Text style={styles.totalValue}>₦{formatCurrencyNoSign(totalCredited)}</Text>
      </View>
    </View>
  );
};

export default SummaryCard;
