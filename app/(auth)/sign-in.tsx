import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { HeroSection } from "@/components/auth/HeroSection";
import { BackButton } from "@/components/auth/BackButton";
import { SecurityBadge } from "@/components/auth/SecurityBadge";
import { FormCard } from "@/components/auth/FormCard";
import { SocialLoginButton } from "@/components/auth/SocialLoginButton";
import { Checkbox } from "@/components/forms/Checkbox";
import { KeyboardAwareWrapper } from "@/components/auth/KeyboardAwareWrapper";
import { useTheme } from "@/contexts/ThemeContext";
import type { lightColors } from "@/contexts/ThemeContext";
import { theme } from "@/styles/theme";

export default function SignInScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignIn = () => {
    // Navigate to home dashboard
    router.replace("/(tabs)");
  };

  const handleGoogleSignIn = () => {
    // Navigate to home dashboard
    router.replace("/(tabs)");
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  const handleJoinArchive = () => {
    router.push("/sign-up");
  };

  return (
    <View style={styles.container}>
      {/* Back Button - positioned with top inset */}
      <View style={[styles.backButtonContainer, { top: insets.top + theme.spacing.lg }]}>
        <BackButton onPress={() => router.back()} />
      </View>

      {/* Security Badge - positioned with top inset */}
      <SecurityBadge
        style={[styles.securityBadge, { top: insets.top + theme.spacing.lg }]}
      />

      <KeyboardAwareWrapper style={styles.wrapper}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <HeroSection
            title="Welcome Back! 👋"
            subtitle="Access your institutional ledger and vault"
            showLogo={false}
            height={280}
            imageSource={require("@/assets/images/auth/hero-auth.jpg")}
          />

          {/* Main Content */}
          <View style={styles.content}>
            <FormCard overlap spacing="lg">
              {/* Email Input */}
              <Input
                label="Email Address"
                placeholder="name@institution.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              {/* Password Input */}
              <Input
                label="Password"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              {/* Remember Me & Forgot Password */}
              <View style={styles.rememberForgot}>
                <Checkbox
                  checked={rememberMe}
                  onChange={setRememberMe}
                  label="Remember me"
                  labelStyle={styles.rememberMeText}
                />

                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Sign In Button */}
              <Button
                title="Sign In"
                onPress={handleSignIn}
                variant="primary"
                size="lg"
                fullWidth
                icon="arrow.right"
              />

              {/* Social Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Google Login - Single centered button */}
              <View style={styles.socialContainer}>
                <SocialLoginButton
                  onPress={handleGoogleSignIn}
                  style={styles.socialButton}
                />
              </View>
            </FormCard>

            {/* Footer */}
            <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
              <View style={styles.footerDivider} />
              <TouchableOpacity onPress={handleJoinArchive}>
                <Text style={styles.footerText}>
                  Don&apos;t have an account?{" "}
                  <Text style={styles.footerLink}>Join Archive</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAwareWrapper>
    </View>
  );
}

const createStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    wrapper: {
      flex: 1,
    },
    backButtonContainer: {
      position: "absolute",
      left: theme.spacing.lg,
      zIndex: 20,
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
    rememberForgot: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    rememberMeText: {
      fontFamily: theme.typography.fontFamily.label,
      fontSize: theme.typography.size.xs,
      fontWeight: theme.typography.fontWeight.semibold as any,
      color: colors.onSurfaceVariant,
      textTransform: "uppercase",
      letterSpacing: theme.typography.letterSpacing.wider,
    },
    forgotPassword: {
      fontFamily: theme.typography.fontFamily.label,
      fontSize: theme.typography.size.xs,
      fontWeight: theme.typography.fontWeight.bold as any,
      color: colors.primary,
      textTransform: "uppercase",
      letterSpacing: theme.typography.letterSpacing.wider,
    },
    divider: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: theme.spacing.md,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.outlineVariant,
    },
    dividerText: {
      fontFamily: theme.typography.fontFamily.label,
      fontSize: theme.typography.size.xs,
      fontWeight: theme.typography.fontWeight.bold as any,
      color: colors.onSurfaceVariant,
      textTransform: "uppercase",
      letterSpacing: theme.typography.letterSpacing.widest,
      marginHorizontal: theme.spacing.md,
    },
    socialContainer: {
      alignItems: "center",
    },
    socialButton: {
      width: "100%",
    },
    footer: {
      marginTop: theme.spacing.xl,
      alignItems: "center",
    },
    footerDivider: {
      width: "100%",
      height: 1,
      backgroundColor: colors.outlineVariant,
      marginBottom: theme.spacing.xl,
    },
    footerText: {
      fontFamily: theme.typography.fontFamily.body,
      fontSize: theme.typography.size.sm,
      color: colors.onSurfaceVariant,
    },
    footerLink: {
      color: colors.primary,
      fontWeight: theme.typography.fontWeight.bold as any,
    },
  });
