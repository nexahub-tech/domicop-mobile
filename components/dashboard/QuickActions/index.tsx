import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
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
import { mockQuickActions } from "@/data/mockData";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface QuickActionItemProps {
  icon: string;
  label: string;
  route: string;
  index: number;
  colors: typeof lightColors;
}

const createQuickActionItemStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    actionItem: {
      alignItems: "center",
      flex: 1,
      maxWidth: 80,
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: theme.borderRadius["2xl"],
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
    },
    actionLabel: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.xs - 2,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurfaceVariant,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginTop: theme.spacing.sm,
      textAlign: "center",
    },
  });

const QuickActionItem: React.FC<QuickActionItemProps> = ({
  icon,
  label,
  route,
  index,
  colors,
}) => {
  const router = useRouter();
  const scale = useSharedValue(1);
  const styles = createQuickActionItemStyles(colors);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    router.push(route as any);
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <AnimatedTouchable
      entering={FadeInUp.delay(200 + index * 50).duration(300)}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.actionItem, animatedStyle]}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons name={icon as any} size={28} color={colors.primary} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </AnimatedTouchable>
  );
};

const createStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    container: {
      marginTop: theme.spacing["2xl"],
      paddingHorizontal: theme.spacing.base,
    },
    sectionTitle: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.sm,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurfaceVariant,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: theme.spacing.lg,
      marginLeft: theme.spacing.xs,
    },
    actionsGrid: {
      flexDirection: "row",
      justifyContent: "flex-start",
      gap: theme.spacing.base,
    },
  });

export const QuickActions: React.FC = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Animated.Text entering={FadeIn.delay(200)} style={styles.sectionTitle}>
        Quick Actions
      </Animated.Text>

      <View style={styles.actionsGrid}>
        {mockQuickActions.map((action, index) => (
          <QuickActionItem
            key={action.id}
            icon={action.icon}
            label={action.label}
            route={action.route}
            index={index}
            colors={colors}
          />
        ))}
      </View>
    </View>
  );
};

export default QuickActions;
