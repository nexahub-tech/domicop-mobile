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

  const recentTransactions: RecentTransaction[] = (summary?.recent_transactions || []).map((t) => ({
    id: t.id,
    type: t.type,
    category: t.category,
    title: t.title || t.type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    amount: t.amount,
    date: t.date,
    status: t.status,
  }));

  const isRefreshing = isSummaryRefreshing;

  const onRefresh = React.useCallback(() => {
    refreshSummary();
  }, [refreshSummary]);

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
          isLoading={isSummaryLoading}
          isOffline={isOffline}
          error={summaryError}
          onRetry={refreshSummary}
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