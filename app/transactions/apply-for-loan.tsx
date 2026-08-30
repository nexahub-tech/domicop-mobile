import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useQueryClient } from '@tanstack/react-query';
import { useTheme, lightColors } from '@/contexts/ThemeContext';
import { theme } from '@/styles/theme';
import { typography } from '@/constants/typography';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { Button } from '@/components/common/Button';
import { AmountInput } from '@/components/forms/AmountInput';
import { PurposeSelector } from '@/components/forms/PurposeSelector';
import { TermSlider } from '@/components/forms/TermSlider';
import { LoanCalculator } from '@/components/forms/LoanCalculator';
import { SignaturePad } from '@/components/forms/SignaturePad';
import { Input } from '@/components/common/Input';
import { SuccessModal } from '@/components/modals/SuccessModal/index';
import { InfoModal } from '@/components/modals/InfoModal';
import { loanConfig, calculateLoan, buildSchedulePreview } from '@/constants/loans';
import { loansApi, LoanApplicationRejection } from '@/lib/api/loans.api';
import type { LoanGuarantorInput } from '@/lib/api/loans.api';
import { members } from '@/lib/api/members.api';
import type { LoanType, InsufficientContributionsError, ActiveLoanExistsError } from '@/lib/types/loans';
import { parseNairaInput, toApiAmount, formatNaira } from '@/lib/utils/currency';

const MIN_PURPOSE_LENGTH = 10;

/**
 * 1 amount & purpose · 2 applicant (Part A) · 3 terms & schedule (Part A item 8)
 * · 4 guarantors (Part B) · 5 review & sign (Part A item 9)
 */
type Step = 1 | 2 | 3 | 4 | 5;
const TOTAL_STEPS = 5;

const emptyGuarantor = (): LoanGuarantorInput => ({
  full_name: '',
  bank_name: '',
  bank_account: '',
  phone: '',
  signature: '',
});

export default function ApplyForLoanScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { colors, isDarkMode } = useTheme();
  const styles = getStyles(colors);

  const [step, setStep] = useState<Step>(1);

  // Step 1 — amount & purpose
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<LoanType | null>(null);
  const [purpose, setPurpose] = useState('');

  // Step 2 — Part A applicant details. Prefilled from the profile but editable,
  // because the server stores them as a snapshot on the bond.
  const [address, setAddress] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [phone, setPhone] = useState('');

  // Step 3 — terms
  const [term, setTerm] = useState(loanConfig.maxTerm);
  const [interestRate, setInterestRate] = useState(loanConfig.defaultInterestRate);

  // Step 4 — Part B
  const [guarantors, setGuarantors] = useState<LoanGuarantorInput[]>([
    emptyGuarantor(),
    emptyGuarantor(),
    emptyGuarantor(),
  ]);

  // Step 5 — Part A item 9
  const [borrowerSignature, setBorrowerSignature] = useState('');

  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [eligibilityError, setEligibilityError] =
    useState<InsufficientContributionsError | null>(null);
  const [activeLoanError, setActiveLoanError] =
    useState<ActiveLoanExistsError | null>(null);

  // Seed Part A from the member's profile so they confirm rather than retype.
  useEffect(() => {
    let cancelled = false;
    members
      .getProfile()
      .then((p) => {
        if (cancelled) return;
        setAddress((v) => v || p.address || '');
        setBankName((v) => v || p.bank_name || '');
        setBankAccount((v) => v || p.bank_account || '');
        setPhone((v) => v || p.phone || '');
      })
      .catch(() => {
        // Prefill is a convenience; the fields stay editable either way.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const loanDetails = useMemo(() => {
    const numericAmount = parseNairaInput(amount) || 0;
    return calculateLoan(numericAmount, term, interestRate);
  }, [amount, term, interestRate]);

  const schedule = useMemo(() => {
    const numericAmount = parseNairaInput(amount) || 0;
    if (numericAmount <= 0) return [];
    return buildSchedulePreview(numericAmount, term, interestRate);
  }, [amount, term, interestRate]);

  const setGuarantor = useCallback(
    (index: number, patch: Partial<LoanGuarantorInput>) => {
      setGuarantors((prev) =>
        prev.map((g, i) => (i === index ? { ...g, ...patch } : g)),
      );
      setErrors((e) => ({ ...e, [`guarantor_${index}`]: undefined }));
    },
    [],
  );

  const validateStep = useCallback(
    (target: Step): boolean => {
      const next: Record<string, string | undefined> = {};
      const numericAmount = parseNairaInput(amount) || 0;

      if (target === 1) {
        if (!amount || numericAmount < loanConfig.minAmount) {
          next.amount = `Minimum loan amount is ₦${loanConfig.minAmount.toLocaleString()}`;
        } else if (numericAmount > loanConfig.maxAmount) {
          next.amount = `Maximum loan amount is ₦${loanConfig.maxAmount.toLocaleString()}`;
        }
        if (!type) next.type = 'Please select a loan type';
        if (purpose.trim().length < MIN_PURPOSE_LENGTH) {
          next.purpose = `Please describe your purpose (at least ${MIN_PURPOSE_LENGTH} characters)`;
        }
      }

      if (target === 2) {
        if (address.trim().length < 5) next.address = 'Your address is required';
        if (bankName.trim().length < 2) next.bank_name = 'Your bank is required';
        if (bankAccount.trim().length < 10) {
          next.bank_account = 'Enter a valid 10-digit account number';
        }
        if (phone.trim().length < 7) next.phone = 'A phone number is required';
      }

      if (target === 3 && loanDetails.installments < 1) {
        next.term = `A ${term}-month term is all grace and leaves no installments`;
      }

      if (target === 4) {
        guarantors.forEach((g, i) => {
          if (
            g.full_name.trim().length < 2 ||
            g.bank_name.trim().length < 2 ||
            g.bank_account.trim().length < 10 ||
            g.phone.trim().length < 7
          ) {
            next[`guarantor_${i}`] = 'All fields are required for this guarantor';
          } else if (!g.signature) {
            next[`guarantor_${i}`] = 'This guarantor still needs to sign';
          }
        });
      }

      if (target === 5 && !borrowerSignature) {
        next.borrower_signature = 'Please sign to submit your application';
      }

      setErrors(next);
      return Object.keys(next).length === 0;
    },
    [
      amount, type, purpose, address, bankName, bankAccount, phone,
      guarantors, borrowerSignature, loanDetails.installments, term,
    ],
  );

  const handleNext = () => {
    if (!validateStep(step)) return;
    if (step < TOTAL_STEPS) setStep((s) => (s + 1) as Step);
  };

  const handleBack = () => {
    if (step > 1) {
      setErrors({});
      setStep((s) => (s - 1) as Step);
      return;
    }
    router.back();
  };

  const handleSubmit = async () => {
    if (!validateStep(5) || !type) return;

    setIsSubmitting(true);
    try {
      // Whole Naira, ≤ 2dp, range-checked — the server validates with strict
      // t.Number and rejects strings / out-of-range values (currency-contract.md).
      await loansApi.apply({
        amount: toApiAmount(parseNairaInput(amount), loanConfig.minAmount),
        purpose: purpose.trim(),
        type,
        tenure_months: term,
        applicant_address: address.trim(),
        applicant_bank_name: bankName.trim(),
        applicant_bank_account: bankAccount.trim(),
        applicant_phone: phone.trim(),
        borrower_signature: borrowerSignature,
        guarantors: guarantors.map((g) => ({
          full_name: g.full_name.trim(),
          bank_name: g.bank_name.trim(),
          bank_account: g.bank_account.trim(),
          phone: g.phone.trim(),
          signature: g.signature,
        })),
      });
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      setShowSuccess(true);
    } catch (err) {
      if (err instanceof LoanApplicationRejection) {
        if (err.reason === 'insufficient_contributions') {
          setEligibilityError(err.data as InsufficientContributionsError);
        } else if (err.reason === 'active_loan_exists') {
          setActiveLoanError(err.data as ActiveLoanExistsError);
        }
      } else {
        setSubmitError(
          err instanceof Error
            ? err.message
            : 'Could not submit your application. Please try again.',
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.replace('/(tabs)/loans');
  };

  const stepTitle = [
    'How much, and what for?',
    'Your details',
    'Terms & repayment plan',
    'Your three guarantors',
    'Review & sign',
  ][step - 1];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      <ScreenHeader title="Loan Application" onBack={handleBack} />

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
          {/* Progress */}
          <View style={styles.stepRow}>
            {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((n) => (
              <View
                key={n}
                style={[
                  styles.stepBar,
                  n <= step ? styles.stepBarActive : undefined,
                ]}
              />
            ))}
          </View>
          <Text style={styles.stepLabel}>
            Step {step} of {TOTAL_STEPS} · {stepTitle}
          </Text>

          <View style={styles.formContainer}>
            {step === 1 && (
              <Animated.View entering={FadeInUp.duration(300)} style={styles.stepContent}>
                <AmountInput value={amount} onChangeText={setAmount} error={errors.amount} />
                <PurposeSelector
                  selectedType={type}
                  onSelectType={(next) => {
                    setType(next);
                    setErrors((e) => ({ ...e, type: undefined }));
                  }}
                />
                {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
                <Input
                  label="Purpose"
                  placeholder="Briefly describe what this loan is for…"
                  value={purpose}
                  onChangeText={(t) => {
                    setPurpose(t);
                    setErrors((e) => ({ ...e, purpose: undefined }));
                  }}
                  multiline
                  numberOfLines={3}
                  error={errors.purpose}
                />
              </Animated.View>
            )}

            {step === 2 && (
              <Animated.View entering={FadeInUp.duration(300)} style={styles.stepContent}>
                <Text style={styles.stepHelp}>
                  These are recorded on your loan bond exactly as entered, so check
                  them even though we have filled them in from your profile.
                </Text>
                <Input
                  label="Business / Home Address"
                  placeholder="Your address"
                  value={address}
                  onChangeText={setAddress}
                  multiline
                  numberOfLines={2}
                  error={errors.address}
                />
                <Input
                  label="Bank Used"
                  placeholder="e.g. First Bank of Nigeria"
                  value={bankName}
                  onChangeText={setBankName}
                  error={errors.bank_name}
                />
                <Input
                  label="Account Number"
                  placeholder="1234567890"
                  value={bankAccount}
                  onChangeText={setBankAccount}
                  keyboardType="numeric"
                  error={errors.bank_account}
                />
                <Input
                  label="Phone Number"
                  placeholder="+234 123 456 7890"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  error={errors.phone}
                />
              </Animated.View>
            )}

            {step === 3 && (
              <Animated.View entering={FadeInUp.duration(300)} style={styles.stepContent}>
                <TermSlider value={term} onValueChange={setTerm} />
                {errors.term && <Text style={styles.errorText}>{errors.term}</Text>}
                <LoanCalculator
                  monthlyPayment={loanDetails.monthlyPayment}
                  totalRepayment={loanDetails.totalRepayment}
                  totalInterest={loanDetails.totalInterest}
                  interestRate={interestRate}
                  onInterestRateChange={setInterestRate}
                />
                <View style={styles.scheduleCard}>
                  <Text style={styles.scheduleTitle}>
                    {loanDetails.graceMonths} month grace, then{' '}
                    {loanDetails.installments} payments
                  </Text>
                  <Text style={styles.stepHelp}>
                    Nothing is due in the first month after your loan is paid out.
                    These dates are indicative until the cooperative approves the loan.
                  </Text>
                  {schedule.map((row) => (
                    <View key={row.installment_no} style={styles.scheduleRow}>
                      <Text style={styles.scheduleMonth}>
                        {row.installment_no}.{' '}
                        {row.due_on.toLocaleDateString(undefined, {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </Text>
                      <Text style={styles.scheduleAmount}>
                        {formatNaira(row.amount)}
                      </Text>
                    </View>
                  ))}
                </View>
              </Animated.View>
            )}

            {step === 4 && (
              <Animated.View entering={FadeInUp.duration(300)} style={styles.stepContent}>
                <Text style={styles.stepHelp}>
                  The cooperative requires three guarantors. Each one signs here,
                  on this device, exactly as they would on the paper form.
                </Text>
                {guarantors.map((g, i) => (
                  <View key={i} style={styles.guarantorCard}>
                    <Text style={styles.guarantorTitle}>Guarantor {i + 1}</Text>
                    <Input
                      label="Full Name"
                      placeholder="Their full name"
                      value={g.full_name}
                      onChangeText={(v) => setGuarantor(i, { full_name: v })}
                      autoCapitalize="words"
                    />
                    <Input
                      label="Name of Bank"
                      placeholder="e.g. Zenith Bank"
                      value={g.bank_name}
                      onChangeText={(v) => setGuarantor(i, { bank_name: v })}
                    />
                    <Input
                      label="Account Number"
                      placeholder="1234567890"
                      value={g.bank_account}
                      onChangeText={(v) => setGuarantor(i, { bank_account: v })}
                      keyboardType="numeric"
                    />
                    <Input
                      label="Phone Number"
                      placeholder="+234 123 456 7890"
                      value={g.phone}
                      onChangeText={(v) => setGuarantor(i, { phone: v })}
                      keyboardType="phone-pad"
                    />
                    <SignaturePad
                      label={`Guarantor ${i + 1} Signature`}
                      value={g.signature || null}
                      onChange={(sig) => setGuarantor(i, { signature: sig ?? '' })}
                    />
                    {errors[`guarantor_${i}`] && (
                      <Text style={styles.errorText}>{errors[`guarantor_${i}`]}</Text>
                    )}
                  </View>
                ))}
              </Animated.View>
            )}

            {step === 5 && (
              <Animated.View entering={FadeInUp.duration(300)} style={styles.stepContent}>
                <View style={styles.reviewCard}>
                  <ReviewRow styles={styles} label="Amount requested" value={formatNaira(parseNairaInput(amount) || 0)} />
                  <ReviewRow styles={styles} label="Purpose" value={purpose.trim()} />
                  <ReviewRow styles={styles} label="Term" value={`${term} months (${loanDetails.graceMonths} grace + ${loanDetails.installments} payments)`} />
                  <ReviewRow styles={styles} label="Each payment" value={formatNaira(loanDetails.monthlyPayment)} />
                  <ReviewRow styles={styles} label="Total repayable" value={formatNaira(loanDetails.totalRepayment)} />
                  <ReviewRow styles={styles} label="Address" value={address.trim()} />
                  <ReviewRow styles={styles} label="Bank" value={`${bankName.trim()} · ${bankAccount.trim()}`} />
                  <ReviewRow styles={styles} label="Guarantors" value={guarantors.map((g) => g.full_name.trim()).join(', ')} />
                </View>

                <Text style={styles.stepHelp}>
                  By signing you agree to use this loan solely for the purpose
                  stated above and to repay it in {loanDetails.installments} equal
                  installments. The amount in words is written onto your loan bond
                  from the figure above.
                </Text>

                <SignaturePad
                  label="Your Signature"
                  value={borrowerSignature || null}
                  onChange={(sig) => {
                    setBorrowerSignature(sig ?? '');
                    setErrors((e) => ({ ...e, borrower_signature: undefined }));
                  }}
                  error={errors.borrower_signature}
                />
              </Animated.View>
            )}

            {/* Navigation */}
            <View style={styles.navRow}>
              {step > 1 && (
                <View style={styles.navButton}>
                  <Button title="Back" onPress={handleBack} variant="tonal" size="lg" fullWidth />
                </View>
              )}
              <View style={styles.navButton}>
                {step < TOTAL_STEPS ? (
                  <Button title="Continue" onPress={handleNext} variant="primary" size="lg" fullWidth />
                ) : isSubmitting ? (
                  <View style={[styles.submitButton, styles.submitButtonDisabled]}>
                    <ActivityIndicator color={colors.onPrimary} />
                  </View>
                ) : (
                  <Button
                    title="Submit Application"
                    onPress={handleSubmit}
                    variant="primary"
                    size="lg"
                    icon="send"
                    iconPosition="left"
                    fullWidth
                  />
                )}
              </View>
            </View>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessModal
        visible={showSuccess}
        onClose={handleSuccessClose}
        title="Loan Request Submitted"
        message="Your application, guarantors and signature have been received. The Secretary and President will review it."
      />

      <InfoModal
        visible={submitError !== null}
        onClose={() => setSubmitError(null)}
        icon="info"
        iconColor={colors.error}
        title="Application Failed"
        message={submitError ?? ''}
        primaryButtonText="Close"
        onPrimaryPress={() => setSubmitError(null)}
      />

      <InfoModal
        visible={eligibilityError !== null}
        onClose={() => setEligibilityError(null)}
        icon="info"
        iconColor={colors.warning}
        title="Not Eligible Yet"
        message={
          eligibilityError
            ? `You need ${eligibilityError.eligibility.required_count} verified contributions to apply. You have ${eligibilityError.eligibility.verified_count} — ${eligibilityError.eligibility.short_by} to go.`
            : ''
        }
        primaryButtonText="Close"
        onPrimaryPress={() => setEligibilityError(null)}
      />

      <InfoModal
        visible={activeLoanError !== null}
        onClose={() => setActiveLoanError(null)}
        icon="info"
        iconColor={colors.warning}
        title="You Already Have a Loan"
        message="You can only hold one active loan at a time. Please finish repaying your current loan before applying again."
        primaryButtonText="Close"
        onPrimaryPress={() => setActiveLoanError(null)}
      />
    </SafeAreaView>
  );
}

/** One label/value line on the review step. */
function ReviewRow({
  label,
  value,
  styles,
}: {
  label: string;
  value: string;
  styles: ReturnType<typeof getStyles>;
}) {
  return (
    <View style={styles.reviewRow}>
      <Text style={styles.reviewLabel}>{label}</Text>
      <Text style={styles.reviewValue}>{value || '—'}</Text>
    </View>
  );
}

const getStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
    },
    heroContent: {
      zIndex: 1,
    },
    heroSubtitle: {
      ...typography.styles.sectionLabel,
      color: `${colors.onPrimary}80`,
      marginBottom: theme.spacing.xs,
    },
    heroTitle: {
      ...typography.styles.displayLarge,
      fontSize: typography.size['2xl'],
      lineHeight: 30,
      color: colors.onPrimary,
      marginBottom: 4,
    },
    heroDescription: {
      ...typography.styles.bodyText,
      color: `${colors.onPrimary}90`,
    },
    watermarkContainer: {
      position: 'absolute',
      bottom: -24,
      right: -24,
      zIndex: 0,
    },
    formContainer: {
      gap: theme.spacing.lg,
    },
    errorText: {
      ...typography.styles.bodySmall,
      fontSize: typography.size.xs,
      color: colors.error,
      marginTop: theme.spacing.xs,
    },
    submitButton: {
      backgroundColor: colors.primary,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
    },
    submitButtonDisabled: {
      opacity: 0.7,
    },
    complianceContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.base,
      backgroundColor: colors.surfaceContainerLow,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginTop: theme.spacing.lg,
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
      ...typography.styles.label,
      fontSize: typography.size.xs,
      color: colors.onSurface,
      marginBottom: 4,
    },
    complianceText: {
      ...typography.styles.bodySmall,
      fontSize: typography.size.xs - 1,
      color: colors.onSurfaceVariant,
      lineHeight: 18,
    },
    bottomPadding: {
      height: 40,
    },

    // --- Multi-step flow (Parts A, B and the signature) ---
    stepRow: {
      flexDirection: 'row',
      gap: 6,
      marginBottom: 10,
    },
    stepBar: {
      flex: 1,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.surfaceContainer,
    },
    stepBarActive: {
      backgroundColor: colors.primary,
    },
    stepLabel: {
      ...typography.styles.bodySmall,
      fontSize: typography.size.xs,
      color: colors.onSurfaceVariant,
      marginBottom: 16,
    },
    stepContent: {
      gap: 16,
    },
    stepHelp: {
      ...typography.styles.bodySmall,
      fontSize: typography.size.xs,
      color: colors.onSurfaceVariant,
      lineHeight: 18,
    },
    scheduleCard: {
      backgroundColor: colors.surfaceContainerLow,
      borderRadius: 16,
      padding: 16,
      gap: 8,
    },
    scheduleTitle: {
      ...typography.styles.label,
      fontSize: typography.size.sm,
      color: colors.onSurface,
    },
    scheduleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 4,
    },
    scheduleMonth: {
      ...typography.styles.bodySmall,
      fontSize: typography.size.xs,
      color: colors.onSurfaceVariant,
      flex: 1,
    },
    scheduleAmount: {
      ...typography.styles.label,
      fontSize: typography.size.xs,
      color: colors.onSurface,
    },
    guarantorCard: {
      backgroundColor: colors.surfaceContainerLow,
      borderRadius: 16,
      padding: 16,
      gap: 12,
    },
    guarantorTitle: {
      ...typography.styles.label,
      fontSize: typography.size.sm,
      color: colors.onSurface,
    },
    reviewCard: {
      backgroundColor: colors.surfaceContainerLow,
      borderRadius: 16,
      padding: 16,
      gap: 10,
    },
    reviewRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    reviewLabel: {
      ...typography.styles.bodySmall,
      fontSize: typography.size.xs,
      color: colors.onSurfaceVariant,
      flex: 1,
    },
    reviewValue: {
      ...typography.styles.label,
      fontSize: typography.size.xs,
      color: colors.onSurface,
      flex: 1.4,
      textAlign: 'right',
    },
    navRow: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 8,
    },
    navButton: {
      flex: 1,
      minWidth: 0,
    },
  });
