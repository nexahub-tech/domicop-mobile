import React from 'react';
import { ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/styles/theme';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatusCards } from '@/components/dashboard/StatusCards';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { TransactionList } from '@/components/dashboard/TransactionList';
import { useTheme } from '@/contexts/ThemeContext';

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = React.useState(false);
  const { colors, isDarkMode } = useTheme();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

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
            refreshing={refreshing}
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
        <TransactionList />
        
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
    height: 100, // Extra space for tab bar
  },
});
