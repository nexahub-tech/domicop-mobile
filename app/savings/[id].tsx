import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { useTheme } from "@/contexts/ThemeContext";
import type { lightColors } from "@/contexts/ThemeContext";
import { theme } from "@/styles/theme";
import { typography } from "@/constants/typography";
import { TransactionDetailCard } from "@/components/savings/TransactionDetailCard";
import { formatCurrency, formatCurrencyNoSign } from "@/data/mockData";
import { contributionsApi } from "@/lib/api/contributions.api";
import { Contribution } from "@/lib/types/contributions";
import { downloadReceipt, shareReceipt } from "@/utils/receiptGenerator";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const CACHE_KEY_PREFIX = "cached_contribution_";

const getStatusIcon = (status: string): string => {
  switch (status) {
    case "verified":
      return "check-circle";
    case "pending":
      return "schedule";
    case "rejected":
      return "cancel";
    default:
      return "info";
  }
};

const getStatusBadgeBg = (status: string): string => {
  switch (status) {
    case "verified":
      return "#dcfce7";
    case "pending":
      return "#fef3c7";
    case "rejected":
      return "#fee2e2";
    default:
      return "#f1f5f9";
  }
};

const getStatusBadgeColor = (status: string): string => {
  switch (status) {
    case "verified":
      return "#166534";
    case "pending":
      return "#92400e";
    case "rejected":
      return "#991b1b";
    default:
      return "#475569";
  }
};

export default function TransactionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, isDarkMode } = useTheme();
  const styles = createStyles(colors);
  const [contribution, setContribution] = useState<Contribution | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const fetchContribution = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);

    try {
      const cacheKey = `${CACHE_KEY_PREFIX}${id}`;
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        setContribution(JSON.parse(cached));
      }
    } catch {
      // ignore cache read errors
    }

    try {
      const data = await contributionsApi.getContribution(id);
      console.log("[fetchContribution] Fetched contribution:", data);
      setContribution(data);
      const cacheKey = `${CACHE_KEY_PREFIX}${id}`;
      await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (err: any) {
      if (!contribution) {
        setError(err?.message || "Failed to load contribution");
      }
    } finally {
      setIsLoading(false);
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchContribution();
  }, [fetchContribution]);

  const handleBack = () => {
    router.back();
  };

  const handleRetry = () => {
    fetchContribution();
  };

  if (isLoading && !contribution) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <MaterialIcons
                name="arrow-back"
                size={24}
                color={colors.onSurfaceVariant}
              />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.primary }]}>
              Transaction Details
            </Text>
            <View style={styles.backButton} />
          </View>
        </Animated.View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading transaction details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !contribution) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <MaterialIcons
                name="arrow-back"
                size={24}
                color={colors.onSurfaceVariant}
              />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.primary }]}>
              Transaction Details
            </Text>
            <View style={styles.backButton} />
          </View>
        </Animated.View>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!contribution) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <MaterialIcons
                name="arrow-back"
                size={24}
                color={colors.onSurfaceVariant}
              />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.primary }]}>
              Transaction Details
            </Text>
            <View style={styles.backButton} />
          </View>
        </Animated.View>
        <View style={styles.errorContainer}>
          <MaterialIcons name="search-off" size={48} color={colors.outlineVariant} />
          <Text style={styles.notFoundText}>Transaction not found</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleBack}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const amount = contribution.amount;
  const statusIcon = getStatusIcon(contribution.status);
  const statusBadgeBg = getStatusBadgeBg(contribution.status);
  const statusBadgeColor = getStatusBadgeColor(contribution.status);
  const formattedDate = new Date(contribution.created_at).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = new Date(contribution.created_at).toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedMonth = (() => {
    const [year, month] = contribution.month.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  })();

  const handleDownloadReceipt = async () => {
    try {
      setIsDownloading(true);
      const receiptData = {
        id: contribution.id,
        type: "contribution" as const,
        category: "savings" as const,
        title: formattedMonth,
        date: formattedDate,
        time: formattedTime,
        amount: contribution.amount,
        status:
          contribution.status === "verified"
            ? ("completed" as const)
            : (contribution.status as any),
      };
      await downloadReceipt(receiptData);
      setIsDownloading(false);
      Alert.alert("Receipt Downloaded", "Your receipt has been saved successfully.", [
        { text: "OK" },
      ]);
    } catch {
      setIsDownloading(false);
      Alert.alert("Error", "Failed to download receipt. Please try again.");
    }
  };

  const handleShareReceipt = async () => {
    try {
      setIsSharing(true);
      const receiptData = {
        id: contribution.id,
        type: "contribution" as const,
        category: "savings" as const,
        title: formattedMonth,
        date: formattedDate,
        time: formattedTime,
        amount: contribution.amount,
        status:
          contribution.status === "verified"
            ? ("completed" as const)
            : (contribution.status as any),
      };
      const receiptUri = await downloadReceipt(receiptData);
      await shareReceipt(receiptUri);
      setIsSharing(false);
    } catch (error) {
      setIsSharing(false);
      console.error("Error sharing receipt:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>
            Transaction Details
          </Text>
          <View style={styles.backButton} />
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInUp.delay(100).duration(400)}
          style={styles.amountSection}
        >
          <View style={styles.watermarkContainer}>
            <MaterialIcons
              name="account-balance"
              size={140}
              color={`${colors.primary}08`}
            />
          </View>
          <View style={styles.iconContainer}>
            <MaterialIcons name="savings" size={28} color={colors.primary} />
          </View>
          <Text style={styles.amountLabel}>Contribution Amount</Text>
          <Text style={styles.amountValue}>{formatCurrency(amount)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusBadgeBg }]}>
            <MaterialIcons name={statusIcon as any} size={14} color={statusBadgeColor} />
            <Text style={[styles.statusText, { color: statusBadgeColor }]}>
              {contribution.status.toUpperCase()}
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(400)}>
          <Text style={styles.sectionTitle}>General Information</Text>
          <View style={styles.detailsContainer}>
            <TransactionDetailCard
              icon="fingerprint"
              label="Transaction ID"
              value={contribution.id}
              showCopy
            />
            <TransactionDetailCard
              icon="calendar-today"
              label="Date & Time"
              value={`${formattedDate} • ${formattedTime}`}
            />
            <TransactionDetailCard
              icon="savings"
              label="Contribution Month"
              value={formattedMonth}
            />
            <TransactionDetailCard icon="category" label="Type" value="CONTRIBUTION" />
            <TransactionDetailCard
              icon="info"
              label="Status"
              value={contribution.status.toUpperCase()}
            />
            {contribution.notes && (
              <TransactionDetailCard
                icon="notes"
                label="Notes"
                value={contribution.notes}
              />
            )}
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(300).duration(400)}
          style={styles.actionsContainer}
        >
          <AnimatedTouchable
            onPress={handleDownloadReceipt}
            disabled={isDownloading}
            style={styles.actionButton}
            activeOpacity={0.8}
          >
            {isDownloading ? (
              <ActivityIndicator size="small" color={colors.onSurface} />
            ) : (
              <>
                <MaterialIcons name="download" size={20} color={colors.onSurface} />
                <Text style={styles.actionButtonText}>Download Receipt</Text>
              </>
            )}
          </AnimatedTouchable>

          <AnimatedTouchable
            onPress={handleShareReceipt}
            disabled={isSharing}
            style={styles.actionButton}
            activeOpacity={0.8}
          >
            {isSharing ? (
              <ActivityIndicator size="small" color={colors.onSurface} />
            ) : (
              <>
                <MaterialIcons name="share" size={20} color={colors.onSurface} />
                <Text style={styles.actionButtonText}>Share</Text>
              </>
            )}
          </AnimatedTouchable>
        </Animated.View>

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
    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing["3xl"],
    },
    loadingText: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.base,
      color: colors.onSurfaceVariant,
      marginTop: theme.spacing.base,
    },
    errorContainer: {
      flex: 1,
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
    notFoundText: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size.lg,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurface,
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
    amountSection: {
      backgroundColor: colors.surface,
      borderRadius: theme.borderRadius["2xl"],
      padding: theme.spacing["2xl"],
      alignItems: "center",
      marginBottom: theme.spacing.lg,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
      borderWidth: 1,
      borderColor: `${colors.outline}30`,
      overflow: "hidden",
      position: "relative",
    },
    watermarkContainer: {
      position: "absolute",
      bottom: -20,
      right: -20,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: `${colors.primary}10`,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.base,
    },
    amountLabel: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.xs,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.secondary,
      textTransform: "uppercase",
      letterSpacing: 2,
      marginBottom: theme.spacing.xs,
    },
    amountValue: {
      fontFamily: typography.fontFamily.headline,
      fontSize: 32,
      fontWeight: typography.fontWeight.extrabold as any,
      color: colors.onSurface,
      marginBottom: theme.spacing.base,
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
    },
    statusText: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.xs - 2,
      fontWeight: typography.fontWeight.bold as any,
    },
    sectionTitle: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size.lg,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurface,
      marginBottom: theme.spacing.base,
      paddingHorizontal: theme.spacing.xs,
    },
    detailsContainer: {
      gap: theme.spacing.base,
    },
    actionsContainer: {
      flexDirection: "row",
      gap: theme.spacing.base,
      marginTop: theme.spacing.lg,
    },
    actionButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.sm,
      backgroundColor: colors.surface,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: theme.spacing.lg,
      borderWidth: 1,
      borderColor: colors.outline,
    },
    actionButtonText: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.xs,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurface,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    bottomPadding: {
      height: 40,
    },
  });
