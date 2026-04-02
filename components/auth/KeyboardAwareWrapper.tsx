import React from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ViewStyle,
} from 'react-native';

interface KeyboardAwareWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  keyboardVerticalOffset?: number;
}

export const KeyboardAwareWrapper: React.FC<KeyboardAwareWrapperProps> = ({
  children,
  style,
  contentContainerStyle,
  keyboardVerticalOffset = 0,
}) => {
  // For iOS, use KeyboardAvoidingView with padding behavior
  if (Platform.OS === 'ios') {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        style={[styles.container, style]}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        {children}
      </KeyboardAvoidingView>
    );
  }

  // For Android, use ScrollView with proper keyboard handling
  return (
    <ScrollView
      style={[styles.container, style]}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});

export default KeyboardAwareWrapper;
