import React from 'react';
import { ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/styles/theme';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatusCards } from '@/components/dashboard/StatusCards';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { TransactionList, RecentTransaction } from '@/components/dashboard/TransactionList';
import { useTheme } from '@/contexts/ThemeContext';
import { useSavingsSummary } from '@/hooks/useSavingsSummary';
import { useContributions } from '@/hooks/useContributions';

const formatMonth = (monthStr: string): string => {
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function DashboardScreen() {
  const { colors, isDarkMode } = useTheme();
  const {
    summary,
    isLoading: isSummaryLoading,
    isRefreshing: isSummaryRefreshing,
    isOffline,
    error: summaryError,
    refresh: refreshSummary,
  } = useSavingsSummary();

  const {
    contributions,
    isLoading: isContributionsLoading,
    isRefreshing: isContributionsRefreshing,
    error: contributionsError,
    refresh: refreshContributions,
  } = useContributions();

  const recentTransactions: RecentTransaction[] = contributions.slice(0, 5).map((c) => ({
    id: c.id,
    type: 'contribution',
    category: 'savings' as const,
    title: formatMonth(c.month),
    amount: c.amount,
    date: c.created_at,
    status: c.status,
  }));

  const isLoading = isSummaryLoading && isContributionsLoading;
  const isRefreshing = isSummaryRefreshing || isContributionsRefreshing;
  const error = summaryError || contributionsError;

  const onRefresh = React.useCallback(() => {
    Promise.all([refreshSummary(), refreshContributions()]);
  }, [refreshSummary, refreshContributions]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      {/* Fixed Header */}
      <DashboardHeader />

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Status Cards - Total Saved & Loan Balance */}
        <StatusCards />

        {/* Quick Actions - Deposit & Apply */}
        <QuickActions />

        {/* Recent Transactions */}
        <TransactionList
          transactions={recentTransactions}
          isLoading={isLoading}
          isOffline={isOffline}
          error={error}
          onRetry={onRefresh}
        />
        
        {/* Bottom padding for tab bar */}
        <SafeAreaView edges={['bottom']} style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: theme.spacing.base,
  },
  bottomPadding: {
    height: 100,
  },
});