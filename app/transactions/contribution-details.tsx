import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { useTheme, lightColors } from "@/contexts/ThemeContext";
import { theme } from "@/styles/theme";
import { typography } from "@/constants/typography";
import { mockSavingsTransactions, formatCurrency } from "@/data/mockData";

export default function ContributionDetailsScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const styles = createStyles(colors);

  // Calculate totals
  const contributions = mockSavingsTransactions.filter((t) => t.amount > 0);
  const totalContributions = contributions.reduce((sum, t) => sum + t.amount, 0);
  const totalTransactions = contributions.length;

  const handleAddContribution = () => {
    router.push("/transactions/add-contribution");
  };

  const handleTransactionPress = (transactionId: string) => {
    router.push(`/transactions/contribution-details-info?id=${transactionId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Header */}
      <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.backButton} />
          <Text style={[styles.headerTitle, { color: colors.primary }]}>
            Savings Overview
          </Text>
          <View style={styles.backButton} />
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Overview Card */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(400)}
          style={styles.overviewCard}
        >
          {/* Watermark */}
          <View style={styles.watermarkContainer}>
            <MaterialIcons
              name="account-balance"
              size={140}
              color={`${colors.onPrimary}10`}
            />
          </View>

          {/* Icon */}
          <View style={styles.iconContainer}>
            <MaterialIcons name="savings" size={28} color={colors.onPrimary} />
          </View>

          {/* Title */}
          <Text style={styles.overviewTitle}>Total Contributions</Text>

          {/* Amount */}
          <Text style={styles.overviewAmount}>₦{formatCurrency(totalContributions)}</Text>

          {/* Status */}
          <View style={styles.statusBadge}>
            <MaterialIcons name="check-circle" size={14} color={colors.success} />
            <Text style={styles.statusText}>ACTIVE</Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalTransactions}</Text>
              <Text style={styles.statLabel}>Transactions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Monthly</Text>
              <Text style={styles.statLabel}>Contribution</Text>
            </View>
          </View>
        </Animated.View>

        {/* Add Contribution Button */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddContribution}
            activeOpacity={0.8}
          >
            <MaterialIcons name="add-circle" size={20} color={colors.onPrimary} />
            <Text style={styles.addButtonText}>Add Contribution</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Transaction History */}
        <Animated.View
          entering={FadeInUp.delay(300).duration(400)}
          style={styles.historySection}
        >
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionsList}>
            {contributions.slice(0, 5).map((transaction, index) => (
              <TouchableOpacity
                key={transaction.id}
                style={styles.transactionItem}
                onPress={() => handleTransactionPress(transaction.id)}
                activeOpacity={0.7}
              >
                <View style={styles.transactionLeft}>
                  <View
                    style={[
                      styles.transactionIcon,
                      { backgroundColor: `${colors.success}10` },
                    ]}
                  >
                    <MaterialIcons name="savings" size={20} color={colors.success} />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionTitle}>{transaction.title}</Text>
                    <Text style={styles.transactionDate}>{transaction.date}</Text>
                  </View>
                </View>
                <View style={styles.transactionRight}>
                  <Text style={[styles.transactionAmount, { color: colors.success }]}>
                    +₦{formatCurrency(transaction.amount)}
                  </Text>
                  <Text style={styles.transactionStatus}>
                    {transaction.status.toUpperCase()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.surface,
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    headerContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.base,
    },
    backButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
      minWidth: 44,
    },
    headerTitle: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size.lg,
      fontWeight: typography.fontWeight.bold as any,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: theme.spacing.lg,
    },
    overviewCard: {
      backgroundColor: colors.primary,
      borderRadius: theme.borderRadius["2xl"],
      padding: theme.spacing["2xl"],
      alignItems: "center",
      marginBottom: theme.spacing.lg,
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
    watermarkContainer: {
      position: "absolute",
      bottom: -20,
      right: -20,
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: `${colors.onPrimary}20`,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.base,
    },
    overviewTitle: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.sm,
      fontWeight: typography.fontWeight.medium as any,
      color: `${colors.onPrimary}90`,
      marginBottom: theme.spacing.xs,
    },
    overviewAmount: {
      fontFamily: typography.fontFamily.headline,
      fontSize: theme.spacing["3xl"],
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onPrimary,
      marginBottom: theme.spacing.base,
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: `${colors.onPrimary}20`,
      borderRadius: theme.borderRadius.full,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.base,
      gap: 4,
      marginBottom: theme.spacing.lg,
    },
    statusText: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.xs,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onPrimary,
    },
    statsGrid: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      paddingTop: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: `${colors.onPrimary}20`,
    },
    statItem: {
      flex: 1,
      alignItems: "center",
    },
    statValue: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size.xl,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onPrimary,
      marginBottom: 2,
    },
    statLabel: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.xs,
      color: `${colors.onPrimary}80`,
    },
    statDivider: {
      width: 1,
      height: 40,
      backgroundColor: `${colors.onPrimary}20`,
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: theme.spacing.lg,
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    addButtonText: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size.base,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onPrimary,
    },
    historySection: {
      marginBottom: theme.spacing.lg,
    },
    historyHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.base,
    },
    historyTitle: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size.lg,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurface,
    },
    viewAllText: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.sm,
      fontWeight: typography.fontWeight.semibold as any,
      color: colors.primary,
    },
    transactionsList: {
      backgroundColor: colors.surface,
      borderRadius: theme.borderRadius["2xl"],
      overflow: "hidden",
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    transactionItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
    },
    transactionLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    transactionIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.base,
    },
    transactionInfo: {
      flex: 1,
    },
    transactionTitle: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.base,
      fontWeight: typography.fontWeight.semibold as any,
      color: colors.onSurface,
      marginBottom: 2,
    },
    transactionDate: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.xs,
      color: colors.onSurfaceVariant,
    },
    transactionRight: {
      alignItems: "flex-end",
    },
    transactionAmount: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size.base,
      fontWeight: typography.fontWeight.bold as any,
      marginBottom: 2,
    },
    transactionStatus: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.xs - 2,
      fontWeight: typography.fontWeight.medium as any,
      color: colors.onSurfaceVariant,
    },
    bottomPadding: {
      height: 100,
    },
  });
