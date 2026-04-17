import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useTheme, lightColors } from "@/contexts/ThemeContext";
import { theme } from "@/styles/theme";
import { typography } from "@/constants/typography";
import { formatCurrencyNoSign } from "@/data/mockData";

const AnimatedView = Animated.createAnimatedComponent(View);

interface PortfolioCardProps {
  totalSavings: number | null;
  paidThisMonth: boolean;
  currentMonth: string | null;
  isLoading?: boolean;
}

const createStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    balanceCard: {
      backgroundColor: colors.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing["2xl"],
      overflow: "hidden",
      position: "relative",
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
    patternOverlay: {
      position: "absolute",
      top: 0,
      right: 0,
      width: 200,
      height: 200,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderRadius: 100,
    },
    balanceContent: {
      zIndex: 1,
    },
    balanceLabel: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.sm,
      fontWeight: typography.fontWeight.medium as any,
      color: `${colors.onPrimary}90`,
      marginBottom: theme.spacing.sm,
    },
    balanceRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.base,
      marginBottom: theme.spacing.lg,
    },
    balanceAmount: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size["3xl"],
      fontWeight: typography.fontWeight.extrabold as any,
      color: colors.onPrimary,
    },
    growthBadge: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
    },
    growthText: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.xs,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onPrimary,
    },
    progressContainer: {
      marginTop: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: "rgba(255, 255, 255, 0.1)",
    },
    progressInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: theme.spacing.base,
    },
    progressLabel: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.xs - 2,
      fontWeight: typography.fontWeight.bold as any,
      color: `${colors.onPrimary}70`,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    progressValue: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.base,
      fontWeight: typography.fontWeight.semibold as any,
      color: colors.onPrimary,
    },
    monthSection: {
      alignItems: "flex-end",
    },
    monthValue: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.base,
      fontWeight: typography.fontWeight.semibold as any,
      color: colors.onPrimary,
    },
    skeletonAmount: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size["3xl"],
      fontWeight: typography.fontWeight.extrabold as any,
      color: `${colors.onPrimary}60`,
    },
  });

export const PortfolioCard: React.FC<PortfolioCardProps> = ({
  totalSavings,
  paidThisMonth,
  currentMonth,
  isLoading = false,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const displayTotal = totalSavings ?? 0;
  const displayMonth = currentMonth
    ? new Date(currentMonth + "-01").toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <AnimatedView entering={FadeInUp.duration(400)} style={styles.container}>
      <AnimatedView
        entering={FadeInUp.delay(100).duration(400)}
        style={styles.balanceCard}
      >
        <View style={styles.patternOverlay} />

        <View style={styles.balanceContent}>
          <Text style={styles.balanceLabel}>Total Savings Portfolio</Text>

          <View style={styles.balanceRow}>
            {isLoading && totalSavings === null ? (
              <Text style={styles.skeletonAmount}>---</Text>
            ) : (
              <Text style={styles.balanceAmount}>
                ₦{formatCurrencyNoSign(displayTotal)}
              </Text>
            )}
            <View style={styles.growthBadge}>
              <Text style={styles.growthText}>
                {paidThisMonth ? "PAID THIS MONTH" : "NOT PAID"}
              </Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressInfo}>
              <View>
                <Text style={styles.progressLabel}>Current Month</Text>
                <Text style={styles.progressValue}>{displayMonth}</Text>
              </View>
              <View style={styles.monthSection}>
                <Text style={styles.progressLabel}>Status</Text>
                <Text style={styles.monthValue}>
                  {paidThisMonth ? "Contribution Made" : "No Contribution Yet"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </AnimatedView>
    </AnimatedView>
  );
};

export default PortfolioCard;