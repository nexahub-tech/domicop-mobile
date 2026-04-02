import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { useTheme, lightColors } from '@/contexts/ThemeContext';
import { theme } from '@/styles/theme';
import { typography } from '@/constants/typography';
import { ProfileImagePicker } from '@/components/forms/ProfileImagePicker';
import { mockUser } from '@/data/mockData';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function EditProfileScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors, insets.bottom);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [profile, setProfile] = useState({
    name: mockUser.name,
    email: 'alex.johnson@email.com',
    phone: '+234 801 234 5678',
    avatar: null as string | null,
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});

  const handleImageSelect = (imageUri: string) => {
    setProfile({ ...profile, avatar: imageUri });
  };

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; phone?: string } = {};

    if (!profile.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!profile.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!profile.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSaving(false);
    Alert.alert('Success', 'Profile updated successfully!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* Header */}
      <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>Edit Profile</Text>
          <View style={styles.backButton} />
        </View>
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Profile Image Picker */}
          <Animated.View entering={FadeInUp.delay(100).duration(400)}>
            <ProfileImagePicker
              image={profile.avatar}
              name={profile.name}
              onImageSelect={handleImageSelect}
            />
          </Animated.View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Full Name */}
            <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.fieldContainer}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={profile.name}
                  onChangeText={(text) => setProfile({ ...profile, name: text })}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.onSurfaceVariant}
                />
                <MaterialIcons
                  name="person"
                  size={20}
                  color={colors.onSurfaceVariant}
                  style={styles.inputIcon}
                />
              </View>
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </Animated.View>

            {/* Email */}
            <Animated.View entering={FadeInUp.delay(300).duration(400)} style={styles.fieldContainer}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={profile.email}
                  onChangeText={(text) => setProfile({ ...profile, email: text })}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.onSurfaceVariant}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <MaterialIcons
                  name="mail"
                  size={20}
                  color={colors.onSurfaceVariant}
                  style={styles.inputIcon}
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </Animated.View>

            {/* Phone */}
            <Animated.View entering={FadeInUp.delay(400).duration(400)} style={styles.fieldContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={profile.phone}
                  onChangeText={(text) => setProfile({ ...profile, phone: text })}
                  placeholder="Enter your phone number"
                  placeholderTextColor={colors.onSurfaceVariant}
                  keyboardType="phone-pad"
                />
                <MaterialIcons
                  name="phone-iphone"
                  size={20}
                  color={colors.onSurfaceVariant}
                  style={styles.inputIcon}
                />
              </View>
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </Animated.View>
          </View>

          {/* Bottom padding */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <AnimatedTouchable
          entering={FadeInUp.delay(500).duration(400)}
          onPress={handleSave}
          disabled={isSaving}
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          activeOpacity={0.8}
        >
          {isSaving ? (
            <Text style={styles.saveButtonText}>Saving...</Text>
          ) : (
            <>
              <Text style={styles.saveButtonText}>Save Changes</Text>
              <MaterialIcons name="check-circle" size={20} color={colors.onPrimary} />
            </>
          )}
        </AnimatedTouchable>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: typeof lightColors, bottomInset: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.base,
  },
  backButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    minWidth: 44,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.headline,
    fontSize: typography.size.lg,
    fontWeight: typography.fontWeight.bold as any,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: theme.spacing.lg,
  },
  formContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  fieldContainer: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontFamily: typography.fontFamily.label,
    fontSize: typography.size.xs,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainer,
    borderRadius: theme.borderRadius.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  input: {
    flex: 1,
    height: 56,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.base,
    color: colors.onSurface,
    paddingRight: theme.spacing.lg,
  },
  inputIcon: {
    opacity: 0.5,
  },
  errorText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.xs,
    color: colors.error,
    marginTop: theme.spacing.xs,
  },
  bottomPadding: {
    height: 100,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.lg,
    paddingBottom: Math.max(bottomInset, theme.spacing.lg) + theme.spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: theme.borderRadius.xl,
    paddingVertical: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontFamily: typography.fontFamily.headline,
    fontSize: typography.size.base,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.onPrimary,
  },
});
