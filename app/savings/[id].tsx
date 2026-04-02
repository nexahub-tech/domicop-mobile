import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';
import type { lightColors } from '@/contexts/ThemeContext';
import { theme } from '@/styles/theme';
import { typography } from '@/constants/typography';
import { TransactionDetailCard } from '@/components/savings/TransactionDetailCard';
import { mockSavingsTransactions, formatCurrencyNoSign } from '@/data/mockData';
import { downloadReceipt, shareReceipt } from '@/utils/receiptGenerator';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function TransactionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors, isDarkMode } = useTheme();
  const styles = createStyles(colors);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const transaction = mockSavingsTransactions.find((t) => t.id === id);

  if (!transaction) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: colors.onSurface }}>Transaction not found</Text>
      </SafeAreaView>
    );
  }

  const isContribution = transaction.amount > 0;
  const amount = Math.abs(transaction.amount);

  const handleBack = () => {
    router.back();
  };

  const handleDownloadReceipt = async () => {
    try {
      setIsDownloading(true);
      await downloadReceipt(transaction);
      setIsDownloading(false);
      Alert.alert('Receipt Downloaded', 'Your receipt has been saved successfully.', [{ text: 'OK' }]);
    } catch {
      setIsDownloading(false);
      Alert.alert('Error', 'Failed to download receipt. Please try again.');
    }
  };

  const handleShareReceipt = async () => {
    try {
      setIsSharing(true);
      const receiptUri = await downloadReceipt(transaction);
      await shareReceipt(receiptUri);
      setIsSharing(false);
    } catch (error) {
      setIsSharing(false);
      console.error('Error sharing receipt:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>Transaction Details</Text>
          <View style={styles.backButton} />
        </View>
      </Animated.View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.amountSection}>
          <View style={styles.watermarkContainer}>
            <MaterialIcons name="account-balance" size={140} color={`${colors.primary}08`} />
          </View>
          <View style={styles.iconContainer}>
            <MaterialIcons name={isContribution ? 'savings' : 'payments'} size={28} color={colors.primary} />
          </View>
          <Text style={styles.amountLabel}>{isContribution ? 'Contribution Amount' : 'Withdrawal Amount'}</Text>
          <Text style={styles.amountValue}>{isContribution ? '+' : '-'}₦{formatCurrencyNoSign(amount)}</Text>
          <View style={styles.statusBadge}>
            <MaterialIcons name="check-circle" size={14} color="#166534" />
            <Text style={styles.statusText}>COMPLETED</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(400)}>
          <Text style={styles.sectionTitle}>General Information</Text>
          <View style={styles.detailsContainer}>
            <TransactionDetailCard icon="fingerprint" label="Transaction ID" value={transaction.id} showCopy />
            <TransactionDetailCard icon="calendar-today" label="Date & Time" value={`${transaction.date} • ${transaction.time}`} />
            <TransactionDetailCard icon="account-tree" label="Transaction Type" value={transaction.type.replace('_', ' ').toUpperCase()} />
            <TransactionDetailCard icon="category" label="Category" value={transaction.category.toUpperCase()} />
            <TransactionDetailCard icon="info" label="Status" value={transaction.status.toUpperCase()} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).duration(400)} style={styles.actionsContainer}>
          <AnimatedTouchable onPress={handleDownloadReceipt} disabled={isDownloading} style={styles.actionButton} activeOpacity={0.8}>
            {isDownloading ? (
              <ActivityIndicator size="small" color={colors.onSurface} />
            ) : (
              <>
                <MaterialIcons name="download" size={20} color={colors.onSurface} />
                <Text style={styles.actionButtonText}>Download Receipt</Text>
              </>
            )}
          </AnimatedTouchable>

          <AnimatedTouchable onPress={handleShareReceipt} disabled={isSharing} style={styles.actionButton} activeOpacity={0.8}>
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

const createStyles = (colors: typeof lightColors) => StyleSheet.create({
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  amountSection: {
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius['2xl'],
    padding: theme.spacing['2xl'],
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: `${colors.outline}30`,
    overflow: 'hidden',
    position: 'relative',
  },
  watermarkContainer: {
    position: 'absolute',
    bottom: -20,
    right: -20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.base,
  },
  amountLabel: {
    fontFamily: typography.fontFamily.label,
    fontSize: typography.size.xs,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.secondary,
    textTransform: 'uppercase',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#dcfce7',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  statusText: {
    fontFamily: typography.fontFamily.label,
    fontSize: typography.size.xs - 2,
    fontWeight: typography.fontWeight.bold as any,
    color: '#166534',
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
    flexDirection: 'row',
    gap: theme.spacing.base,
    marginTop: theme.spacing.lg,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bottomPadding: {
    height: 40,
  },
});
