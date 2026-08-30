import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useTheme } from "@/contexts/ThemeContext";
import type { lightColors } from "@/contexts/ThemeContext";
import { theme } from "@/styles/theme";
import { typography } from "@/constants/typography";
import { createElevation } from "@/constants/theme";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { Badge, BadgeStatus } from "@/components/common/Badge";
import { Money } from "@/components/common/Money";
import { Button } from "@/components/common/Button";
import { TransactionDetailCard } from "@/components/savings/TransactionDetailCard";
import { getLoanTypeConfig } from "@/constants/loans";
import { formatCurrencyNoSign } from "@/lib/utils/format";
import { useLoans } from "@/hooks/useLoans";
import { useQuery } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { loansApi } from "@/lib/api/loans.api";
import type { LoanStatus } from "@/lib/types/loans";

const STATUS_META: Record<LoanStatus, { badge: BadgeStatus; label: string }> = {
  on_track: { badge: "success", label: "ON TRACK" },
  pending: { badge: "warning", label: "PENDING" },
  overdue: { badge: "error", label: "OVERDUE" },
  rejected: { badge: "error", label: "REJECTED" },
  completed: { badge: "neutral", label: "COMPLETED" },
};

export default function LoanDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, isDarkMode } = useTheme();
  const styles = createStyles(colors);
  const elevations = createElevation(colors);

  // Served from the loans query cache populated by the list screen.
  const { loans, isLoading } = useLoans();
  const loan = loans.find((l) => l.id === id);

  // The list only carries the loan summary. Guarantors, the signed repayment
  // schedule and the bond come from the detail endpoint, so they are fetched
  // separately and rendered when they arrive rather than blocking the screen.
  const { data: detail } = useQuery({
    queryKey: ["loan-detail", id],
    queryFn: () => loansApi.getById(id!),
    enabled: !!id,
  });

  const handleBack = () => {
    router.back();
  };

  if (!loan) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <ScreenHeader title="Loan Details" onBack={handleBack} />
        <View style={styles.notFoundContainer}>
          <MaterialIcons
            name={isLoading ? "hourglass-empty" : "search-off"}
            size={48}
            color={colors.outlineVariant}
          />
          <Text style={styles.notFoundText}>
            {isLoading ? "Loading loan…" : "Loan not found"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const purposeConfig = getLoanTypeConfig(loan.type);
  const statusMeta = STATUS_META[loan.status];
  const paidAmount = loan.totalAmount - loan.remainingBalance;

  const handleMakePayment = () => {
    router.push("/transactions/make-payment");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      <ScreenHeader title="Loan Details" onBack={handleBack} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(400)}
          style={[styles.amountSection, elevations.raised]}
        >
          <View style={styles.watermarkContainer}>
            <MaterialIcons
              name={purposeConfig.icon as any}
              size={140}
              color={`${purposeConfig.color}08`}
            />
          </View>
          <View style={[styles.iconContainer, { backgroundColor: purposeConfig.bgColor }]}>
            <MaterialIcons
              name={purposeConfig.icon as any}
              size={28}
              color={purposeConfig.color}
            />
          </View>
          <Text style={styles.amountLabel}>Remaining Balance</Text>
          <Money amount={loan.remainingBalance} size="xl" style={styles.amountValue} />
          <Badge status={statusMeta.badge} label={statusMeta.label} />
        </Animated.View>

        {/* Repayment Progress */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(400)}
          style={[styles.sectionCard, elevations.flat]}
        >
          <Text style={styles.sectionTitle}>Repayment Progress</Text>

          <View>
            <View style={styles.progressHeader}>
              <Text style={styles.progressPercent}>{loan.progress}% Complete</Text>
              <Text style={styles.progressTermText}>{loan.termMonths} months term</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${loan.progress}%`, backgroundColor: purposeConfig.color },
                ]}
              />
            </View>
          </View>

          <View style={styles.amountsRow}>
            <View style={styles.amountItem}>
              <Text style={styles.amountItemLabel}>Total Loan</Text>
              <Money amount={loan.totalAmount} size="md" />
            </View>
            <View style={[styles.amountItem, styles.amountItemRight]}>
              <Text style={styles.amountItemLabel}>Paid So Far</Text>
              <Money amount={paidAmount} size="md" tone="success" />
            </View>
          </View>
        </Animated.View>

        {/* Loan Information */}
        <Animated.View
          entering={FadeInUp.delay(300).duration(400)}
          style={[styles.sectionCard, elevations.flat]}
        >
          <Text style={styles.sectionTitle}>Loan Information</Text>
          <View style={styles.detailsContainer}>
            <TransactionDetailCard
              icon="fingerprint"
              label="Loan ID"
              value={loan.loanId}
              showCopy
            />
            <TransactionDetailCard icon="category" label="Loan Type" value={purposeConfig.label} />
            {loan.purpose ? (
              <TransactionDetailCard icon="notes" label="Purpose" value={loan.purpose} />
            ) : null}
            <TransactionDetailCard
              icon="payment"
              label="Monthly Payment"
              value={`₦${formatCurrencyNoSign(loan.monthlyPayment)}`}
            />
            <TransactionDetailCard
              icon="percent"
              label="Interest Rate"
              value={`${loan.interestRate}% APR`}
            />
            <TransactionDetailCard
              icon="calendar-today"
              label="Start Date"
              value={loan.startDate}
            />
            <TransactionDetailCard
              icon="event"
              label="Next Payment"
              value={`₦${formatCurrencyNoSign(loan.nextPayment.amount)} on ${loan.nextPayment.date}`}
            />
          </View>
        </Animated.View>

        {/* Make Payment */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(400)}
          style={styles.actionContainer}
        >
          <Button
            title="Make a Payment"
            onPress={handleMakePayment}
            variant="primary"
            size="lg"
            icon="payment"
            iconPosition="left"
            fullWidth
          />
        </Animated.View>

        {/* Part A item 8 — the schedule the borrower signed */}
        {!!detail?.loan_installments?.length && (
          <Animated.View
            entering={FadeInUp.delay(400).duration(400)}
            style={[styles.sectionCard, elevations.flat]}
          >
            <Text style={styles.sectionTitle}>Repayment Schedule</Text>
            <Text style={styles.scheduleNote}>
              {detail.grace_months ?? 1} month grace after disbursement, then{" "}
              {detail.loan_installments.length} equal installments.
            </Text>
            {detail.loan_installments.map((row) => (
              <View key={row.installment_no} style={styles.scheduleRow}>
                <Text style={styles.scheduleMonth}>
                  {row.installment_no}.{" "}
                  {new Date(row.due_on).toLocaleDateString(undefined, {
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
                <View style={styles.scheduleRight}>
                  <Text style={styles.scheduleAmount}>
                    ₦{formatCurrencyNoSign(Number(row.amount))}
                  </Text>
                  <Badge
                    status={
                      row.status === "paid"
                        ? "success"
                        : row.status === "late"
                          ? "error"
                          : "neutral"
                    }
                    label={row.status.toUpperCase()}
                  />
                </View>
              </View>
            ))}
          </Animated.View>
        )}

        {/* Part B — guarantors */}
        {!!detail?.loan_guarantors?.length && (
          <Animated.View
            entering={FadeInUp.delay(500).duration(400)}
            style={[styles.sectionCard, elevations.flat]}
          >
            <Text style={styles.sectionTitle}>Guarantors</Text>
            {detail.loan_guarantors.map((g) => (
              <View key={g.position} style={styles.guarantorRow}>
                <Text style={styles.guarantorName}>
                  {g.position}. {g.full_name}
                </Text>
                <Text style={styles.guarantorMeta}>
                  {g.bank_name} · {g.bank_account}
                </Text>
              </View>
            ))}
          </Animated.View>
        )}

        {/* The bond deed itself */}
        {!!detail?.bond_url && (
          <Animated.View
            entering={FadeInUp.delay(600).duration(400)}
            style={[styles.sectionCard, elevations.flat]}
          >
            <Text style={styles.sectionTitle}>Loan Bond</Text>
            <Text style={styles.scheduleNote}>
              {detail.bond_cancelled_at
                ? "This loan is fully repaid and the bond has been cancelled."
                : "Your signed bond, as approved by the Secretary and President."}
            </Text>
            <Button
              title="Open Loan Bond"
              onPress={() => Linking.openURL(detail.bond_url!)}
              variant="tonal"
              size="lg"
              icon="picture-as-pdf"
              iconPosition="left"
              fullWidth
            />
          </Animated.View>
        )}

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
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: theme.spacing.lg,
    },
    notFoundContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.base,
      paddingHorizontal: theme.spacing.xl,
    },
    notFoundText: {
      ...typography.styles.bodyText,
      color: colors.onSurfaceVariant,
    },
    amountSection: {
      backgroundColor: colors.surface,
      borderRadius: theme.borderRadius["2xl"],
      padding: theme.spacing["2xl"],
      alignItems: "center",
      marginBottom: theme.spacing.lg,
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
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.base,
    },
    amountLabel: {
      ...typography.styles.sectionLabel,
      fontSize: typography.size.xs,
      color: colors.onSurfaceVariant,
      letterSpacing: 2,
      marginBottom: theme.spacing.xs,
    },
    amountValue: {
      marginBottom: theme.spacing.base,
    },
    sectionCard: {
      backgroundColor: colors.surfaceContainerLow,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      gap: theme.spacing.base,
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      ...typography.styles.sectionLabel,
      fontSize: typography.size.xs,
      color: colors.onSurfaceVariant,
    },
    progressHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: theme.spacing.sm,
    },
    progressPercent: {
      ...typography.styles.cardTitle,
      fontSize: typography.size.lg,
      color: colors.onSurface,
    },
    progressTermText: {
      ...typography.styles.bodySmall,
      color: colors.onSurfaceVariant,
    },
    progressBarBackground: {
      height: 8,
      backgroundColor: colors.surfaceContainer,
      borderRadius: 4,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      borderRadius: 4,
    },
    amountsRow: {
      flexDirection: "row",
      paddingTop: theme.spacing.base,
      borderTopWidth: 1,
      borderTopColor: colors.outlineVariant,
    },
    amountItem: {
      flex: 1,
    },
    amountItemRight: {
      alignItems: "flex-end",
    },
    amountItemLabel: {
      ...typography.styles.sectionLabel,
      fontSize: typography.size.xs - 1,
      color: colors.onSurfaceVariant,
      marginBottom: 4,
    },
    detailsContainer: {
      gap: theme.spacing.base,
    },
    actionContainer: {
      marginTop: theme.spacing.base,
    },
    scheduleNote: {
      ...typography.styles.bodySmall,
      fontSize: typography.size.xs,
      color: colors.onSurfaceVariant,
      marginBottom: theme.spacing.base,
      lineHeight: 18,
    },
    scheduleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: theme.spacing.sm,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.outlineVariant,
      gap: theme.spacing.base,
    },
    scheduleMonth: {
      ...typography.styles.bodySmall,
      fontSize: typography.size.xs,
      color: colors.onSurfaceVariant,
      flex: 1,
    },
    scheduleRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    scheduleAmount: {
      ...typography.styles.label,
      fontSize: typography.size.xs,
      color: colors.onSurface,
    },
    guarantorRow: {
      paddingVertical: theme.spacing.sm,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.outlineVariant,
    },
    guarantorName: {
      ...typography.styles.label,
      fontSize: typography.size.sm,
      color: colors.onSurface,
    },
    guarantorMeta: {
      ...typography.styles.bodySmall,
      fontSize: typography.size.xs,
      color: colors.onSurfaceVariant,
    },
    bottomPadding: {
      height: 40,
    },
  });
