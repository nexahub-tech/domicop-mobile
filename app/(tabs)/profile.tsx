import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, StyleSheet, RefreshControl } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SettingsSection } from "@/components/profile/SettingsSection";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { useTheme } from "@/contexts/ThemeContext";
import { signUp } from "@/lib/api/sign-up.api";
import type { Profile } from "@/lib/types/sign-up";

export default function ProfileScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { colors, isDarkMode } = useTheme();

  // Modal states
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      const data = await signUp.getProfile();
      setProfile(data);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  }, [loadProfile]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    try {
      await signUp.logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    router.replace("/sign-in");
  };

  const confirmDeleteAccount = () => {
    setShowDeleteModal(false);
    setTimeout(() => {
      router.replace("/sign-in");
    }, 500);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Fixed Header */}
      <ProfileHeader profile={profile} isLoading={isLoading} />

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
        {/* Settings Sections */}
        <SettingsSection onLogout={handleLogout} onDeleteAccount={handleDeleteAccount} />

        {/* Bottom padding for tab bar */}
        <SafeAreaView edges={["bottom"]} style={styles.bottomPadding} />
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        visible={showLogoutModal}
        title="Log Out"
        message="Are you sure you want to log out? You'll need to sign in again to access your account."
        confirmText="Log Out"
        cancelText="Cancel"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
        isDestructive={false}
      />

      {/* Delete Account Confirmation Modal */}
      <ConfirmationModal
        visible={showDeleteModal}
        title="Delete Account"
        message="This action cannot be undone. All your data, including loans, savings, and transaction history will be permanently deleted."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
        isDestructive={true}
      />
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
    paddingTop: 0,
  },
  bottomPadding: {
    height: 100, // Extra space for tab bar
  },
});
