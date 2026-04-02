import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AuthSafeAreaViewProps {
  children: React.ReactNode;
  extendBottom?: boolean;
  extendTop?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export const AuthSafeAreaView: React.FC<AuthSafeAreaViewProps> = ({
  children,
  extendBottom = true,
  extendTop = false,
  style,
  contentStyle,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: extendTop ? 0 : insets.top,
          paddingBottom: extendBottom ? 0 : insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        style,
      ]}
    >
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default AuthSafeAreaView;
