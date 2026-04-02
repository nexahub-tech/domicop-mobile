import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useTheme, lightColors } from "@/contexts/ThemeContext";
import { theme } from "@/styles/theme";
import { typography } from "@/constants/typography";
import { getUnreadNotificationsCount } from "@/data/mockData";

type SummaryCardsColors = typeof lightColors;

interface SummaryCardsProps {
  unreadCount?: number;
  contributionGoal?: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  unreadCount = 3,
  contributionGoal = 85,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const actualUnreadCount = getUnreadNotificationsCount();

  return (
    <View style={styles.container}>
      {/* Unread Alerts Card */}
      <Animated.View
        entering={FadeInUp.delay(100).duration(400)}
        style={styles.unreadCard}
      >
        <View style={styles.unreadContent}>
          <Text style={styles.unreadLabel}>Unread Alerts</Text>
          <Text style={styles.unreadCount}>{actualUnreadCount} New</Text>
          <Text style={styles.unreadSubtitle}>
            Your cooperative status updated 15m ago.
          </Text>
        </View>
        <View style={styles.watermarkContainer}>
          <MaterialIcons
            name="notifications"
            size={100}
            color="rgba(255, 255, 255, 0.1)"
          />
        </View>
      </Animated.View>

      {/* Contribution Goal Card */}
      <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.goalCard}>
        <Text style={styles.goalLabel}>Contribution Goal</Text>
        <View style={styles.goalValueContainer}>
          <Text style={styles.goalValue}>{contributionGoal}%</Text>
          <Text style={styles.goalChange}>+12.4%</Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View style={[styles.progressFill, { width: `${contributionGoal}%` }]} />
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const createStyles = (colors: SummaryCardsColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      gap: theme.spacing.base,
      marginBottom: theme.spacing.lg,
    },
    unreadCard: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      overflow: "hidden",
      position: "relative",
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    unreadContent: {
      zIndex: 1,
    },
    unreadLabel: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.xs,
      fontWeight: typography.fontWeight.bold as any,
      color: `${colors.onPrimary}80`,
      textTransform: "uppercase",
      letterSpacing: 2,
      marginBottom: 4,
    },
    unreadCount: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size["2xl"],
      fontWeight: typography.fontWeight.extrabold as any,
      color: colors.onPrimary,
      marginBottom: 4,
    },
    unreadSubtitle: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.sm,
      color: `${colors.onPrimary}70`,
    },
    watermarkContainer: {
      position: "absolute",
      bottom: -16,
      right: -16,
      zIndex: 0,
    },
    goalCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      justifyContent: "space-between",
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    goalLabel: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.xs,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurfaceVariant,
      textTransform: "uppercase",
      letterSpacing: 2,
      marginBottom: 4,
    },
    goalValueContainer: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.sm,
    },
    goalValue: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size.xl,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurface,
    },
    goalChange: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.sm,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.primary,
      marginBottom: 2,
    },
    progressContainer: {
      marginTop: "auto",
    },
    progressBackground: {
      height: 6,
      backgroundColor: colors.surfaceContainer,
      borderRadius: 3,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: colors.primary,
      borderRadius: 3,
    },
  });

export default SummaryCards;
