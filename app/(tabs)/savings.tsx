import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";
import { theme } from "@/styles/theme";
import { typography } from "@/constants/typography";
import { PortfolioCard } from "@/components/savings/PortfolioCard";
import {
  mockSavingsTransactions,
  Transaction,
  formatCurrency,
  getTransactionIcon,
  getTransactionIconColor,
  getTransactionBgColor,
} from "@/data/mockData";
import { useTheme, lightColors } from "@/contexts/ThemeContext";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface TransactionItemProps {
  transaction: Transaction;
  index: number;
  colors: typeof lightColors;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  index,
  colors,
}) => {
  const router = useRouter();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    router.push(`/savings/${transaction.id}`);
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
  const amountColor = transaction.amount > 0 ? colors.success : colors.onSurface;

  const dynamicStyles = createTransactionStyles(colors);

  return (
    <Animated.View entering={FadeInUp.delay(300 + index * 50).duration(300)}>
      <AnimatedTouchable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[dynamicStyles.transactionItem, animatedStyle]}
        activeOpacity={0.7}
      >
        <View style={dynamicStyles.leftSection}>
          <View style={[dynamicStyles.iconContainer, { backgroundColor: bgColor }]}>
            <MaterialIcons name={iconName as any} size={20} color={iconColor} />
          </View>
          <View style={dynamicStyles.textContainer}>
            <Text style={dynamicStyles.transactionTitle}>{transaction.title}</Text>
            <Text style={dynamicStyles.transactionDate}>
              {transaction.date} • {transaction.time}
            </Text>
          </View>
        </View>
        <View style={dynamicStyles.rightSection}>
          <Text style={[dynamicStyles.transactionAmount, { color: amountColor }]}>
            {formatCurrency(transaction.amount)}
          </Text>
          <Text style={dynamicStyles.transactionStatus}>
            {transaction.status.toUpperCase()}
          </Text>
        </View>
      </AnimatedTouchable>
    </Animated.View>
  );
};

export default function SavingsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);
  const { colors, isDarkMode } = useTheme();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleAddContribution = () => {
    router.push("/transactions/add-contribution");
  };

  const dynamicStyles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Header */}
      <Animated.View entering={FadeIn.duration(300)} style={dynamicStyles.header}>
        <View style={dynamicStyles.headerContent}>
          <View style={dynamicStyles.backButton} />
          <Text style={[dynamicStyles.headerTitle, { color: colors.primary }]}>
            Savings
          </Text>
          <View style={dynamicStyles.backButton} />
        </View>
      </Animated.View>

      {/* Scrollable Content */}
      <ScrollView
        style={dynamicStyles.scrollView}
        contentContainerStyle={dynamicStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Portfolio Card */}
        <PortfolioCard />

        {/* Add Contribution Button */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)}>
          <AnimatedTouchable
            onPress={handleAddContribution}
            style={dynamicStyles.addButton}
            activeOpacity={0.8}
          >
            <MaterialIcons name="add-circle" size={20} color={colors.onPrimary} />
            <Text style={dynamicStyles.addButtonText}>Add Contribution</Text>
          </AnimatedTouchable>
        </Animated.View>

        {/* Transaction History */}
        <View style={dynamicStyles.historySection}>
          <View style={dynamicStyles.historyHeader}>
            <Animated.Text
              entering={FadeIn.delay(250)}
              style={dynamicStyles.historyTitle}
            >
              Transaction History
            </Animated.Text>
            <TouchableOpacity style={dynamicStyles.filterButton}>
              <Text style={dynamicStyles.filterText}>Filter</Text>
              <MaterialIcons name="filter-list" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Transaction List */}
          <View style={dynamicStyles.transactionsList}>
            {mockSavingsTransactions.map((transaction, index) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                index={index}
                colors={colors}
              />
            ))}
          </View>

          {/* View All Button */}
          <TouchableOpacity style={dynamicStyles.viewAllButton}>
            <Text style={dynamicStyles.viewAllText}>View All Transactions</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom padding for tab bar */}
        <SafeAreaView edges={["bottom"]} style={dynamicStyles.bottomPadding} />
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
      paddingTop: theme.spacing.lg,
    },
    addButton: {
      backgroundColor: colors.primary,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.xl,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.sm,
      marginHorizontal: theme.spacing.lg,
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
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    historyHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.lg,
    },
    historyTitle: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size.lg,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurface,
    },
    filterButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    filterText: {
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
    viewAllButton: {
      paddingVertical: theme.spacing.lg,
      alignItems: "center",
    },
    viewAllText: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.sm,
      fontWeight: typography.fontWeight.medium as any,
      color: colors.onSurfaceVariant,
    },
    bottomPadding: {
      height: 100,
    },
  });

const createTransactionStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    transactionItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
    },
    leftSection: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
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
      fontSize: typography.size.xs,
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
