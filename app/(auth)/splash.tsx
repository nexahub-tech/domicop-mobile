import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "@/components/common/Button";
import { useTheme } from "@/contexts/ThemeContext";
import type { lightColors } from "@/contexts/ThemeContext";
import { theme } from "@/styles/theme";

export default function SplashScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors);

  const handleGetStarted = () => {
    router.push("/welcome");
  };

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[colors.background, colors.background]}
        style={styles.background}
      >
        {/* Decorative Circles */}
        <View style={styles.decorativeCircleTop} />
        <View style={styles.decorativeCircleBottom} />

        {/* Main Content */}
        <View style={styles.content}>
          {/* Logo Section */}
          <View style={styles.logoWrapper}>
            {/* Outer Glow */}
            <View style={styles.glow} />

            {/* Logo Container */}
            <View style={styles.logoContainer}>
              {/* Background Icon */}
              <SymbolView
                name="dollarsign.circle"
                size={80}
                tintColor={`${colors.onPrimary}1A`}
                style={styles.backgroundIcon}
              />
              {/* Main Icon */}
              <SymbolView
                name="building.columns.fill"
                size={48}
                tintColor={colors.onPrimary}
              />
            </View>
          </View>

          {/* Brand Name */}
          <Text style={styles.brandName}>DOMICOP</Text>

          {/* Tagline */}
          <Text style={styles.tagline}>
            The institutional ledger for modern cooperative financial growth.
          </Text>
        </View>

        {/* Bottom Gradient Fade */}
        <LinearGradient
          colors={["transparent", colors.background]}
          style={styles.bottomFade}
        />

        {/* Footer Actions */}
        <View
          style={[styles.footer, { paddingBottom: insets.bottom + theme.spacing["2xl"] }]}
        >
          <Button
            title="Let's Get Started"
            onPress={handleGetStarted}
            variant="primary"
            size="lg"
            fullWidth
            icon="arrow.right"
          />
        </View>
      </LinearGradient>
    </View>
  );
}

const createStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    background: {
      flex: 1,
    },
    decorativeCircleTop: {
      position: "absolute",
      top: -96,
      right: -96,
      width: 384,
      height: 384,
      borderRadius: 192,
      backgroundColor: `${colors.primary}0D`, // 5% opacity
    },
    decorativeCircleBottom: {
      position: "absolute",
      bottom: -96,
      left: -96,
      width: 384,
      height: 384,
      borderRadius: 192,
      backgroundColor: `${colors.primary}14`, // 8% opacity
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: theme.spacing["2xl"],
    },
    logoWrapper: {
      position: "relative",
      marginBottom: theme.spacing.xl,
    },
    glow: {
      position: "absolute",
      inset: 0,
      backgroundColor: colors.cobaltGlow,
      borderRadius: 40,
      transform: [{ scale: 1.1 }],
    },
    logoContainer: {
      width: 112,
      height: 112,
      backgroundColor: colors.primary,
      borderRadius: 32,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      ...theme.shadows.xl,
    },
    backgroundIcon: {
      position: "absolute",
      bottom: -10,
      right: -10,
    },
    brandName: {
      fontFamily: theme.typography.fontFamily.headline,
      fontSize: theme.typography.size["4xl"],
      fontWeight: theme.typography.fontWeight.extrabold as any,
      color: colors.onSurface,
      marginBottom: theme.spacing.md,
      letterSpacing: theme.typography.letterSpacing.tight,
    },
    tagline: {
      fontFamily: theme.typography.fontFamily.body,
      fontSize: theme.typography.size.md,
      fontWeight: theme.typography.fontWeight.medium as any,
      color: colors.secondary,
      textAlign: "center",
      maxWidth: 320,
      lineHeight: theme.typography.size.md * theme.typography.lineHeight.relaxed,
    },
    footer: {
      paddingHorizontal: theme.spacing["2xl"],
      paddingTop: theme.spacing.lg,
    },
    bottomFade: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 120,
    },
  });
