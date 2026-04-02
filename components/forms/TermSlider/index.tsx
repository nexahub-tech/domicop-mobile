import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { useTheme, lightColors } from "@/contexts/ThemeContext";
import { theme } from "@/styles/theme";
import { typography } from "@/constants/typography";
import { loanConfig } from "@/data/mockData";

type TermSliderColors = typeof lightColors;

interface TermSliderProps {
  value: number;
  onValueChange: (value: number) => void;
}

export const TermSlider: React.FC<TermSliderProps> = ({ value, onValueChange }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Repayment Term</Text>
        <View style={styles.valueBadge}>
          <Text style={styles.valueText}>{value} Months</Text>
        </View>
      </View>

      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={loanConfig.minTerm}
          maximumValue={loanConfig.maxTerm}
          step={3}
          value={value}
          onValueChange={onValueChange}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.surfaceContainer}
          thumbTintColor={colors.primary}
        />
      </View>

      <View style={styles.labelsContainer}>
        <Text style={styles.labelText}>{loanConfig.minTerm} MONTHS</Text>
        <Text style={styles.labelText}>{loanConfig.maxTerm} MONTHS</Text>
      </View>
    </View>
  );
};

const createStyles = (colors: TermSliderColors) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.lg,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    label: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.sm,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurface,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    valueBadge: {
      backgroundColor: colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
    },
    valueText: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.sm,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onPrimary,
    },
    sliderContainer: {
      backgroundColor: colors.surface,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: theme.spacing.base,
      paddingVertical: theme.spacing.sm,
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    slider: {
      width: "100%",
      height: 40,
    },
    labelsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: theme.spacing.xs,
    },
    labelText: {
      fontFamily: typography.fontFamily.label,
      fontSize: typography.size.xs - 2,
      fontWeight: typography.fontWeight.bold as any,
      color: colors.onSurfaceVariant,
      letterSpacing: 0.5,
    },
  });

export default TermSlider;
