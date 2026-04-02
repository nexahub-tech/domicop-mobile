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
import {
  mockRecentTransactions,
  Transaction,
  TransactionCategory,
  formatCurrency,
  getTransactionIcon,
  getTransactionIconColor,
  getTransactionBgColor,
} from "@/data/mockData";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface TransactionItemProps {
  transaction: Transaction;
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
  const scale = useSharedValue(1);
  const styles = createTransactionItemStyles(colors);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    // Navigate to transaction details if needed
    // router.push(`/transactions/${transaction.id}`);
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

  return (
    <AnimatedTouchable
      entering={FadeInUp.delay(400 + index * 50).duration(300)}
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
            <Text style={styles.transactionTitle}>{transaction.title}</Text>
            <Text style={styles.transactionDate}>
              {transaction.date} • {transaction.time}
            </Text>
          </View>
        </View>
        <View style={styles.rightSection}>
          <Text style={[styles.transactionAmount, { color: amountColor }]}>
            {formatCurrency(transaction.amount)}
          </Text>
          <Text style={styles.transactionStatus}>{transaction.status.toUpperCase()}</Text>
        </View>
      </View>
    </AnimatedTouchable>
  );
};

interface CategoryHeaderProps {
  category: TransactionCategory;
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
      router.push("/savings");
    } else {
      router.push("/loans");
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
  });

export const TransactionList: React.FC = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  // Group transactions by category
  const savingsTransactions = mockRecentTransactions.filter(
    (t) => t.category === "savings",
  );
  const loanTransactions = mockRecentTransactions.filter((t) => t.category === "loan");

  const handleViewArchive = () => {
    // Navigate to savings tab for full transaction history
    router.push("/(tabs)/savings");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Animated.Text entering={FadeIn.delay(300)} style={styles.sectionTitle}>
          Recent Transactions
        </Animated.Text>
        <TouchableOpacity onPress={handleViewArchive} style={styles.viewArchiveButton}>
          <Text style={styles.viewArchiveText}>VIEW ARCHIVE</Text>
          <MaterialIcons name="arrow-forward-ios" size={12} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Transaction List Container */}
      <View style={styles.listContainer}>
        {/* Savings Category Header */}
        <CategoryHeader category="savings" colors={colors} />

        {/* Savings Transactions */}
        {savingsTransactions.map((transaction, index) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            index={index}
            colors={colors}
          />
        ))}

        {/* Loan Category Header */}
        <CategoryHeader category="loan" colors={colors} />

        {/* Loan Transactions */}
        {loanTransactions.map((transaction, index) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            index={index + savingsTransactions.length}
            colors={colors}
          />
        ))}
      </View>
    </View>
  );
};

export default TransactionList;
