import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useTheme, lightColors } from "@/contexts/ThemeContext";
import { theme } from "@/styles/theme";
import { typography } from "@/constants/typography";
import { mockSavingsData, formatCurrencyNoSign } from "@/data/mockData";

const AnimatedView = Animated.createAnimatedComponent(View);

const createStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    card: {
      backgroundColor: colors.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing["2xl"],
      overflow: "hidden",
      position: "relative",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: `${colors.primaryFixed}20`,
      alignItems: "center",
      justifyContent: "center",
    },
    cooperativeText: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.xs,
      fontWeight: typography.fontWeight.semibold as any,
      color: colors.primaryFixed,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    title: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size["2xl"],
      fontWeight: typography.fontWeight.extrabold as any,
      color: colors.onPrimary,
      marginBottom: 4,
    },
    subtitle: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.sm,
      color: `${colors.onPrimary}90`,
    },
    watermarkContainer: {
      position: "absolute",
      bottom: -20,
      right: -20,
      zIndex: 0,
    },
    balanceCard: {
      backgroundColor: colors.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing["2xl"],
      marginTop: theme.spacing.base,
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
    dividendsSection: {
      alignItems: "flex-end",
    },
    dividendsValue: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.base,
      fontWeight: typography.fontWeight.semibold as any,
      color: colors.onPrimary,
    },
    progressBarContainer: {
      height: 6,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderRadius: 3,
      overflow: "hidden",
      marginTop: theme.spacing.sm,
    },
    progressBarBackground: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: colors.onPrimary,
      borderRadius: 3,
    },
  });

export const PortfolioCard: React.FC = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const progress = (mockSavingsData.totalSaved / mockSavingsData.monthlyGoal) * 100;

  return (
    <AnimatedView entering={FadeInUp.duration(400)} style={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="account-balance" size={24} color={colors.primary} />
          </View>
          <Text style={styles.cooperativeText}>DOMICOP Cooperative</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Savings Portfolio</Text>
        <Text style={styles.subtitle}>Secure Member Portal</Text>

        {/* Watermark */}
        <View style={styles.watermarkContainer}>
          <MaterialIcons
            name="account-balance-wallet"
            size={140}
            color="rgba(255, 255, 255, 0.1)"
          />
        </View>
      </View>

      {/* Balance Card */}
      <AnimatedView
        entering={FadeInUp.delay(100).duration(400)}
        style={styles.balanceCard}
      >
        {/* Abstract Pattern Overlay */}
        <View style={styles.patternOverlay} />

        <View style={styles.balanceContent}>
          <Text style={styles.balanceLabel}>Total Savings Portfolio</Text>

          <View style={styles.balanceRow}>
            <Text style={styles.balanceAmount}>
              ₦{formatCurrencyNoSign(mockSavingsData.totalSaved)}
            </Text>
            <View style={styles.growthBadge}>
              <Text style={styles.growthText}>+{mockSavingsData.growthPercentage}%</Text>
            </View>
          </View>

          {/* Progress Section */}
          <View style={styles.progressContainer}>
            <View style={styles.progressInfo}>
              <View>
                <Text style={styles.progressLabel}>Monthly Goal</Text>
                <Text style={styles.progressValue}>
                  ₦{formatCurrencyNoSign(mockSavingsData.monthlyGoal)}
                </Text>
              </View>
              <View style={styles.dividendsSection}>
                <Text style={styles.progressLabel}>Dividends Earned</Text>
                <Text style={styles.dividendsValue}>
                  ₦{formatCurrencyNoSign(mockSavingsData.dividendsEarned)}
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground} />
              <View
                style={[styles.progressBarFill, { width: `${Math.min(progress, 100)}%` }]}
              />
            </View>
          </View>
        </View>
      </AnimatedView>
    </AnimatedView>
  );
};

export default PortfolioCard;
