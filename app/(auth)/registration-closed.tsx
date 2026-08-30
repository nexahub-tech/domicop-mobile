import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "@/components/common/Button";
import { BackButton } from "@/components/auth/BackButton";
import { useTheme } from "@/contexts/ThemeContext";
import type { lightColors } from "@/contexts/ThemeContext";
import { useRegistrationWindow } from "@/hooks/useRegistrationWindow";
import { theme } from "@/styles/theme";
import { font } from "@/constants/theme";
import type { RegistrationClosedReason } from "@/lib/types/registration";

const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/**
 * Why the portal is shut, in the applicant's words.
 *
 * Each reason gets its own copy because they call for different behaviour: a
 * scheduled intake is worth waiting for, a full one is not, and "nothing
 * scheduled" has no date to offer at all.
 */
function closedCopy(
  reason: RegistrationClosedReason | null,
  opensAt?: string,
  closesAt?: string,
): { title: string; body: string } {
  switch (reason) {
    case "not_yet_open":
      return {
        title: "Registration opens soon",
        body: opensAt
          ? `New members can apply from ${longDate(opensAt)}. Check back then.`
          : "New members will be able to apply once the cooperative opens this intake.",
      };
    case "period_ended":
      return {
        title: "Registration has closed",
        body: closesAt
          ? `This intake closed on ${longDate(closesAt)}. The cooperative will announce the next one.`
          : "This intake has closed. The cooperative will announce the next one.",
      };
    case "at_capacity":
      return {
        title: "This intake is full",
        body: "Every place in the current intake has been taken. The cooperative will announce the next one.",
      };
    default:
      return {
        title: "Registration is closed",
        body: "The cooperative registers new members during set periods. There is no intake open at the moment.",
      };
  }
}

/**
 * Shown instead of the sign-up form when applications are not being accepted.
 *
 * Reachable directly (welcome routes here) and as a redirect out of sign-up if
 * the window closes mid-form, so it reads its own state rather than taking it
 * as a param.
 */
export default function RegistrationClosedScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors);

  const { reason, window: win, lastWindow, isLoading, isUnavailable, refetch } =
    useRegistrationWindow();

  const { title, body } = isUnavailable
    ? {
        title: "We couldn't check registration",
        body: "Something went wrong reaching DOMICOOP. Check your connection and try again — registration may well be open.",
      }
    : closedCopy(reason, win?.opens_at, win?.closes_at);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { top: insets.top + theme.spacing.lg }]}>
        <BackButton onPress={() => router.back()} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + theme.spacing["3xl"] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconCircle}>
          <MaterialIcons
            name={isUnavailable ? "cloud-off" : "event-busy"}
            size={40}
            color={colors.onSurfaceVariant}
          />
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>

        {!isUnavailable && win && reason === "not_yet_open" && (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Next intake</Text>
            <Text style={styles.cardValue}>{win.name}</Text>
            <Text style={styles.cardMeta}>
              {longDate(win.opens_at)} — {longDate(win.closes_at)}
            </Text>
          </View>
        )}

        {!isUnavailable && !win && lastWindow && (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Last intake</Text>
            <Text style={styles.cardValue}>{lastWindow.name}</Text>
            <Text style={styles.cardMeta}>
              Closed {longDate(lastWindow.closes_at)}
            </Text>
          </View>
        )}

        <View style={styles.actions}>
          <Button
            title={isLoading ? "Checking…" : "Try again"}
            onPress={() => refetch()}
            variant="tonal"
            size="lg"
            fullWidth
            loading={isLoading}
          />
          <View style={styles.signInRow}>
            <Text style={styles.signInText}>Already a member? </Text>
            <Text style={styles.signInLink} onPress={() => router.push("/sign-in")}>
              Sign in
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      position: "absolute",
      left: theme.spacing.lg,
      right: theme.spacing.lg,
      zIndex: 10,
    },
    content: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: theme.spacing["2xl"],
      paddingTop: 120,
    },
    iconCircle: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: colors.surfaceContainer,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.xl,
    },
    title: {
      fontFamily: font("display", "bold"),
      fontSize: theme.typography.size["2xl"],
      color: colors.onSurface,
      textAlign: "center",
      marginBottom: theme.spacing.base,
    },
    body: {
      fontFamily: font("body", "regular"),
      fontSize: theme.typography.size.base,
      color: colors.onSurfaceVariant,
      textAlign: "center",
      lineHeight: theme.typography.size.base * 1.6,
    },
    card: {
      width: "100%",
      backgroundColor: colors.surfaceContainerLow,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginTop: theme.spacing.xl,
      gap: theme.spacing.xs,
    },
    cardLabel: {
      fontFamily: font("body", "bold"),
      fontSize: theme.typography.size.xs,
      color: colors.onSurfaceVariant,
      textTransform: "uppercase",
      letterSpacing: theme.typography.letterSpacing.widest,
    },
    cardValue: {
      fontFamily: font("display", "bold"),
      fontSize: theme.typography.size.lg,
      color: colors.onSurface,
    },
    cardMeta: {
      fontFamily: font("body", "regular"),
      fontSize: theme.typography.size.sm,
      color: colors.onSurfaceVariant,
    },
    actions: {
      width: "100%",
      marginTop: theme.spacing["2xl"],
    },
    signInRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: theme.spacing.xl,
      paddingVertical: theme.spacing.sm,
    },
    signInText: {
      fontFamily: font("body", "regular"),
      fontSize: theme.typography.size.base,
      color: colors.onSurfaceVariant,
    },
    signInLink: {
      fontFamily: font("body", "bold"),
      fontSize: theme.typography.size.base,
      color: colors.primaryBright,
    },
  });
