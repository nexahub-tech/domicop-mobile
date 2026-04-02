import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { useTheme, lightColors } from "@/contexts/ThemeContext";
import { theme } from "@/styles/theme";
import { typography } from "@/constants/typography";
import { mockUser, getInitials } from "@/data/mockData";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const createStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.base,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    leftSection: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    avatarContainer: {
      marginRight: theme.spacing.base,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surfaceContainer,
      borderWidth: 2,
      borderColor: `${colors.primary}10`,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    avatarText: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size.md,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.primary,
    },
    textContainer: {
      marginLeft: theme.spacing.xs,
    },
    welcomeText: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.xs,
      fontWeight: typography.fontWeight.medium as any,
      color: colors.onSurfaceVariant,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      lineHeight: 16,
    },
    nameText: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size.base,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurface,
      lineHeight: 20,
    },
    notificationButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
      backgroundColor: colors.surface,
    },
  });

export const DashboardHeader: React.FC = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const initials = getInitials(mockUser.name);

  const handleNotificationsPress = () => {
    router.push("/notifications");
  };

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {/* Avatar with Initials */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </View>

          {/* Welcome Text */}
          <View style={styles.textContainer}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.nameText}>{mockUser.name}</Text>
          </View>
        </View>

        {/* Notifications Button */}
        <AnimatedTouchable
          onPress={handleNotificationsPress}
          style={styles.notificationButton}
          activeOpacity={0.7}
        >
          <MaterialIcons name="notifications" size={24} color={colors.onSurfaceVariant} />
        </AnimatedTouchable>
      </View>
    </Animated.View>
  );
};

export default DashboardHeader;
