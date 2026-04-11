import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Button } from "@/components/common/Button";
import { SecurityBadge } from "@/components/auth/SecurityBadge";
import { HeroSection } from "@/components/auth/HeroSection";
import { useTheme } from "@/contexts/ThemeContext";
import type { lightColors } from "@/contexts/ThemeContext";
import { theme } from "@/styles/theme";

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors);

  const handleCreateAccount = () => {
    router.push("/sign-up");
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
          subtitle="The institutional ledger for your cooperative digital archive and assets."
          height={620}
          imageSource={require("@/assets/images/auth/hero-welcome.jpg")}
        />

        {/* Main Content */}
        <View style={[styles.content, { paddingBottom: insets.bottom }]}>
          {/* Primary Actions */}
          <View style={styles.actions}>
            <Button
              title="Create Account"
              onPress={handleCreateAccount}
              variant="primary"
              size="lg"
              fullWidth
              icon="arrow.right"
            />
            <Button
              title="Sign In"
              onPress={handleSignIn}
              variant="outlined"
              size="lg"
              fullWidth
            />
          </View>

          {/* Terms & Privacy */}
          <View style={styles.terms}>
            <Text style={styles.termsText}>
              By continuing, you agree to our{" "}
              <Text style={styles.termsLink} onPress={() => {}}>
                Terms of Service
              </Text>
              {" & "}
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
    actions: {
      gap: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    terms: {
      paddingHorizontal: theme.spacing.base,
    },
    termsText: {
      fontFamily: theme.typography.fontFamily.label,
      fontSize: theme.typography.size.xs,
      fontWeight: theme.typography.fontWeight.semibold as any,
      color: colors.onSurfaceVariant,
      textAlign: "center",
      textTransform: "uppercase",
      letterSpacing: theme.typography.letterSpacing.wider,
      lineHeight: theme.typography.size.xs * 1.6,
    },
    termsLink: {
      color: colors.primary,
      textDecorationLine: "underline",
    },
  });
