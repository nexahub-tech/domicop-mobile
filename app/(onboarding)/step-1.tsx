import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { useTheme, lightColors } from "@/contexts/ThemeContext";
import { theme } from "@/styles/theme";
import { typography } from "@/constants/typography";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function OnboardingStep1Screen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const styles = createStyles(colors);

  const handleSkip = () => {
    router.replace("/welcome");
  };

  const handleNext = () => {
    router.push("/(onboarding)/step-2");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Header with Skip Button */}
      <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
        <View style={styles.skipPlaceholder} />
        <TouchableOpacity
          onPress={handleSkip}
          style={styles.skipButton}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Visual Section */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(400)}
          style={styles.visualContainer}
        >
          {/* Decorative Blur Background */}
          <View style={styles.decorativeBlur} />

          {/* Ghost Icon */}
          <View style={styles.ghostIconContainer}>
            <MaterialIcons name="savings" size={160} color={`${colors.primary}08`} />
          </View>

          {/* Main Illustration Container */}
          <View style={styles.illustrationContainer}>
            {/* Glass Card */}
            <View style={styles.glassCard}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80",
                }}
                style={styles.illustration}
                resizeMode="contain"
              />

              {/* Trend Indicator */}
              <View style={styles.trendIndicator}>
                <MaterialIcons name="trending-up" size={16} color={colors.onPrimary} />
                <Text style={styles.trendText}>Growing</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Text Content */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(400)}
          style={styles.textContainer}
        >
          <Text style={styles.title}>Grow Your Savings</Text>
          <Text style={styles.description}>
            Start your financial journey with automatic contributions and watch your
            savings grow with competitive interest rates.
          </Text>
        </Animated.View>
      </View>

      {/* Footer with Progress and CTA */}
      <Animated.View entering={FadeInUp.delay(300).duration(400)} style={styles.footer}>
        {/* Progress Dots */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaText}>Next</Text>
          <MaterialIcons name="arrow-forward" size={20} color={colors.onPrimary} />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const createStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
    },
    skipPlaceholder: {
      width: 60,
    },
    skipButton: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.base,
    },
    skipText: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.base,
      fontWeight: typography.fontWeight.semibold as any,
      color: colors.onSurfaceVariant,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: theme.spacing.lg,
    },
    visualContainer: {
      width: SCREEN_WIDTH - theme.spacing.lg * 2,
      aspectRatio: 1,
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.xl,
      position: "relative",
    },
    decorativeBlur: {
      position: "absolute",
      width: 300,
      height: 300,
      borderRadius: 150,
      backgroundColor: `${colors.primary}08`,
      top: 20,
      right: -50,
    },
    ghostIconContainer: {
      position: "absolute",
      top: 0,
      left: -20,
      zIndex: 0,
    },
    illustrationContainer: {
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1,
    },
    glassCard: {
      width: "80%",
      aspectRatio: 1,
      backgroundColor: `${colors.surface}CC`,
      borderRadius: theme.borderRadius["2xl"],
      padding: theme.spacing.lg,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.1,
      shadowRadius: 24,
      elevation: 8,
    },
    illustration: {
      width: "100%",
      height: "70%",
      borderRadius: theme.borderRadius.xl,
    },
    trendIndicator: {
      position: "absolute",
      bottom: theme.spacing.lg,
      right: theme.spacing.lg,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.primary,
      borderRadius: theme.borderRadius.full,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.base,
      gap: 4,
    },
    trendText: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.xs,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onPrimary,
    },
    textContainer: {
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
    },
    title: {
      fontFamily: typography.fontFamily.headline,
      fontSize: theme.spacing["2xl"],
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurface,
      textAlign: "center",
      marginBottom: theme.spacing.base,
    },
    description: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.base,
      color: colors.onSurfaceVariant,
      textAlign: "center",
      lineHeight: theme.typography.lineHeight.relaxed * typography.size.base,
      maxWidth: 320,
    },
    footer: {
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
    progressContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
    },
    progressDot: {
      height: 6,
      width: 16,
      borderRadius: 3,
      backgroundColor: colors.surfaceContainerHigh,
    },
    progressDotActive: {
      width: 32,
      backgroundColor: colors.primary,
    },
    ctaButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: theme.spacing.lg,
      gap: theme.spacing.sm,
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    ctaText: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size.base,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onPrimary,
    },
  });
