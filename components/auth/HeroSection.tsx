import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ViewStyle,
  ImageSourcePropType,
} from "react-native";
import { SymbolView, SFSymbol } from "expo-symbols";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme, lightColors } from "@/contexts/ThemeContext";
import { theme } from "@/styles/theme";

type HeroSectionColors = typeof lightColors;

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  showLogo?: boolean;
  icon?: SFSymbol;
  iconBackground?: boolean;
  height?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
  imageSource?: ImageSourcePropType;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  showLogo = true,
  icon,
  iconBackground = true,
  height = 300,
  style,
  children,
  imageSource,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={[styles.container, { height }, style]}>
      {/* Background Image with Overlay */}
      <ImageBackground
        source={imageSource || require("../../assets/images/auth/hero-auth.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Primary Color Overlay at 5% opacity */}
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: `${colors.primary}0D` },
          ]}
        />

        {/* Gradient Overlay */}
        <LinearGradient
          colors={[`${colors.primary}0D`, colors.background]}
          style={styles.gradient}
        />

        {/* Content */}
        <View style={styles.content}>
          {showLogo && (
            <View style={styles.logoContainer}>
              <View style={styles.logoInner}>
                <SymbolView
                  name="building.columns"
                  size={32}
                  tintColor={colors.primary}
                  style={styles.logoIcon}
                />
                <Text style={styles.logoText}>DOMICOP</Text>
              </View>
            </View>
          )}

          {icon && (
            <View
              style={[
                styles.iconContainer,
                iconBackground && styles.iconContainerWithBackground,
              ]}
            >
              <SymbolView name={icon} size={40} tintColor={colors.primary} />
            </View>
          )}

          <Text style={styles.title}>{title}</Text>

          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

          {children}
        </View>

        {/* Bottom Fade */}
        <LinearGradient
          colors={["transparent", colors.background]}
          style={styles.bottomFade}
        />
      </ImageBackground>
    </View>
  );
};

const createStyles = (colors: HeroSectionColors) =>
  StyleSheet.create({
    container: {
      width: "100%",
      overflow: "hidden",
    },
    backgroundImage: {
      flex: 1,
      width: "100%",
    },
    gradient: {
      ...StyleSheet.absoluteFillObject,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: theme.spacing["2xl"],
      paddingTop: theme.spacing["4xl"],
    },
    logoContainer: {
      marginBottom: theme.spacing.xl,
    },
    logoInner: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.xl,
      ...theme.shadows.xl,
    },
    logoIcon: {
      marginRight: theme.spacing.md,
    },
    logoText: {
      fontFamily: theme.typography.fontFamily.headline,
      fontSize: theme.typography.size.lg,
      fontWeight: theme.typography.fontWeight.extrabold as any,
      color: colors.primary,
      letterSpacing: theme.typography.letterSpacing.tight,
    },
    iconContainer: {
      marginBottom: theme.spacing.lg,
    },
    iconContainerWithBackground: {
      backgroundColor: colors.surface,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.xl,
      ...theme.shadows.xl,
    },
    title: {
      fontFamily: theme.typography.fontFamily.headline,
      fontSize: theme.typography.size["2xl"],
      fontWeight: theme.typography.fontWeight.extrabold as any,
      color: colors.onSurface,
      textAlign: "center",
      marginBottom: theme.spacing.md,
      letterSpacing: theme.typography.letterSpacing.tight,
    },
    subtitle: {
      fontFamily: theme.typography.fontFamily.body,
      fontSize: theme.typography.size.base,
      color: colors.onSurfaceVariant,
      textAlign: "center",
      maxWidth: 280,
      lineHeight: theme.typography.size.base * theme.typography.lineHeight.relaxed,
    },
    bottomFade: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 96,
    },
  });
