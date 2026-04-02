import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { SymbolView, SFSymbol } from 'expo-symbols';
import { useTheme , lightColors } from '@/contexts/ThemeContext';
import { theme } from '@/styles/theme';

type BackButtonColors = typeof lightColors;

interface BackButtonProps {
  onPress: () => void;
  icon?: SFSymbol;
  style?: ViewStyle;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  icon = 'arrow.left',
  style,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, style]}
    >
      <SymbolView
        name={icon}
        size={24}
        tintColor={colors.primary}
      />
    </TouchableOpacity>
  );
};

const createStyles = (colors: BackButtonColors) => StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: `${colors.surface}50`,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
