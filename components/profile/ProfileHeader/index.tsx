import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";
import { useTheme, lightColors } from "@/contexts/ThemeContext";
import { theme } from "@/styles/theme";
import { typography } from "@/constants/typography";
import { mockUser, getInitials } from "@/data/mockData";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const createStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
    },
    navBar: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.base,
    },
    navContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    backButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
    },
    navTitle: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size.lg,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurface,
      flex: 1,
      textAlign: "center",
    },
    profileContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing["2xl"],
    },
    avatarSection: {
      alignItems: "center",
      marginBottom: theme.spacing.lg,
    },
    avatarContainer: {
      position: "relative",
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.primary,
      borderWidth: 4,
      borderColor: colors.surface,
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size["3xl"],
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onPrimary,
    },
    editIconContainer: {
      position: "absolute",
      bottom: 4,
      right: 4,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      borderWidth: 2,
      borderColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
    },
    infoContainer: {
      alignItems: "center",
    },
    name: {
      fontFamily: typography.fontFamily.headline,
      fontSize: typography.size["2xl"],
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurface,
      marginBottom: theme.spacing.base,
    },
    badgeContainer: {
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    memberBadge: {
      backgroundColor: `${colors.primary}10`,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
    },
    memberBadgeText: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.sm,
      fontWeight: typography.fontWeight.medium as any,
      color: colors.primary,
    },
    memberSince: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.size.sm,
      color: colors.onSurfaceVariant,
    },
  });

export const ProfileHeader: React.FC = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const initials = getInitials(mockUser.name);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleEditAvatarPress = () => {
    // Handle avatar edit
    console.log("Edit avatar pressed");
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.navBar}>
        <View style={styles.navContent}>
          <View style={styles.backButton} />
          <Text style={styles.navTitle}>Profile</Text>
          <View style={styles.backButton} />
        </View>
      </View>

      {/* Profile Info */}
      <View style={styles.profileContainer}>
        <View style={styles.avatarSection}>
          <AnimatedTouchable
            entering={FadeInUp.delay(100).duration(400)}
            onPress={handleEditAvatarPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[styles.avatarContainer, animatedStyle]}
            activeOpacity={0.8}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            {/* Edit Icon */}
            <View style={styles.editIconContainer}>
              <MaterialIcons name="edit" size={14} color={colors.onPrimary} />
            </View>
          </AnimatedTouchable>
        </View>

        {/* Name and Info */}
        <Animated.View
          entering={FadeInUp.delay(150).duration(400)}
          style={styles.infoContainer}
        >
          <Text style={styles.name}>{mockUser.name}</Text>

          <View style={styles.badgeContainer}>
            <View style={styles.memberBadge}>
              <Text style={styles.memberBadgeText}>Member ID: {mockUser.memberId}</Text>
            </View>
            <Text style={styles.memberSince}>Member since {mockUser.memberSince}</Text>
          </View>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

export default ProfileHeader;
