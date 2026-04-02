import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { useTheme, lightColors } from "@/contexts/ThemeContext";
import { theme } from "@/styles/theme";
import { typography } from "@/constants/typography";
import { SuccessModal } from "@/components/modals/SuccessModal";
import { mockLoans, formatCurrency } from "@/data/mockData";

interface Loan {
  id: string;
  title: string;
  remainingBalance: number;
  nextPayment: {
    date: string;
    amount: number;
    daysLeft: number;
  };
}

interface PaymentMethod {
  id: string;
  type: "card" | "bank" | "wallet";
  name: string;
  details: string;
  icon: string;
}

export default function MakePaymentScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors, insets.bottom);

  // State
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [paymentType, setPaymentType] = useState<"full" | "partial">("full");
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock data
  const outstandingLoans: Loan[] = mockLoans
    .filter((loan) => loan.remainingBalance > 0)
    .map((loan) => ({
      id: loan.id,
      title: loan.title,
      remainingBalance: loan.remainingBalance,
      nextPayment: loan.nextPayment,
    }));

  const paymentMethods: PaymentMethod[] = [
    {
      id: "card1",
      type: "card",
      name: "Visa ending in 4242",
      details: "Expires 12/25",
      icon: "credit-card",
    },
    {
      id: "card2",
      type: "card",
      name: "Mastercard ending in 8888",
      details: "Expires 08/26",
      icon: "credit-card",
    },
    {
      id: "bank1",
      type: "bank",
      name: "First Bank of Nigeria",
      details: "**** 1234",
      icon: "account-balance",
    },
    {
      id: "wallet",
      type: "wallet",
      name: "DOMICOP Wallet",
      details: "Balance: ₦50,000",
      icon: "account-balance-wallet",
    },
  ];

  const quickAmounts = ["1,000", "5,000", "10,000", "50,000"];

  const handleBack = () => {
    router.back();
  };

  const handleLoanSelect = (loan: Loan) => {
    setSelectedLoan(loan);
    if (paymentType === "full") {
      setAmount(loan.remainingBalance.toString());
    }
  };

  const handlePaymentTypeChange = (type: "full" | "partial") => {
    setPaymentType(type);
    if (type === "full" && selectedLoan) {
      setAmount(selectedLoan.remainingBalance.toString());
    } else {
      setAmount("");
    }
  };

  const handleQuickAmount = (amt: string) => {
    setAmount(amt.replace(/,/g, ""));
  };

  const handleAmountChange = (text: string) => {
    // Remove non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, "");
    setAmount(numericValue);
  };

  const getTransactionFee = () => {
    const numericAmount = parseFloat(amount) || 0;
    return numericAmount * 0.015; // 1.5% fee
  };

  const getTotalAmount = () => {
    const numericAmount = parseFloat(amount) || 0;
    return numericAmount + getTransactionFee();
  };

  const handleConfirmPayment = async () => {
    if (!selectedLoan || !amount || !selectedMethod) {
      Alert.alert(
        "Missing Information",
        "Please select a loan, enter an amount, and choose a payment method.",
      );
      return;
    }

    setIsProcessing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.replace("/(tabs)/loans");
  };

  const formatAmount = (value: string) => {
    if (!value) return "";
    const num = parseFloat(value);
    if (isNaN(num)) return "";
    return num.toLocaleString("en-NG");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Header */}
      <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>
            Make a Payment
          </Text>
          <View style={styles.backButton} />
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Payment Type Selection */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(400)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Payment Type</Text>
          <View style={styles.paymentTypeContainer}>
            <TouchableOpacity
              style={[
                styles.paymentTypeCard,
                paymentType === "full" && styles.paymentTypeCardActive,
              ]}
              onPress={() => handlePaymentTypeChange("full")}
            >
              <View style={styles.radioContainer}>
                <View
                  style={[
                    styles.radioButton,
                    paymentType === "full" && styles.radioButtonActive,
                  ]}
                >
                  {paymentType === "full" && <View style={styles.radioInner} />}
                </View>
              </View>
              <View style={styles.paymentTypeContent}>
                <Text
                  style={[
                    styles.paymentTypeTitle,
                    paymentType === "full" && styles.paymentTypeTitleActive,
                  ]}
                >
                  Full Payment
                </Text>
                <Text style={styles.paymentTypeSubtitle}>
                  Pay off the entire remaining balance
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentTypeCard,
                paymentType === "partial" && styles.paymentTypeCardActive,
              ]}
              onPress={() => handlePaymentTypeChange("partial")}
            >
              <View style={styles.radioContainer}>
                <View
                  style={[
                    styles.radioButton,
                    paymentType === "partial" && styles.radioButtonActive,
                  ]}
                >
                  {paymentType === "partial" && <View style={styles.radioInner} />}
                </View>
              </View>
              <View style={styles.paymentTypeContent}>
                <Text
                  style={[
                    styles.paymentTypeTitle,
                    paymentType === "partial" && styles.paymentTypeTitleActive,
                  ]}
                >
                  Partial Payment
                </Text>
                <Text style={styles.paymentTypeSubtitle}>Pay a custom amount</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Loan Selection */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(400)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Select Loan</Text>
          {outstandingLoans.map((loan, index) => (
            <TouchableOpacity
              key={loan.id}
              style={[
                styles.loanCard,
                selectedLoan?.id === loan.id && styles.loanCardActive,
              ]}
              onPress={() => handleLoanSelect(loan)}
            >
              <View style={styles.loanInfo}>
                <Text style={styles.loanTitle}>{loan.title}</Text>
                <Text style={styles.loanSubtitle}>
                  Next payment: {loan.nextPayment.date}
                </Text>
              </View>
              <View style={styles.loanAmount}>
                <Text style={styles.loanBalanceLabel}>Remaining</Text>
                <Text style={styles.loanBalance}>
                  ₦{formatCurrency(loan.remainingBalance)}
                </Text>
              </View>
              {selectedLoan?.id === loan.id && (
                <MaterialIcons
                  name="check-circle"
                  size={24}
                  color={colors.primary}
                  style={styles.checkIcon}
                />
              )}
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Amount Input */}
        <Animated.View
          entering={FadeInUp.delay(300).duration(400)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Payment Amount</Text>
          <View style={styles.amountContainer}>
            <View style={styles.amountInputWrapper}>
              <Text style={styles.currencySymbol}>₦</Text>
              <TextInput
                style={styles.amountInput}
                value={formatAmount(amount)}
                onChangeText={handleAmountChange}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.onSurfaceVariant}
              />
            </View>
            <View style={styles.quickAmounts}>
              {quickAmounts.map((amt) => (
                <TouchableOpacity
                  key={amt}
                  style={styles.quickAmountButton}
                  onPress={() => handleQuickAmount(amt)}
                >
                  <Text style={styles.quickAmountText}>+₦{amt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Payment Method */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(400)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                selectedMethod === method.id && styles.methodCardActive,
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View
                style={[styles.methodIcon, { backgroundColor: `${colors.primary}10` }]}
              >
                <MaterialIcons
                  name={method.icon as any}
                  size={20}
                  color={colors.primary}
                />
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodName}>{method.name}</Text>
                <Text style={styles.methodDetails}>{method.details}</Text>
              </View>
              <View style={styles.radioContainer}>
                <View
                  style={[
                    styles.radioButton,
                    selectedMethod === method.id && styles.radioButtonActive,
                  ]}
                >
                  {selectedMethod === method.id && <View style={styles.radioInner} />}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Transaction Summary */}
        <Animated.View
          entering={FadeInUp.delay(500).duration(400)}
          style={styles.summaryCard}
        >
          <Text style={styles.summaryTitle}>Transaction Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Payment Amount</Text>
            <Text style={styles.summaryValue}>₦{formatAmount(amount) || "0"}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Transaction Fee (1.5%)</Text>
            <Text style={styles.summaryValue}>
              ₦{formatCurrency(getTransactionFee())}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₦{formatCurrency(getTotalAmount())}</Text>
          </View>
        </Animated.View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!selectedLoan || !amount || !selectedMethod || isProcessing) &&
              styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirmPayment}
          disabled={!selectedLoan || !amount || !selectedMethod || isProcessing}
        >
          {isProcessing ? (
            <Text style={styles.confirmButtonText}>Processing...</Text>
          ) : (
            <>
              <MaterialIcons name="lock" size={20} color={colors.onPrimary} />
              <Text style={styles.confirmButtonText}>Confirm Payment</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <SuccessModal visible={showSuccess} onClose={handleSuccessClose} />
    </SafeAreaView>
  );
}

const createStyles = (colors: typeof lightColors, bottomInset: number) =>
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
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size.base,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurface,
      marginBottom: theme.spacing.base,
    },
    paymentTypeContainer: {
      gap: theme.spacing.base,
    },
    paymentTypeCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
    },
    paymentTypeCardActive: {
      borderColor: colors.primary,
      backgroundColor: `${colors.primary}05`,
    },
    radioContainer: {
      marginRight: theme.spacing.base,
    },
    radioButton: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.outline,
      alignItems: "center",
      justifyContent: "center",
    },
    radioButtonActive: {
      borderColor: colors.primary,
    },
    radioInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.primary,
    },
    paymentTypeContent: {
      flex: 1,
    },
    paymentTypeTitle: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size.base,
      fontWeight: typography.fontWeight.semibold as any,
      color: colors.onSurface,
      marginBottom: 2,
    },
    paymentTypeTitleActive: {
      color: colors.primary,
    },
    paymentTypeSubtitle: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.sm,
      color: colors.onSurfaceVariant,
    },
    loanCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.base,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
    },
    loanCardActive: {
      borderColor: colors.primary,
      backgroundColor: `${colors.primary}05`,
    },
    loanInfo: {
      flex: 1,
    },
    loanTitle: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size.base,
      fontWeight: typography.fontWeight.semibold as any,
      color: colors.onSurface,
      marginBottom: 2,
    },
    loanSubtitle: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.sm,
      color: colors.onSurfaceVariant,
    },
    loanAmount: {
      alignItems: "flex-end",
      marginRight: theme.spacing.base,
    },
    loanBalanceLabel: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.xs,
      color: colors.onSurfaceVariant,
      textTransform: "uppercase",
    },
    loanBalance: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size.base,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurface,
    },
    checkIcon: {
      marginLeft: theme.spacing.sm,
    },
    amountContainer: {
      backgroundColor: colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
    },
    amountInputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 2,
      borderBottomColor: colors.outlineVariant,
      paddingBottom: theme.spacing.base,
      marginBottom: theme.spacing.base,
    },
    currencySymbol: {
      fontFamily: typography.fontFamily.headline,
      fontSize: theme.spacing["2xl"],
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurface,
      marginRight: theme.spacing.sm,
    },
    amountInput: {
      flex: 1,
      fontFamily: typography.fontFamily.headline,
      fontSize: theme.spacing["2xl"],
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurface,
      padding: 0,
    },
    quickAmounts: {
      flexDirection: "row",
      gap: theme.spacing.base,
    },
    quickAmountButton: {
      backgroundColor: colors.surfaceContainerHigh,
      borderRadius: theme.borderRadius.full,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.base,
    },
    quickAmountText: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.xs,
      fontWeight: typography.fontWeight.semibold as any,
      color: colors.onSurface,
    },
    methodCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.base,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
    },
    methodCardActive: {
      borderColor: colors.primary,
      backgroundColor: `${colors.primary}05`,
    },
    methodIcon: {
      width: 40,
      height: 28,
      borderRadius: 4,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.base,
    },
    methodInfo: {
      flex: 1,
    },
    methodName: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size.base,
      fontWeight: typography.fontWeight.semibold as any,
      color: colors.onSurface,
      marginBottom: 2,
    },
    methodDetails: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.sm,
      color: colors.onSurfaceVariant,
    },
    summaryCard: {
      backgroundColor: colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    summaryTitle: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size.base,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurface,
      marginBottom: theme.spacing.base,
    },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    summaryLabel: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.sm,
      color: colors.onSurfaceVariant,
    },
    summaryValue: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size.base,
      fontWeight: typography.fontWeight.semibold as any,
      color: colors.onSurface,
    },
    totalRow: {
      marginTop: theme.spacing.base,
      paddingTop: theme.spacing.base,
      borderTopWidth: 1,
      borderTopColor: colors.outlineVariant,
    },
    totalLabel: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size.base,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurface,
    },
    totalValue: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size.lg,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.primary,
    },
    bottomPadding: {
      height: 100,
    },
    footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.outlineVariant,
      padding: theme.spacing.lg,
      paddingBottom: Math.max(bottomInset, theme.spacing.lg) + theme.spacing.lg,
    },
    confirmButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: theme.spacing.lg,
      gap: theme.spacing.sm,
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    confirmButtonDisabled: {
      backgroundColor: colors.surfaceContainerHigh,
      shadowOpacity: 0,
      elevation: 0,
    },
    confirmButtonText: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size.base,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onPrimary,
    },
  });
