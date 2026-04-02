import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { HeroSection } from "@/components/auth/HeroSection";
import { BackButton } from "@/components/auth/BackButton";
import { SecurityBadge } from "@/components/auth/SecurityBadge";
import { FormCard } from "@/components/auth/FormCard";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { KeyboardAwareWrapper } from "@/components/auth/KeyboardAwareWrapper";
import { useTheme } from "@/contexts/ThemeContext";
import type { lightColors } from "@/contexts/ThemeContext";
import { theme } from "@/styles/theme";

export default function SignUpScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode] = useState("+1");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    console.log("Sign Up", { email, phone: `${countryCode} ${phone}`, password });
  };

  const handleLogIn = () => {
    router.push("/sign-in");
  };

  return (
    <View style={styles.container}>
      <View style={[styles.backButtonContainer, { top: insets.top + theme.spacing.lg }]}>
        <BackButton onPress={() => router.back()} />
      </View>

      <SecurityBadge
        style={[styles.securityBadge, { top: insets.top + theme.spacing.lg }]}
      />

      <KeyboardAwareWrapper style={styles.wrapper}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <HeroSection
            title="Join DOMICOP Today"
            subtitle="Create your secure institutional vault account"
            showLogo={false}
            height={280}
            imageSource={require("../../assets/images/auth/hero-auth.jpg")}
          />

          <View style={styles.content}>
            <FormCard overlap>
              <Input
                label="Email Address"
                placeholder="name@institution.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <View style={styles.phoneContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.phoneRow}>
                  <TouchableOpacity style={styles.countryCode}>
                    <Text style={styles.countryCodeText}>{countryCode}</Text>
                  </TouchableOpacity>
                  <Input
                    placeholder="(555) 123-4567"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    style={styles.phoneInput}
                  />
                </View>
              </View>

              <View>
                <Input
                  label="Password"
                  placeholder="Create a strong password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                <PasswordStrength password={password} />
              </View>

              <Button
                title="Sign Up"
                onPress={handleSignUp}
                variant="primary"
                size="lg"
                fullWidth
                icon="arrow.right"
              />

              <Text style={styles.termsText}>
                By signing up, you agree to our{" "}
                <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </FormCard>

            <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
              <View style={styles.footerDivider} />
              <TouchableOpacity onPress={handleLogIn}>
                <Text style={styles.footerText}>
                  Already have an account? <Text style={styles.footerLink}>Log In</Text>
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
    phoneContainer: {
      width: "100%",
    },
    label: {
      fontFamily: theme.typography.fontFamily.label,
      fontSize: theme.typography.size.xs,
      fontWeight: theme.typography.fontWeight.bold as any,
      color: colors.onSurfaceVariant,
      textTransform: "uppercase",
      letterSpacing: theme.typography.letterSpacing.wider,
      marginBottom: theme.spacing.md,
      marginLeft: theme.spacing.base,
    },
    phoneRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },
    countryCode: {
      height: 56,
      backgroundColor: colors.surfaceContainerLow,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: theme.spacing.lg,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "transparent",
    },
    countryCodeText: {
      fontFamily: theme.typography.fontFamily.body,
      fontSize: theme.typography.size.md,
      fontWeight: theme.typography.fontWeight.medium as any,
      color: colors.onSurface,
    },
    phoneInput: {
      flex: 1,
    },
    termsText: {
      fontFamily: theme.typography.fontFamily.body,
      fontSize: theme.typography.size.xs,
      color: colors.onSurfaceVariant,
      textAlign: "center",
      lineHeight: theme.typography.size.xs * theme.typography.lineHeight.normal,
    },
    termsLink: {
      color: colors.primary,
      fontWeight: theme.typography.fontWeight.semibold as any,
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
