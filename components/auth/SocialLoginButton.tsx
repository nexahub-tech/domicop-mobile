import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, Image, View } from "react-native";
import { useTheme, lightColors } from "@/contexts/ThemeContext";
import { theme } from "@/styles/theme";

type SocialLoginColors = typeof lightColors;

interface SocialLoginButtonProps {
  onPress: () => void;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  onPress,
  fullWidth = false,
  style,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.container, fullWidth && styles.fullWidth, style]}
    >
      <View style={styles.content}>
        <Image
          source={require("@/assets/images/logos/google-logo.png")}
          style={styles.icon}
          resizeMode="contain"
        />
        <Text style={[styles.label, { color: colors.onSurface }]}>Google</Text>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (colors: SocialLoginColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surfaceContainerLow,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.xl,
      minHeight: 48,
      ...theme.shadows.sm,
    },
    fullWidth: {
      width: "100%",
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    icon: {
      width: 20,
      height: 20,
      marginRight: theme.spacing.md,
    },
    label: {
      fontFamily: theme.typography.fontFamily.body,
      fontSize: theme.typography.size.sm,
      fontWeight: theme.typography.fontWeight.semibold as any,
    },
  });

export default SocialLoginButton;
