import React, { useState } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import { useTheme, lightColors } from "@/contexts/ThemeContext";
import { theme } from "@/styles/theme";
import { SymbolView, SFSymbol } from "expo-symbols";

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  error?: string;
  helper?: string;
  leftIcon?: SFSymbol;
  rightIcon?: SFSymbol;
  onRightIconPress?: () => void;
  editable?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
}

const createStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    container: {
      width: "100%",
    },
    label: {
      fontFamily: theme.typography.fontFamily.label,
      fontSize: theme.typography.size.xs,
      fontWeight: theme.typography.fontWeight.bold as any,
      color: colors.onSurfaceVariant,
      textTransform: "uppercase",
      letterSpacing: theme.typography.letterSpacing.widest,
      marginBottom: theme.spacing.md,
      marginLeft: theme.spacing.xs,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      height: 56,
      backgroundColor: colors.surfaceContainerLow,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: theme.spacing.lg,
      borderWidth: 0,
    },
    inputContainerFocused: {
      borderWidth: 2,
      borderColor: colors.primary,
    },
    inputContainerError: {
      borderWidth: 2,
      borderColor: colors.error,
      backgroundColor: colors.errorContainer,
    },
    inputContainerDisabled: {
      backgroundColor: colors.surfaceContainer,
      opacity: 0.6,
    },
    leftIcon: {
      marginRight: theme.spacing.md,
    },
    rightIcon: {
      marginLeft: theme.spacing.md,
    },
    input: {
      flex: 1,
      fontFamily: theme.typography.fontFamily.body,
      fontSize: theme.typography.size.md,
      fontWeight: theme.typography.fontWeight.medium as any,
      color: colors.onSurface,
      height: "100%",
    },
    inputWithLeftIcon: {
      paddingLeft: theme.spacing.sm,
    },
    inputWithRightIcon: {
      paddingRight: theme.spacing.sm,
    },
    helper: {
      fontFamily: theme.typography.fontFamily.body,
      fontSize: theme.typography.size.xs,
      color: colors.onSurfaceVariant,
      marginTop: theme.spacing.md,
      marginLeft: theme.spacing.base,
    },
    errorText: {
      color: colors.error,
    },
  });

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  error,
  helper,
  leftIcon,
  rightIcon,
  onRightIconPress,
  editable = true,
  style,
  inputStyle,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
          !editable && styles.inputContainerDisabled,
        ]}
      >
        {leftIcon && (
          <SymbolView
            name={leftIcon}
            size={20}
            tintColor={colors.onSurfaceVariant}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.onSurfaceVariant}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
            inputStyle,
          ]}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.rightIcon}>
            <SymbolView
              name={isPasswordVisible ? "eye.slash" : "eye"}
              size={20}
              tintColor={colors.onSurfaceVariant}
            />
          </TouchableOpacity>
        )}
        {rightIcon && !secureTextEntry && onRightIconPress && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
            <SymbolView name={rightIcon} size={20} tintColor={colors.onSurfaceVariant} />
          </TouchableOpacity>
        )}
        {rightIcon && !secureTextEntry && !onRightIconPress && (
          <View style={styles.rightIcon}>
            <SymbolView name={rightIcon} size={20} tintColor={colors.onSurfaceVariant} />
          </View>
        )}
      </View>
      {(error || helper) && (
        <Text style={[styles.helper, error && styles.errorText]}>{error || helper}</Text>
      )}
    </View>
  );
};
