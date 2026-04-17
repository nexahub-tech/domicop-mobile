import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";
import { useTheme, lightColors } from "@/contexts/ThemeContext";
import { theme } from "@/styles/theme";
import { typography } from "@/constants/typography";
import { formatCurrency } from "@/data/mockData";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export interface RecentTransaction {
  id: string;
  type: string;
  category: "savings" | "loan";
  title: string;
  amount: number;
  date: string;
  status: string;
}

const getTransactionIcon = (type: string): string => {
  switch (type) {
    case "contribution":
      return "trending-up";
    case "interest":
      return "stars";
    case "loan_repayment":
      return "keyboard-double-arrow-right";
    case "fee":
      return "history-edu";
    case "withdrawal":
      return "payments";
    default:
      return "receipt";
  }
};

const getTransactionIconColor = (type: string): string => {
  switch (type) {
    case "contribution":
    case "interest":
      return "#22c55e";
    case "loan_repayment":
    case "fee":
    case "withdrawal":
      return "#0f172a";
    default:
      return "#475569";
  }
};

const getTransactionBgColor = (type: string): string => {
  switch (type) {
    case "contribution":
    case "interest":
      return "#ecfdf5";
    case "loan_repayment":
    case "fee":
      return "#eff6ff";
    case "withdrawal":
      return "#f1f5f9";
    default:
      return "#f1f5f9";
  }
};

const getDefaultTitle = (type: string, date: string): string => {
  switch (type) {
    case "contribution":
      return "Monthly Contribution";
    case "interest":
      return "Interest Credited";
    case "loan_repayment":
      return "Loan Repayment";
    case "fee":
      return "Processing Fee";
    case "withdrawal":
      return "Withdrawal";
    default: {
      const d = new Date(date);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  }
};

const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

interface TransactionItemProps {
  transaction: RecentTransaction;
  index: number;
  colors: typeof lightColors;
}

const createTransactionItemStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    transactionItem: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
    },
    transactionContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    leftSection: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.base,
    },
    textContainer: {
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
      fontSize: typography.size.xs - 1,
      color: colors.onSurfaceVariant,
    },
    rightSection: {
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
  });

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  index,
  colors,
}) => {
  const router = useRouter();
  const scale = useSharedValue(1);
  const styles = createTransactionItemStyles(colors);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (transaction.category === "savings") {
      router.push(`/savings/${transaction.id}`);
    }
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const iconName = getTransactionIcon(transaction.type);
  const iconColor = getTransactionIconColor(transaction.type);
  const bgColor = getTransactionBgColor(transaction.type);
  const amountColor = transaction.amount > 0 ? "#22c55e" : colors.onSurface;
  const title = transaction.title || getDefaultTitle(transaction.type, transaction.date);

  return (
    <Animated.View entering={FadeInUp.delay(400 + index * 50).duration(300)}>
      <AnimatedTouchable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.transactionItem, animatedStyle]}
        activeOpacity={0.7}
      >
        <View style={styles.transactionContent}>
          <View style={styles.leftSection}>
            <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
              <MaterialIcons name={iconName as any} size={20} color={iconColor} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.transactionTitle}>{title}</Text>
              <Text style={styles.transactionDate}>
                {formatDate(transaction.date)}
              </Text>
            </View>
          </View>
          <View style={styles.rightSection}>
            <Text style={[styles.transactionAmount, { color: amountColor }]}>
              {formatCurrency(transaction.amount)}
            </Text>
            <Text style={styles.transactionStatus}>
              {transaction.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </AnimatedTouchable>
    </Animated.View>
  );
};

interface CategoryHeaderProps {
  category: "savings" | "loan";
  colors: typeof lightColors;
}

const createCategoryHeaderStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    categoryHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.surfaceContainerLow,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
    },
    categoryLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    categoryDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    categoryText: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.xs - 2,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurfaceVariant,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    seeAllButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
    },
    seeAllText: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.xs - 2,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.primary,
    },
  });

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ category, colors }) => {
  const router = useRouter();
  const isSavings = category === "savings";
  const styles = createCategoryHeaderStyles(colors);

  const handleSeeAll = () => {
    if (isSavings) {
      router.push("/(tabs)/savings");
    } else {
      router.push("/(tabs)/loans");
    }
  };

  return (
    <View style={styles.categoryHeader}>
      <View style={styles.categoryLeft}>
        <View
          style={[
            styles.categoryDot,
            { backgroundColor: isSavings ? "#22c55e" : colors.primary },
          ]}
        />
        <Text style={styles.categoryText}>
          {isSavings ? "Savings Activity" : "Loan Activity"}
        </Text>
      </View>
      <TouchableOpacity onPress={handleSeeAll} style={styles.seeAllButton}>
        <Text style={styles.seeAllText}>SEE ALL</Text>
        <MaterialIcons name="chevron-right" size={16} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

interface TransactionListProps {
  transactions: RecentTransaction[];
  isLoading?: boolean;
  isOffline?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const createStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    container: {
      marginTop: theme.spacing["2xl"],
      paddingHorizontal: theme.spacing.base,
      marginBottom: theme.spacing["4xl"],
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.lg,
      paddingHorizontal: theme.spacing.xs,
    },
    sectionTitle: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.sm,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurfaceVariant,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    viewArchiveButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    viewArchiveText: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.xs,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.primary,
    },
    listContainer: {
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
    offlineBanner: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.sm,
      backgroundColor: `${colors.primary}10`,
      marginHorizontal: theme.spacing.base,
      marginBottom: theme.spacing.base,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.base,
      borderRadius: theme.borderRadius.lg,
    },
    offlineText: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.xs,
      color: colors.onSurfaceVariant,
    },
    loadingContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing["3xl"],
    },
    loadingText: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.sm,
      color: colors.onSurfaceVariant,
      marginTop: theme.spacing.base,
    },
    errorContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing["3xl"],
      gap: theme.spacing.base,
    },
    errorText: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.base,
      color: colors.error,
      textAlign: "center",
      marginTop: theme.spacing.base,
    },
    retryButton: {
      backgroundColor: colors.primary,
      paddingVertical: theme.spacing.base,
      paddingHorizontal: theme.spacing.xl,
      borderRadius: theme.borderRadius.lg,
      marginTop: theme.spacing.base,
    },
    retryButtonText: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.base,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onPrimary,
    },
    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing["3xl"],
      paddingHorizontal: theme.spacing.lg,
    },
    emptyIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: `${colors.primary}08`,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.lg,
    },
    emptyTitle: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size.lg,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurface,
      marginBottom: theme.spacing.sm,
    },
    emptyText: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.base,
      color: colors.onSurfaceVariant,
      textAlign: "center",
      lineHeight: 22,
    },
    skeletonRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
    },
    skeletonCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surfaceContainer,
      marginRight: theme.spacing.base,
    },
    skeletonTextContainer: {
      flex: 1,
    },
    skeletonLine: {
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.surfaceContainer,
      marginBottom: 4,
    },
    skeletonLineShort: {
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.surfaceContainer,
      width: "60%",
    },
    skeletonRight: {
      alignItems: "flex-end",
    },
    skeletonAmount: {
      height: 14,
      borderRadius: 7,
      backgroundColor: colors.surfaceContainer,
      width: 80,
      marginBottom: 4,
    },
  });

const SkeletonRow = ({ colors }: { colors: typeof lightColors }) => {
  const styles = createStyles(colors);
  return (
    <View style={styles.skeletonRow}>
      <View style={styles.skeletonCircle} />
      <View style={styles.skeletonTextContainer}>
        <View style={[styles.skeletonLine, { width: "70%" }]} />
        <View style={styles.skeletonLineShort} />
      </View>
      <View style={styles.skeletonRight}>
        <View style={styles.skeletonAmount} />
      </View>
    </View>
  );
};

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  isLoading = false,
  isOffline = false,
  error = null,
  onRetry,
}) => {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const savingsTransactions = transactions.filter(
    (t) => t.category === "savings",
  );
  const loanTransactions = transactions.filter((t) => t.category === "loan");
  const hasTransactions = transactions.length > 0;

  const handleViewArchive = () => {
    router.push("/(tabs)/savings");
  };

  const handleRetry = () => {
    if (onRetry) onRetry();
  };

  return (
    <View style={styles.container}>
      {isOffline && !isLoading && (
        <View style={styles.offlineBanner}>
          <MaterialIcons name="cloud-off" size={16} color={colors.onSurfaceVariant} />
          <Text style={styles.offlineText}>Showing cached data — offline</Text>
        </View>
      )}

      <View style={styles.header}>
        <Animated.Text entering={FadeIn.delay(300)} style={styles.sectionTitle}>
          Recent Transactions
        </Animated.Text>
        {hasTransactions && (
          <TouchableOpacity onPress={handleViewArchive} style={styles.viewArchiveButton}>
            <Text style={styles.viewArchiveText}>VIEW ARCHIVE</Text>
            <MaterialIcons name="arrow-forward-ios" size={12} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {isLoading && !hasTransactions && (
        <View style={styles.listContainer}>
          <CategoryHeader category="savings" colors={colors} />
          <SkeletonRow colors={colors} />
          <SkeletonRow colors={colors} />
          <CategoryHeader category="loan" colors={colors} />
          <SkeletonRow colors={colors} />
        </View>
      )}

      {error && !isLoading && !hasTransactions && (
        <View style={styles.listContainer}>
          <CategoryHeader category="savings" colors={colors} />
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={48} color={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
            {onRetry && (
              <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {!isLoading && !error && !hasTransactions && (
        <View style={styles.listContainer}>
          <CategoryHeader category="savings" colors={colors} />
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <MaterialIcons name="receipt-long" size={36} color={colors.outlineVariant} />
            </View>
            <Text style={styles.emptyTitle}>No Transactions Yet</Text>
            <Text style={styles.emptyText}>
              Your recent transactions will appear here once you start making contributions or loan payments.
            </Text>
          </View>
        </View>
      )}

      {hasTransactions && (
        <View style={styles.listContainer}>
          {savingsTransactions.length > 0 && (
            <>
              <CategoryHeader category="savings" colors={colors} />
              {savingsTransactions.map((transaction, index) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  index={index}
                  colors={colors}
                />
              ))}
            </>
          )}

          {loanTransactions.length > 0 && (
            <>
              <CategoryHeader category="loan" colors={colors} />
              {loanTransactions.map((transaction, index) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  index={index + savingsTransactions.length}
                  colors={colors}
                />
              ))}
            </>
          )}

          {savingsTransactions.length === 0 && loanTransactions.length === 0 && (
            <>
              <CategoryHeader category="savings" colors={colors} />
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                  <MaterialIcons name="receipt-long" size={36} color={colors.outlineVariant} />
                </View>
                <Text style={styles.emptyTitle}>No Transactions Yet</Text>
                <Text style={styles.emptyText}>
                  Your recent transactions will appear here.
                </Text>
              </View>
            </>
          )}
        </View>
      )}
    </View>
  );
};

export default TransactionList;