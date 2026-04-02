import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  TextStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme, lightColors } from '@/contexts/ThemeContext';
import { theme } from '@/styles/theme';
import { typography } from '@/constants/typography';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  labelStyle?: TextStyle;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  labelStyle,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(checked ? 1 : 0.8, {
          damping: 15,
          stiffness: 300,
        }),
      },
    ],
  }));

  const handlePress = () => {
    onChange(!checked);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.container}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.checkbox,
          {
            backgroundColor: checked ? colors.primary : colors.surface,
            borderColor: checked ? colors.primary : colors.outline,
          },
        ]}
      >
        <Animated.View style={scaleStyle}>
          {checked && (
            <MaterialIcons name="check" size={14} color={colors.onPrimary} />
          )}
        </Animated.View>
      </View>
      {label && (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (colors: typeof lightColors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.sm,
    color: colors.onSurface,
    marginLeft: theme.spacing.sm,
  },
});

export default Checkbox;
