import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Button } from "@/components/common/Button";
import { SecurityBadge } from "@/components/auth/SecurityBadge";
import { HeroSection } from "@/components/auth/HeroSection";
import { useTheme } from "@/contexts/ThemeContext";
import type { lightColors } from "@/contexts/ThemeContext";
import { useRegistrationWindow } from "@/hooks/useRegistrationWindow";
import { theme } from "@/styles/theme";
import { font } from "@/constants/theme";

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors);

  const { isOpen, window: win, isLoading } = useRegistrationWindow();

  // The cooperative only registers members during an intake. Route to the
  // closed screen rather than disabling the button outright — an explanation
  // and a next date are more useful than a dead control.
  const handleCreateAccount = () => {
    router.push(isOpen ? "/sign-up" : "/registration-closed");
  };

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  return (
    <View style={styles.container}>
      {/* Security Badge - positioned with top inset */}
      <SecurityBadge
        style={[styles.securityBadge, { top: insets.top + theme.spacing.lg }]}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <HeroSection
          title="Let's Get Started!"
          subtitle="Born to Dominate"
          height={620}
          imageSource={require("@/assets/images/auth/hero-welcome.jpg")}
        />

        {/* Main Content */}
        <View style={[styles.content, { paddingBottom: insets.bottom }]}>
          {/* Create Account — the one primary CTA */}
          <Button
            title={isLoading ? "Checking registration…" : "Create Account"}
            onPress={handleCreateAccount}
            variant="primary"
            size="lg"
            fullWidth
            icon="arrow-forward"
            disabled={isLoading}
          />

          {!isLoading && (
            <Text style={styles.registrationNote}>
              {isOpen && win
                ? `Registration is open until ${new Date(win.closes_at).toLocaleDateString(undefined, { day: "numeric", month: "long" })}.`
                : "Registration for new members is currently closed."}
            </Text>
          )}

          {/* Sign In as a quiet link row */}
          <View style={styles.signInRow}>
            <Text style={styles.signInText}>Already a member? </Text>
            <Text style={styles.signInLink} onPress={handleSignIn}>
              Sign in
            </Text>
          </View>

          {/* Terms & Privacy */}
          <View style={styles.terms}>
            <Text style={styles.termsText}>
              By continuing, you agree to our{" "}
              <Text style={styles.termsLink} onPress={() => {}}>
                Terms of Service
              </Text>
              {" and "}
              <Text style={styles.termsLink} onPress={() => {}}>
                Privacy Policy
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    securityBadge: {
      position: "absolute",
      right: theme.spacing.lg,
      zIndex: 10,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    content: {
      paddingHorizontal: theme.spacing["2xl"],
      paddingTop: -32,
      paddingBottom: theme.spacing["3xl"],
      maxWidth: 400,
      alignSelf: "center",
      width: "100%",
    },
    registrationNote: {
      fontFamily: font("body", "regular"),
      fontSize: theme.typography.size.sm,
      color: colors.onSurfaceVariant,
      textAlign: "center",
      marginTop: theme.spacing.base,
    },
    signInRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: theme.spacing.xl,
      paddingVertical: theme.spacing.sm,
    },
    signInText: {
      fontFamily: font("body", "regular"),
      fontSize: theme.typography.size.base,
      color: colors.onSurfaceVariant,
    },
    signInLink: {
      fontFamily: font("body", "bold"),
      fontSize: theme.typography.size.base,
      color: colors.primaryBright,
    },
    terms: {
      paddingHorizontal: theme.spacing.base,
      marginTop: theme.spacing["2xl"],
    },
    termsText: {
      fontFamily: font("body", "regular"),
      fontSize: theme.typography.size.xs,
      color: colors.onSurfaceVariant,
      textAlign: "center",
      lineHeight: theme.typography.size.xs * 1.6,
    },
    termsLink: {
      color: colors.primaryBright,
      textDecorationLine: "underline",
    },
  });
