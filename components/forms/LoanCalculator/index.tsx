import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useTheme, lightColors } from "@/contexts/ThemeContext";
import { theme } from "@/styles/theme";
import { typography } from "@/constants/typography";
import { formatCurrencyNoSign } from "@/data/mockData";

type LoanCalculatorColors = typeof lightColors;

interface LoanCalculatorProps {
  monthlyPayment: number;
  totalRepayment: number;
  totalInterest: number;
  interestRate: number;
  onInterestRateChange: (rate: number) => void;
}

export const LoanCalculator: React.FC<LoanCalculatorProps> = ({
  monthlyPayment,
  totalRepayment,
  totalInterest,
  interestRate,
  onInterestRateChange,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {/* Interest Rate Input */}
      <View style={styles.rateContainer}>
        <Text style={styles.rateLabel}>Interest Rate (APR)</Text>
        <View style={styles.rateInputContainer}>
          <TextInput
            style={styles.rateInput}
            value={interestRate.toString()}
            onChangeText={(text) => {
              const rate = parseFloat(text) || 0;
              onInterestRateChange(Math.min(Math.max(rate, 1), 100));
            }}
            keyboardType="numeric"
            maxLength={5}
          />
          <Text style={styles.rateSuffix}>%</Text>
        </View>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Estimated Monthly Payment</Text>
          <Text style={styles.summaryValue}>₦{formatCurrencyNoSign(monthlyPayment)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Interest Rate</Text>
            <Text style={styles.detailValue}>{interestRate}% APR</Text>
          </View>
          <View style={[styles.detailItem, styles.detailItemRight]}>
            <Text style={styles.detailLabel}>Total Repayment</Text>
            <Text style={styles.detailValue}>
              ₦{formatCurrencyNoSign(totalRepayment)}
            </Text>
          </View>
        </View>

        <View style={styles.interestRow}>
          <Text style={styles.interestLabel}>Total Interest</Text>
          <Text style={styles.interestValue}>₦{formatCurrencyNoSign(totalInterest)}</Text>
        </View>
      </View>
    </View>
  );
};

const createStyles = (colors: LoanCalculatorColors) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.lg,
    },
    rateContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.base,
    },
    rateLabel: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.sm,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurface,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    rateInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
    },
    rateInput: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size.base,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurface,
      width: 50,
      textAlign: "right",
      padding: 0,
    },
    rateSuffix: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size.base,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurfaceVariant,
      marginLeft: 2,
    },
    summaryCard: {
      backgroundColor: colors.inverseSurface,
      borderRadius: theme.borderRadius["2xl"],
      padding: theme.spacing["2xl"],
    },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.base,
    },
    summaryLabel: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.sm,
      color: colors.inverseOnSurface,
    },
    summaryValue: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size["2xl"],
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onPrimary,
    },
    divider: {
      height: 1,
      backgroundColor: `${colors.inverseOnSurface}20`,
      marginBottom: theme.spacing.base,
    },
    detailsGrid: {
      flexDirection: "row",
      marginBottom: theme.spacing.base,
    },
    detailItem: {
      flex: 1,
    },
    detailItemRight: {
      alignItems: "flex-end",
    },
    detailLabel: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.xs - 2,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.inverseOnSurface,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    detailValue: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size.lg,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onPrimary,
    },
    interestRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: theme.spacing.base,
      borderTopWidth: 1,
      borderTopColor: `${colors.inverseOnSurface}20`,
    },
    interestLabel: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.sm,
      color: colors.inverseOnSurface,
    },
    interestValue: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size.base,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onPrimary,
    },
  });

export default LoanCalculator;
