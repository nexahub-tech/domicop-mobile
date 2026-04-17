import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useTheme, lightColors } from "@/contexts/ThemeContext";
import { theme } from "@/styles/theme";
import { typography } from "@/constants/typography";
import { dashboard } from "@/lib/api/dashboard.api";
import type { DashboardSummary } from "@/lib/types/dashboard";

const AnimatedView = Animated.createAnimatedComponent(View);

const formatCurrencyNoSign = (amount: number): string => {
  return amount.toLocaleString("en-NG");
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
  });
};

const createStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "column",
      gap: theme.spacing.base,
      paddingHorizontal: theme.spacing.base,
      marginTop: theme.spacing.base,
    },
    primaryCard: {
      backgroundColor: colors.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing["2xl"],
      minHeight: 140,
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
      overflow: "hidden",
    },
    cardContent: {
      flex: 1,
      justifyContent: "space-between",
    },
    textSection: {
      zIndex: 1,
    },
    primaryLabel: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.xs,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.primaryFixed,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: theme.spacing.xs,
    },
    primaryAmount: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size["3xl"],
      fontWeight: typography.fontWeight.extrabold as any,
      color: colors.onPrimary,
    },
    growthBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
      marginTop: theme.spacing.base,
    },
    growthContent: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
    },
    growthText: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.xs - 2,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onPrimary,
    },
    watermarkContainer: {
      position: "absolute",
      bottom: -24,
      right: -24,
      zIndex: 0,
    },
    secondaryCard: {
      backgroundColor: colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing["2xl"],
      minHeight: 140,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
      overflow: "hidden",
    },
    secondaryLabel: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.xs,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurfaceVariant,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: theme.spacing.xs,
    },
    secondaryAmount: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size["3xl"],
      fontWeight: typography.fontWeight.extrabold as any,
      color: colors.onSurface,
    },
    loanDetails: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: theme.spacing.base,
    },
    nextPaymentSection: {
      flex: 1,
    },
    nextPaymentLabel: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.xs - 2,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurfaceVariant,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 2,
    },
    nextPaymentValue: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.xs,
      fontWeight: typography.fontWeight.semibold as any,
      color: colors.primary,
    },
    progressBadge: {
      backgroundColor: `${colors.primary}10`,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
    },
    progressText: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.xs - 2,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.primary,
    },
    secondaryWatermarkContainer: {
      position: "absolute",
      bottom: -24,
      right: -24,
      zIndex: 0,
    },
    errorContainer: {
      backgroundColor: colors.errorContainer,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.base,
    },
    errorText: {
      flex: 1,
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.sm,
      color: colors.error,
    },
    retryButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: theme.spacing.base,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
    },
    retryButtonText: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.xs,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onPrimary,
    },
    noLoanContainer: {
      backgroundColor: `${colors.success}10`,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.base,
      marginTop: theme.spacing.base,
    },
    noLoanText: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.sm,
      color: colors.success,
      textAlign: "center",
    },
  });

interface StatusCardsProps {
  onRefresh?: () => void;
}

export const StatusCards: React.FC<StatusCardsProps> = ({ onRefresh }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await dashboard.getSummary();
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleRetry = () => {
    loadDashboard();
    if (onRefresh) onRefresh();
  };

  if (isLoading) {
    return (
      <AnimatedView entering={FadeInUp.delay(100).duration(400)} style={styles.container}>
        <View style={styles.primaryCard}>
          <View style={styles.cardContent}>
            <View style={styles.textSection}>
              <Text style={styles.primaryLabel}>Total Saved</Text>
              <Text style={styles.primaryAmount}>---</Text>
            </View>
          </View>
        </View>
        <View style={styles.secondaryCard}>
          <View style={styles.cardContent}>
            <View style={styles.textSection}>
              <Text style={styles.secondaryLabel}>Active Loan Balance</Text>
              <Text style={styles.secondaryAmount}>---</Text>
            </View>
          </View>
        </View>
      </AnimatedView>
    );
  }

  if (error) {
    return (
      <AnimatedView entering={FadeInUp.delay(100).duration(400)} style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={24} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </AnimatedView>
    );
  }

  if (!data) return null;

  return (
    <AnimatedView entering={FadeInUp.delay(100).duration(400)} style={styles.container}>
      {/* Total Saved Card - Primary */}
      <View style={styles.primaryCard}>
        <View style={styles.cardContent}>
          <View style={styles.textSection}>
            <Text style={styles.primaryLabel}>Total Saved</Text>
            <Text style={styles.primaryAmount}>
              ₦{formatCurrencyNoSign(data.total_savings)}
            </Text>
          </View>

          <View style={styles.growthBadge}>
            <View style={styles.growthContent}>
              <Text style={styles.growthText}>
                {data.paid_this_month ? "PAID THIS MONTH" : "NOT PAID THIS MONTH"}
              </Text>
            </View>
            <MaterialIcons name="trending-up" size={14} color={colors.onPrimary} />
          </View>
        </View>

        {/* Watermark Icon */}
        <View style={styles.watermarkContainer}>
          <MaterialIcons
            name="account-balance-wallet"
            size={100}
            color="rgba(255, 255, 255, 0.1)"
          />
        </View>
      </View>

      {/* Active Loan Card - Secondary */}
      <View style={styles.secondaryCard}>
        <View style={styles.cardContent}>
          <View style={styles.textSection}>
            <Text style={styles.secondaryLabel}>Active Loan Balance</Text>
            {data.active_loan ? (
              <Text style={styles.secondaryAmount}>
                ₦{formatCurrencyNoSign(data.active_loan.balance)}
              </Text>
            ) : (
              <Text style={styles.secondaryAmount}>₦0</Text>
            )}
          </View>

          {data.active_loan ? (
            <View style={styles.loanDetails}>
              <View style={styles.nextPaymentSection}>
                <Text style={styles.nextPaymentLabel}>Next Payment</Text>
                <Text style={styles.nextPaymentValue}>
                  {formatDate(data.active_loan.next_payment_date)} • ₦
                  {formatCurrencyNoSign(data.active_loan.next_payment_amount)}
                </Text>
              </View>

              <View style={styles.progressBadge}>
                <Text style={styles.progressText}>{data.active_loan.status}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.noLoanContainer}>
              <Text style={styles.noLoanText}>No active loans</Text>
            </View>
          )}
        </View>

        {/* Watermark Icon */}
        <View style={styles.secondaryWatermarkContainer}>
          <MaterialIcons name="payments" size={100} color={`${colors.primary}10`} />
        </View>
      </View>
    </AnimatedView>
  );
};

export default StatusCards;
