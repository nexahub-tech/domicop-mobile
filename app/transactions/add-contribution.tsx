import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { useTheme, lightColors } from '@/contexts/ThemeContext';
import { theme } from '@/styles/theme';
import { typography } from '@/constants/typography';
import { AmountInput } from '@/components/forms/AmountInput';
import { DropdownSelect } from '@/components/forms/DropdownSelect';
import { SummaryCard } from '@/components/savings/SummaryCard';
import {
  sourceOfFundsOptions,
  getContributionMonths,
  MIN_CONTRIBUTION_AMOUNT,
} from '@/data/mockData';
import { SuccessModal } from '@/components/modals/SuccessModal';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function AddContributionScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = getStyles(colors, insets.bottom);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Form state
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState('');
  const [source, setSource] = useState('');
  const [errors, setErrors] = useState<{
    amount?: string;
    month?: string;
    source?: string;
  }>({});

  const contributionMonths = getContributionMonths();

  const validateForm = () => {
    const newErrors: { amount?: string; month?: string; source?: string } = {};
    const numericAmount = parseFloat(amount.replace(/,/g, '')) || 0;

    if (!amount || numericAmount < MIN_CONTRIBUTION_AMOUNT) {
      newErrors.amount = `Minimum contribution is ₦${MIN_CONTRIBUTION_AMOUNT.toLocaleString()}`;
    }

    if (!month) {
      newErrors.month = 'Please select a contribution month';
    }

    if (!source) {
      newErrors.source = 'Please select a source of funds';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.replace('/(tabs)/savings');
  };

  const handleBack = () => {
    router.back();
  };

  const numericAmount = parseFloat(amount.replace(/,/g, '')) || 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* Header */}
      <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>Add Contribution</Text>
          <View style={styles.backButton} />
        </View>
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Hero Card */}
          <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.heroCard}>
            <View style={styles.heroContent}>
              <Text style={styles.heroSubtitle}>Institutional Ledger</Text>
              <Text style={styles.heroTitle}>DOMICOP</Text>
              <Text style={styles.heroDescription}>Secure Member Contribution Portal</Text>
            </View>
            <View style={styles.watermarkContainer}>
              <MaterialIcons
                name="account-balance-wallet"
                size={120}
                color={isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.1)'}
              />
            </View>
          </Animated.View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Amount Input */}
            <Animated.View entering={FadeInUp.delay(200).duration(400)}>
              <AmountInput
                value={amount}
                onChangeText={setAmount}
                error={errors.amount}
              />
            </Animated.View>

            {/* Month Selection */}
            <Animated.View entering={FadeInUp.delay(300).duration(400)}>
              <DropdownSelect
                label="Contribution Month"
                value={month}
                options={contributionMonths}
                onSelect={setMonth}
                placeholder="Select month"
                icon="calendar-month"
              />
              {errors.month && <Text style={styles.errorText}>{errors.month}</Text>}
            </Animated.View>

            {/* Source of Funds */}
            <Animated.View entering={FadeInUp.delay(400).duration(400)}>
              <DropdownSelect
                label="Source of Funds"
                value={source}
                options={sourceOfFundsOptions.map((opt) => ({
                  value: opt.id,
                  label: opt.label,
                  icon: opt.icon,
                }))}
                onSelect={setSource}
                placeholder="Select source"
                icon="account-balance"
              />
              {errors.source && <Text style={styles.errorText}>{errors.source}</Text>}
            </Animated.View>

            {/* Summary Card */}
            {numericAmount > 0 && (
              <Animated.View entering={FadeInUp.delay(500).duration(400)}>
                <SummaryCard amount={numericAmount} />
              </Animated.View>
            )}

            {/* Submit Button */}
            <Animated.View entering={FadeInUp.delay(600).duration(400)}>
              <AnimatedTouchable
                onPress={handleSubmit}
                disabled={isSubmitting}
                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                activeOpacity={0.8}
              >
                {isSubmitting ? (
                  <Text style={styles.submitButtonText}>Processing...</Text>
                ) : (
                  <>
                    <MaterialIcons name="send" size={20} color={colors.onPrimary} />
                    <Text style={styles.submitButtonText}>Submit Contribution</Text>
                  </>
                )}
              </AnimatedTouchable>
            </Animated.View>
          </View>

          {/* Compliance Note */}
          <Animated.View entering={FadeInUp.delay(700).duration(400)} style={styles.complianceContainer}>
            <View style={styles.complianceIcon}>
              <MaterialIcons name="verified-user" size={24} color={colors.primary} />
            </View>
            <View style={styles.complianceTextContainer}>
              <Text style={styles.complianceTitle}>Audit Trail Protection</Text>
              <Text style={styles.complianceText}>
                All contributions are processed through the DOMICOP ledger and are non-reversible once confirmed. Ensure fund sources comply with internal audit regulations.
              </Text>
            </View>
          </Animated.View>

          {/* Bottom padding */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccess}
        onClose={handleSuccessClose}
      />
    </SafeAreaView>
  );
}

const getStyles = (colors: typeof lightColors, bottomInset: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  heroCard: {
    backgroundColor: colors.primary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing['2xl'],
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  heroContent: {
    zIndex: 1,
  },
  heroSubtitle: {
    fontFamily: typography.fontFamily.label,
    fontSize: typography.size.xs,
    fontWeight: typography.fontWeight.bold as any,
    color: `${colors.onPrimary}80`,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: theme.spacing.xs,
  },
  heroTitle: {
    fontFamily: typography.fontFamily.headline,
    fontSize: typography.size['2xl'],
    fontWeight: typography.fontWeight.extrabold as any,
    color: colors.onPrimary,
    marginBottom: 4,
  },
  heroDescription: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.sm,
    color: `${colors.onPrimary}90`,
  },
  watermarkContainer: {
    position: 'absolute',
    bottom: -24,
    right: -24,
    zIndex: 0,
  },
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius['2xl'],
    padding: theme.spacing['2xl'],
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: `${colors.outline}50`,
  },
  errorText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.xs,
    color: colors.error,
    marginTop: -theme.spacing.base,
    marginBottom: theme.spacing.base,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: theme.borderRadius.xl,
    paddingVertical: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.base,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontFamily: typography.fontFamily.headline,
    fontSize: typography.size.base,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.onPrimary,
  },
  complianceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.base,
    backgroundColor: `${colors.surface}80`,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    borderWidth: 1,
    borderColor: `${colors.outline}30`,
  },
  complianceIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: `${colors.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  complianceTextContainer: {
    flex: 1,
  },
  complianceTitle: {
    fontFamily: typography.fontFamily.headline,
    fontSize: typography.size.xs,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.onSurface,
    marginBottom: 4,
  },
  complianceText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.xs - 1,
    color: colors.secondary,
    lineHeight: 18,
  },
  bottomPadding: {
    height: 40,
  },
});
